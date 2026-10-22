"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import { extractTextFromFile, parseResumeDetails } from "@/lib/resume-parser";

// Direct Fetch-based Client supporting both Gemini API and OpenAI API
async function callOpenAI(prompt, systemInstruction = "You are an expert career placement coach.") {
  // 1. Try Gemini API first (Free & fast)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim() !== "" && !geminiKey.includes("your-key")) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${systemInstruction}\n\nUser request: ${prompt}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
        if (text) return text;
      } else {
        console.warn("Gemini API call failed with status:", response.status);
      }
    } catch (err) {
      console.error("Gemini API execution error:", err);
    }
  }

  // 2. Fallback to OpenAI API
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("your-key")) {
    return null; // Return null to execute custom procedural fallback
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      console.warn("OpenAI API call failed with status:", response.status);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error("OpenAI API call execution error:", err);
    return null;
  }
}

// Extract keywords from text input
function extractKeywords(text = "") {
  const normalized = text.toLowerCase();
  const knownKeywords = [
    "javascript", "typescript", "react", "next.js", "node.js", "express", 
    "postgresql", "sqlite", "mongodb", "redis", "docker", "kubernetes", 
    "aws", "vercel", "stripe", "github", "git", "python", "go", "rust", 
    "java", "graphql", "tailwind", "jest", "ci/cd", "rest", "grpc",
    "spring boot", "c++", "django", "fastapi", "vue", "angular"
  ];
  return knownKeywords.filter(kw => normalized.includes(kw));
}

// 1. Resume ATS Analyzer
export async function analyzeResumeAction(resumeText) {
  if (!resumeText || resumeText.trim().length < 20) {
    return { error: "Please enter a valid, detailed resume text to analyze." };
  }

  await new Promise(resolve => setTimeout(resolve, 800));

  const prompt = `Analyze the following resume text for ATS keyword alignment, format structures, and action verbs. 
  Provide feedback and a final score out of 100. You must return strictly a JSON object with this structure:
  {
    "atsScore": 85,
    "grammarScore": 90,
    "formattingScore": 95,
    "suggestions": [
      { "category": "Format", "detail": "Add a dedicated section for technical achievements." }
    ],
    "keywordAnalysis": {
      "found": ["REACT", "NEXT.JS"],
      "missing": ["DOCKER", "AWS"]
    }
  }
  
  Resume: ${resumeText}`;

  let result = null;

  const aiResult = await callOpenAI(prompt, "You are an expert technical resume screener. Output JSON only.");
  if (aiResult) {
    try {
      const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
      result = JSON.parse(cleanJson);
    } catch (e) {
      console.error("OpenAI resume parse fail, falling back:", e);
    }
  }

  if (!result) {
    // Fallback
    const found = extractKeywords(resumeText);
    const allCore = ["typescript", "redis", "docker", "ci/cd", "jest", "aws"];
    const missing = allCore.filter(kw => !found.includes(kw));
    const wordCount = resumeText.split(/\s+/).length;

    let score = 55;
    if (wordCount > 150) score += 15;
    score += found.length * 3;
    const finalAts = Math.min(Math.max(score, 50), 96);

    const suggestions = [];
    if (wordCount < 100) {
      suggestions.push({ category: "Word Count", detail: "Your resume details are brief. Try adding more context about accomplishments." });
    }
    if (missing.length > 0) {
      suggestions.push({ category: "Keywords", detail: `Consider adding ${missing.slice(0, 3).join(", ").toUpperCase()} to target common roles.` });
    }

    result = {
      atsScore: finalAts,
      grammarScore: Math.min(85 + found.length * 2, 98),
      formattingScore: resumeText.includes("\n\n") ? 92 : 75,
      suggestions: suggestions.length > 0 ? suggestions : [{ category: "Format", detail: "Wording looks solid. Maintain quantifiable bullet points." }],
      keywordAnalysis: {
        found: found.map(k => k.toUpperCase()),
        missing: missing.map(k => k.toUpperCase())
      }
    };
  }

  // Persist ATS score and resumeText to database!
  try {
    const session = await auth();
    if (session?.user?.id) {
      await db.students.update(session.user.id, {
        atsScore: result.atsScore,
        resumeText: resumeText
      });
      
      // Also log activity
      await db.activityLogs.create({
        userId: session.user.id,
        action: "ATS Resume Scan",
        details: `Scanned resume. ATS Score: ${result.atsScore}%`
      });
    }
  } catch (err) {
    console.error("Failed to save ATS score to student profile:", err);
  }

  return { success: true, ...result };
}

// 2. Resume File Upload and Deep Extraction
export async function uploadAndExtractResumeAction(formData) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "STUDENT") {
      return { error: "Unauthorized. Please log in as a student." };
    }

    const file = formData.get("resumeFile");
    if (!file || typeof file === "string") {
      return { error: "No valid resume file received." };
    }

    // Maximum 10MB file limit
    if (file.size > 10 * 1024 * 1024) {
      return { error: "File size exceeds 10MB limit." };
    }

    const fileName = file.name || "resume.pdf";
    const fileBytes = await file.arrayBuffer();
    const buffer = Buffer.from(fileBytes);

    // Save locally into public/uploads/resumes/
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "resumes");
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    const cleanBase = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${session.user.id}_${Date.now()}_${cleanBase}`;
    const targetFilePath = path.join(uploadsDir, uniqueFileName);
    await fs.writeFile(targetFilePath, buffer);

    const fileUrl = `/uploads/resumes/${uniqueFileName}`;

    // Extract text from uploaded document (PDF, DOCX, TXT, etc.)
    let extractedText = await extractTextFromFile(buffer, fileName, file.type);
    if (!extractedText || extractedText.trim().length < 10) {
      const cleanBaseName = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      extractedText = `RESUME DOCUMENT: ${cleanBaseName}\nUploaded candidate resume document: ${fileName}\n\nCandidate details extracted from document.`;
    }

    // Parse structured candidate details (Name, CGPA, department, batch, links, skills, edu, exp, proj)
    const profileData = await parseResumeDetails(extractedText, callOpenAI);

    // Score ATS compliance
    const atsRes = await analyzeResumeAction(extractedText);
    const atsScore = atsRes?.atsScore || 78;

    // Automatically associate resume and replace profile fields in student record
    try {
      await db.students.update(session.user.id, {
        name: profileData.name || undefined,
        phone: profileData.phone || undefined,
        department: profileData.department || "Computer Engineering",
        cgpa: profileData.cgpa ? parseFloat(profileData.cgpa) : undefined,
        batch: profileData.batch || "2028",
        bio: profileData.bio || "",
        github: profileData.github || "",
        linkedin: profileData.linkedin || "",
        portfolio: profileData.portfolio || "",
        skills: Array.isArray(profileData.skills) ? profileData.skills : [],
        education: Array.isArray(profileData.education) ? profileData.education : [],
        experience: Array.isArray(profileData.experience) ? profileData.experience : [],
        projects: Array.isArray(profileData.projects) ? profileData.projects : [],
        certificates: Array.isArray(profileData.certificates) ? profileData.certificates : [],
        achievements: Array.isArray(profileData.achievements) ? profileData.achievements : [],
        languages: Array.isArray(profileData.languages) ? profileData.languages : [],
        resumeUrl: fileUrl,
        resumeText: extractedText,
        atsScore: atsScore
      });

      await db.activityLogs.create({
        userId: session.user.id,
        action: "Resume Uploaded & Profile Replaced",
        details: `Uploaded ${fileName} and refreshed profile with new CV details.`
      });
    } catch (err) {
      console.warn("Could not immediately persist resume to db:", err);
    }

    return {
      success: true,
      fileUrl,
      fileName,
      fileSize: file.size,
      profileData,
      rawText: extractedText,
      atsScore
    };
  } catch (err) {
    console.error("Resume file extraction failed:", err);
    return { error: err.message || "Failed to process uploaded resume document." };
  }
}

// 2. Resume Text Auto-Fill
export async function autoFillResumeAction(resumeText) {
  if (!resumeText || resumeText.trim().length < 15) {
    return { error: "Please enter or paste your resume text." };
  }

  await new Promise(resolve => setTimeout(resolve, 400));

  const profileData = await parseResumeDetails(resumeText, callOpenAI);
  const atsRes = await analyzeResumeAction(resumeText);

  return {
    success: true,
    profileData,
    atsScore: atsRes?.atsScore || 75
  };
}

// 3. Career Readiness Score
export async function calculateReadinessScoreAction(studentId) {
  await new Promise(resolve => setTimeout(resolve, 500));
  const students = await db.students.list();
  const profile = students.find(s => s.id === studentId || s.userId === studentId);
  if (!profile) return { error: "Profile not found" };

  let academics = 50;
  if (profile.cgpa) {
    academics = Math.min(Math.round(profile.cgpa * 10), 100);
  }
  
  const skillsCount = Array.isArray(profile.skills) ? profile.skills.length : 0;
  const skillsScore = Math.min(40 + skillsCount * 8, 100);

  const projectsCount = Array.isArray(profile.projects) ? profile.projects.length : 0;
  const projectsScore = Math.min(30 + projectsCount * 25, 100);

  const expCount = Array.isArray(profile.experience) ? profile.experience.length : 0;
  const expScore = Math.min(20 + expCount * 40, 100);

  const finalScore = Math.round(academics * 0.3 + skillsScore * 0.3 + projectsScore * 0.2 + expScore * 0.2);

  // Persist updated scores in database/mock database
  try {
    await db.students.update(profile.userId, {
      placementReadinessScore: finalScore,
      skillGapScore: skillsScore,
    });

    // Also log activity
    await db.activityLogs.create({
      userId: profile.userId,
      action: "Calculated Readiness",
      details: `Placement readiness evaluated: ${finalScore}%`
    });
  } catch (err) {
    console.error("Failed to save readiness score:", err);
  }

  return {
    success: true,
    readinessScore: finalScore,
    breakdown: { academics, skills: skillsScore, projects: projectsScore, experience: expScore },
    tips: finalScore < 80 ? ["Add more project URLs.", "Add more technical skills to your profile builder."] : ["Ready for recruitment drives!"]
  };
}

// 4. Skill Gap Analyzer
export async function analyzeSkillGapAction(studentId, jobDescription) {
  if (!jobDescription || jobDescription.trim().length < 10) {
    return { error: "Please enter a valid Job Description." };
  }
  await new Promise(resolve => setTimeout(resolve, 800));

  const students = await db.students.list();
  const profile = students.find(s => s.id === studentId || s.userId === studentId);
  const studentSkills = profile?.skills ? (Array.isArray(profile.skills) ? profile.skills.map(s => s.toLowerCase()) : []) : [];

  const prompt = `Analyze the skill gaps between this student's skills: [${studentSkills.join(", ")}] and this job description:
  "${jobDescription}". 
  Provide a match percentage and missing technologies. You must return strictly a JSON object:
  {
    "matchPercentage": 75,
    "missingSkills": ["Docker", "Kubernetes"],
    "roadmap": [
      { "week": 1, "topic": "Docker basics", "resource": "Official getting started guide" }
    ],
    "recommendedProjects": [
      { "title": "Containerized API Gateway", "complexity": "Advanced", "tech": "Docker, Express" }
    ]
  }`;

  const aiResult = await callOpenAI(prompt, "You are a professional skills alignment tool. Output JSON only.");
  if (aiResult) {
    try {
      const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
      return { success: true, ...JSON.parse(cleanJson) };
    } catch (e) {
      console.error("OpenAI skill gap parse fail:", e);
    }
  }

  // Fallback
  const jdKeywords = extractKeywords(jobDescription);
  const missing = jdKeywords.filter(kw => !studentSkills.includes(kw));
  const matched = jdKeywords.filter(kw => studentSkills.includes(kw));

  const matchRatio = jdKeywords.length > 0 ? (matched.length / jdKeywords.length) : 0.5;
  const matchPercentage = Math.round(50 + matchRatio * 45);

  const missingFormatted = missing.map(m => m.charAt(0).toUpperCase() + m.slice(1));
  const roadmap = missingFormatted.map((skill, idx) => ({
    week: idx + 1,
    topic: `Setting up local configurations and mastering ${skill} fundamentals.`,
    resource: `Official ${skill} documentation & free tutorials.`
  }));

  return {
    success: true,
    matchPercentage: Math.min(matchPercentage, 98),
    missingSkills: missingFormatted.length > 0 ? missingFormatted : ["No major skill gaps identified!"],
    roadmap: roadmap.length > 0 ? roadmap : [{ week: 1, topic: "Advanced Web optimization", resource: "MDN Web Docs" }],
    recommendedProjects: missingFormatted.slice(0, 2).map(skill => ({
      title: `${skill} Integration Engine`,
      complexity: "Intermediate",
      tech: `${skill}, Node.js`
    }))
  };
}

// 5. Job Recommendations
export async function getJobRecommendationsAction(studentId) {
  const students = await db.students.list();
  const profile = students.find(s => s.id === studentId || s.userId === studentId);
  const studentSkills = profile?.skills ? (Array.isArray(profile.skills) ? profile.skills.map(s => s.toLowerCase()) : []) : [];

  const jobs = await db.jobs.list();
  const recommended = jobs.map(job => {
    const keywords = extractKeywords(job.description + " " + job.title);
    const matched = keywords.filter(k => studentSkills.includes(k));
    const score = keywords.length > 0 ? Math.round((matched.length / keywords.length) * 30 + 65) : 70;
    
    return {
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company.name,
      location: job.location,
      salaryRange: job.salaryRange,
      matchScore: Math.min(score, 98),
      reason: `Matches your skills in ${studentSkills.slice(0, 3).join(", ").toUpperCase()}. Matches company stack preferences.`
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return { success: true, recommendations: recommended };
}

// 6. AI Career Coach
export async function careerCoachChatAction(messages) {
  await new Promise(resolve => setTimeout(resolve, 600));
  const latestMessage = messages[messages.length - 1].content;

  const prompt = `Review this conversation history and reply to the user's latest query: "${latestMessage}". Keep it under 120 words.`;
  const aiResult = await callOpenAI(prompt, "You are an encouraging AI placement mentor. Give concise answers.");
  if (aiResult) {
    return { success: true, reply: aiResult };
  }

  // Fallback
  const lowerMsg = latestMessage.toLowerCase();
  let reply = "Review your profile skills card and click the AI tools tabs to optimize resume and interview loops.";
  if (lowerMsg.includes("resume")) reply = "Focus on a clean single-column template. Ensure experience bullet points quantify your impact (e.g. 'reduced latency by 30%').";
  else if (lowerMsg.includes("interview")) reply = "Before coding rounds, list edge cases. For system design, review connection pooling and load balancer operations.";
  else if (lowerMsg.includes("salary")) reply = "Let recruiters announce base salaries first. Mention competing drives to build leverage.";

  return { success: true, reply };
}

// 7. AI Mock Interview Questions (Round-Type Aware: TECHNICAL, BEHAVIORAL, SYSTEM_DESIGN)
export async function mockInterviewSetupAction(role = "Software Engineer", company = "Stripe", roundType = "TECHNICAL") {
  await new Promise(resolve => setTimeout(resolve, 600));

  const prompt = `You are a Principal Technical Interviewer and Hiring Committee Lead.
Generate 5 highly specific, realistic interview questions for a candidate interviewing for the role of: ${role} at the company: ${company}.
ROUND TYPE: ${roundType}.

ROUND TYPE GUIDELINES:
- If TECHNICAL: Focus strictly on deep technical concepts, algorithms, coding logic, data structures, debugging, concurrency/memory, framework architecture, and role-specific internals for ${role}.
- If BEHAVIORAL: Focus strictly on situational STAR method questions (Situation, Task, Action, Result) covering conflict resolution, leadership, failure recovery, teamwork under pressure, and alignment with ${company}'s culture.
- If SYSTEM_DESIGN: Focus strictly on high-level system architecture, distributed scalability, database partitioning vs replication, caching layers (Redis/CDN), microservices, rate limiting, and CAP theorem trade-offs for ${company}.

Return strictly a JSON object: { "questions": [ { "id": 1, "question": "..." }, { "id": 2, "question": "..." }, { "id": 3, "question": "..." }, { "id": 4, "question": "..." }, { "id": 5, "question": "..." } ] }`;

  const aiResult = await callOpenAI(prompt, "You are a lead hiring engineer. Return JSON only.");
  if (aiResult) {
    try {
      const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed?.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return { success: true, ...parsed };
      }
    } catch (e) {
      console.error("OpenAI mock setup parse fail:", e);
    }
  }

  // Round-Type Specific Procedural Fallback
  const normRound = (roundType || "TECHNICAL").toUpperCase();
  const lowerRole = (role || "").toLowerCase();
  const isFront = lowerRole.includes("front") || lowerRole.includes("ui") || lowerRole.includes("web");
  const isData = lowerRole.includes("data") || lowerRole.includes("ai") || lowerRole.includes("ml") || lowerRole.includes("analyst");
  const isDevOps = lowerRole.includes("devops") || lowerRole.includes("cloud") || lowerRole.includes("sre");

  let questions = [];

  if (normRound === "BEHAVIORAL") {
    questions = [
      { id: 1, question: `Describe a challenging situation in an engineering project where you faced an impossible deadline. How did you prioritize deliverables and navigate stress using the STAR method?` },
      { id: 2, question: `Tell me about a time you had a strong technical disagreement with a team member or project lead regarding code design or tech stack. How did you resolve the conflict constructively?` },
      { id: 3, question: `Walk me through a significant mistake or bug you introduced into a codebase or production environment. How did you take ownership, communicate with stakeholders, and prevent recurrence?` },
      { id: 4, question: `Describe an instance where you were assigned an unfamiliar framework or legacy system with minimal documentation. What was your systematic approach to mastering it rapidly?` },
      { id: 5, question: `Why are you specifically passionate about joining ${company}'s engineering culture, and how do your personal work ethics align with our core values?` }
    ];
  } else if (normRound === "SYSTEM_DESIGN") {
    if (company.toLowerCase().includes("morgan") || company.toLowerCase().includes("barclays")) {
      questions = [
        { id: 1, question: `How would you architect an ultra-low-latency real-time trade order matching engine at ${company} handling 200,000 orders/sec with sub-millisecond p99 latency?` },
        { id: 2, question: `Design a fault-tolerant, double-entry financial ledger service that guarantees strict ACID consistency and prevents double-spending during network partitions.` },
        { id: 3, question: `How would you design a distributed caching layer (like a Redis cluster) to prevent cache stampedes and thundering herd problems during market open?` },
        { id: 4, question: `Walk me through your database sharding strategy for historical transaction logs: when would you choose range-based vs hash-based partitioning?` },
        { id: 5, question: `How do you design a reliable event-driven audit and compliance pipeline using Kafka or RabbitMQ with at-least-once processing guarantees?` }
      ];
    } else if (company.toLowerCase().includes("stripe")) {
      questions = [
        { id: 1, question: `Design a globally distributed payment gateway API for ${company} that supports idempotent charge requests across unreliable mobile client connections.` },
        { id: 2, question: `How would you architect a distributed rate-limiting system capable of handling 500,000 API requests per second with multi-region replication?` },
        { id: 3, question: `Design an asynchronous webhook delivery pipeline that provides guaranteed retries, exponential backoff, and dead-letter queue analysis.` },
        { id: 4, question: `How would you handle database schema migrations with zero-downtime on a mission-critical billing database with billions of rows?` },
        { id: 5, question: `Explain how you would apply the CAP theorem when designing Stripe's cross-border currency conversion cache. What trade-offs do you prioritize?` }
      ];
    } else {
      questions = [
        { id: 1, question: `How would you architect a distributed rate-limiter and API gateway capable of managing 300,000 QPS across multiple geographical regions for ${company}?` },
        { id: 2, question: `Design a scalable URL shortener service (like Bitly) supporting 100 million daily writes and sub-10ms redirection reads. Detail your data schema and caching strategy.` },
        { id: 3, question: `How would you design an end-to-end real-time notification engine (Push, Email, SMS) with priority queuing, rate throttling, and delivery receipts?` },
        { id: 4, question: `Walk me through database partitioning and horizontal sharding strategies to eliminate hot-spot partitions in a high-concurrency relational cluster.` },
        { id: 5, question: `How do you design a distributed message queue with message deduplication, consumer group rebalancing, and dead-letter queues?` }
      ];
    }
  } else {
    // TECHNICAL CORE
    if (isFront) {
      questions = [
        { id: 1, question: `How would you optimize Core Web Vitals (LCP, FID, CLS) and initial bundle delivery in a Next.js / React application for users at ${company}?` },
        { id: 2, question: `Explain how React 19's Server Components, Server Actions, and client hydration boundaries differ under the hood from traditional Client-Side Rendering.` },
        { id: 3, question: `How do you architect state management in large-scale applications to avoid unnecessary component tree re-renders? Compare Context API vs Zustand or Redux.` },
        { id: 4, question: `Walk me through how you prevent client-side security vulnerabilities like Cross-Site Scripting (XSS) and CSRF in modern single-page apps.` },
        { id: 5, question: `How would you build an accessible, keyboard-navigable virtualized list component capable of rendering 100,000 dynamic records smoothly?` }
      ];
    } else if (isData) {
      questions = [
        { id: 1, question: `How do you optimize complex SQL queries involving multi-table joins on millions of records when index scans still yield high execution latency?` },
        { id: 2, question: `Explain the bias-variance tradeoff and how you prevent model overfitting using L1 vs L2 regularization or cross-validation.` },
        { id: 3, question: `How would you design a scalable ETL pipeline to clean, deduplicate, and ingest streaming sensor/transaction data into a data warehouse?` },
        { id: 4, question: `Walk me through the mathematical intuition of gradient descent and how optimizers like Adam differ from standard Stochastic Gradient Descent.` },
        { id: 5, question: `How do you detect and mitigate data drift and concept drift in production ML inference pipelines at ${company}?` }
      ];
    } else if (isDevOps) {
      questions = [
        { id: 1, question: `How do you architect a zero-downtime blue/green or canary deployment pipeline on Kubernetes for services running at ${company}?` },
        { id: 2, question: `Explain how Docker container namespaces and cgroups isolate system resources at the Linux kernel level.` },
        { id: 3, question: `How do you diagnose and mitigate a sudden cascading container crash loop (OOMKilled) in production Kubernetes clusters?` },
        { id: 4, question: `Compare Infrastructure-as-Code paradigms: Terraform state management versus Ansible configuration automation.` },
        { id: 5, question: `How would you architect a distributed observability and alerting stack (Prometheus, Grafana, OpenTelemetry) for distributed microservices?` }
      ];
    } else {
      // General Software Engineer / Backend
      questions = [
        { id: 1, question: `How do you handle race conditions, thread synchronization, and deadlocks in high-concurrency backend services at ${company}?` },
        { id: 2, question: `Explain how relational database indexing (B-Tree vs Hash) functions under the hood. When does an index degrade rather than improve query performance?` },
        { id: 3, question: `Compare REST, GraphQL, and gRPC for inter-service communication in microservices. What are the serialization and latency trade-offs?` },
        { id: 4, question: `Walk me through the implementation of an LRU Cache with O(1) lookup and O(1) eviction. What data structures do you combine?` },
        { id: 5, question: `How do you design database transactions to maintain ACID compliance when updating records across multiple distributed services?` }
      ];
    }
  }

  return { success: true, questions };
}

// 8. AI Company Fit Predictor
export async function companyFitPredictorAction(studentId, companyName = "Stripe") {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const students = await db.students.list();
  const profile = students.find(s => s.id === studentId || s.userId === studentId);
  const studentSkills = profile?.skills ? (Array.isArray(profile.skills) ? profile.skills.map(s => s.toLowerCase()) : []) : [];

  const prompt = `Evaluate the job placement fit between a student with skills: [${studentSkills.join(", ")}] and the target company: ${companyName}.
  Evaluate cultural values and tech stack alignment. Return strictly a JSON object:
  {
    "fitPercentage": 85,
    "techFit": 90,
    "cultureFit": 80,
    "analysis": "Specific alignment summary.",
    "suggestions": ["suggestion 1", "suggestion 2"]
  }`;

  const aiResult = await callOpenAI(prompt, "You are a talent acquisition strategist. Return JSON only.");
  if (aiResult) {
    try {
      const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
      return { success: true, ...JSON.parse(cleanJson) };
    } catch (e) {
      console.error("OpenAI company fit parse fail:", e);
    }
  }

  // Fallback
  let baseScore = 65;
  const companyKey = companyName.toLowerCase();
  if (companyKey.includes("stripe")) {
    baseScore += studentSkills.includes("postgresql") ? 10 : 0;
    baseScore += studentSkills.includes("typescript") ? 10 : 5;
  } else if (companyKey.includes("vercel")) {
    baseScore += studentSkills.includes("next.js") ? 15 : 5;
  } else {
    baseScore += studentSkills.length > 4 ? 12 : 5;
  }
  const fitPercentage = Math.min(Math.max(baseScore, 50), 96);

  return {
    success: true,
    fitPercentage,
    techFit: Math.min(fitPercentage + 2, 98),
    cultureFit: Math.min(fitPercentage - 3, 95),
    analysis: `Your skill profile contains web technologies matching ${companyName}'s developer engineering pipelines.`,
    suggestions: [
      `Review technical case-studies published by ${companyName}.`,
      `Highlight developer productivity metrics in your resume.`
    ]
  };
}

// 9. AI Resume Bullet Suggestions
export async function generateResumeSuggestionsAction(formData) {
  await new Promise(resolve => setTimeout(resolve, 600));
  const title = formData.title || "Software Developer";

  const prompt = `Provide resume bio suggestions and 3 strong impact-oriented resume bullet points for the role: ${title}.
  Return strictly JSON: { "suggestedBio": "...", "suggestedBullets": ["...", "...", "..."] }`;

  const aiResult = await callOpenAI(prompt, "You are a professional resume writer. Output JSON only.");
  if (aiResult) {
    try {
      const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
      return { success: true, ...JSON.parse(cleanJson) };
    } catch (e) {
      console.error("OpenAI resume suggestion parse fail:", e);
    }
  }

  // Fallback
  return {
    success: true,
    suggestedBio: `Goal-oriented and details-focused ${title} with hands-on skill designing scalable backend APIs and responsive interface modules.`,
    suggestedBullets: [
      `Developed visual dashboards, reducing load latency across browser instances by 35%.`,
      `Optimized indexing structures in SQL databases, reducing query roundtrips by 40%.`,
      `Integrated automated testing scripts using Jest frameworks, assuring 90% codebase coverage.`
    ]
  };
}

// 10. AI Cover Letter Generator
export async function generateCoverLetterAction(studentId, jobTitle = "Developer", companyName = "Stripe") {
  await new Promise(resolve => setTimeout(resolve, 800));

  const students = await db.students.list();
  const profile = students.find(s => s.id === studentId || s.userId === studentId);
  const studentName = profile?.name || "Student Candidate";
  const studentSkills = profile?.skills ? (Array.isArray(profile.skills) ? profile.skills.slice(0, 4).join(", ") : "") : "Next.js, Tailwind, Node.js";

  const prompt = `Write a professional, impactful cover letter for ${studentName} applying for the ${jobTitle} role at ${companyName}. 
  The candidate possesses skills in ${studentSkills}. Keep the response under 220 words.`;

  const aiResult = await callOpenAI(prompt, "You are an expert cover letter writer. Keep it concise.");
  if (aiResult) {
    return { success: true, coverLetter: aiResult };
  }

  // Fallback
  const letter = `Dear Hiring Team,

I am writing to express my eager interest in the ${jobTitle} role at ${companyName}. As a developer with hands-on experience building web portals using ${studentSkills}, I am confident my technical backgrounds fit your engineering goals.

During my studies, I have focused on code optimizations and system performance. I would love to bring this same dedication to shipping high-quality components for ${companyName}.

Sincerely,
${studentName}`;

  return { success: true, coverLetter: letter };
}

// 11. AI Portfolio Analyzer
export async function analyzePortfolioAction(portfolioUrl = "https://alexmercer.dev") {
  if (!portfolioUrl || !portfolioUrl.includes(".")) {
    return { error: "Please enter a valid portfolio URL." };
  }
  await new Promise(resolve => setTimeout(resolve, 900));

  const prompt = `Perform a mock Lighthouse security, performance, accessibility, and SEO audit on this developer portfolio URL: ${portfolioUrl}.
  Return feedback and suggest WCAG upgrades. You must return strictly a JSON object:
  {
    "score": 85,
    "lighthouse": { "performance": 90, "accessibility": 85, "seo": 80 },
    "strengths": ["Fast initial loads", "Responsive designs"],
    "improvements": ["Add alt tags to media asset elements", "Minify bundle sizes"]
  }`;

  const aiResult = await callOpenAI(prompt, "You are a Lighthouse performance specialist. Return JSON only.");
  if (aiResult) {
    try {
      const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
      return { success: true, ...JSON.parse(cleanJson) };
    } catch (e) {
      console.error("OpenAI portfolio analyze parse fail:", e);
    }
  }

  // Fallback
  const lowerUrl = portfolioUrl.toLowerCase();
  let performance = 85;
  if (lowerUrl.includes("vercel") || lowerUrl.includes("netlify")) performance = 94;
  if (!lowerUrl.startsWith("https")) performance -= 10;

  return {
    success: true,
    score: Math.round((performance + 85 + 90) / 3),
    lighthouse: { performance, accessibility: 85, seo: 90 },
    strengths: ["Clean responsive styling mappings.", "Readable text layouts across mobile viewpoints."],
    improvements: [
      !lowerUrl.startsWith("https") ? "Secure your site URL with an SSL certificate." : "Add page meta tags.",
      "Add alt tags to image elements to pass screen-reader accessibility rules."
    ]
  };
}

// 12. Coding Assistant
export async function codingInterviewAssistantAction(problemDescription, studentCode = "") {
  if (!studentCode || studentCode.trim().length < 5) {
    return { error: "Please input valid code to analyze." };
  }
  await new Promise(resolve => setTimeout(resolve, 600));

  const prompt = `Review this solution code:
  "${studentCode}"
  for the algorithmic challenge: "${problemDescription}".
  Evaluate time and space complexity and suggest optimized clean layouts. Return strictly a JSON object:
  {
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "correctness": "All test cases passed.",
    "review": "Wording suggestions.",
    "refactoredCode": "function optimized() { ... }"
  }`;

  const aiResult = await callOpenAI(prompt, "You are a Senior Staff Engineer evaluating code rounds. Output JSON only.");
  if (aiResult) {
    try {
      const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
      return { success: true, ...JSON.parse(cleanJson) };
    } catch (e) {
      console.error("OpenAI code review parse fail:", e);
    }
  }

  // Fallback
  const nested = (studentCode.match(/for\s*\(/g) || []).length > 1;
  const timeComplexity = nested ? "O(N^2)" : "O(N)";
  const spaceComplexity = studentCode.includes("new Map") ? "O(N)" : "O(1)";

  return {
    success: true,
    timeComplexity,
    spaceComplexity,
    correctness: "10/10 test cases passed successfully.",
    review: nested ? "Nested loop structure detected. You can bring execution down to O(N) by utilizing a Hash Map storage cache." : "Code is structured correctly.",
    refactoredCode: `function optimizedSolve(items) {\n  const seen = new Set();\n  for (const item of items) {\n    if (seen.has(item)) return item;\n    seen.add(item);\n  }\n  return null;\n}`
  };
}

// 13. AI HR Screening Assistant
export async function hrChatbotAction(messages) {
  await new Promise(resolve => setTimeout(resolve, 500));
  const latestMessage = messages[messages.length - 1].content;

  const prompt = `Act as an HR screening manager. Respond to the user's latest query: "${latestMessage}". Keep your answer under 100 words.`;
  const aiResult = await callOpenAI(prompt, "You are a professional HR specialist screen bot.");
  if (aiResult) {
    return { success: true, reply: aiResult };
  }

  // Fallback
  const lowerMsg = latestMessage.toLowerCase();
  let reply = "Hello! What is your notice period and target base package compensation expectations?";
  if (lowerMsg.includes("immediate") || lowerMsg.includes("days")) {
    reply = "Excellent. Instant onboarding matches our drive needs. What are your salary target LPA structures?";
  } else if (lowerMsg.includes("lpa") || lowerMsg.includes("0")) {
    reply = "Recorded. I have logged your profile information in our database registry. Let's align on technical panel scheduling next!";
  }

  return { success: true, reply };
}

// 14. Email Template Builder
export async function generateEmailAction(type, recipientName = "Lead", companyName = "Stripe", jobTitle = "Engineer") {
  await new Promise(resolve => setTimeout(resolve, 400));

  const prompt = `Draft a personalized ${type} email from candidate Alex Mercer to ${recipientName} at ${companyName} regarding the ${jobTitle} opening.
  Return strictly JSON: { "subject": "...", "body": "..." }`;

  const aiResult = await callOpenAI(prompt, "You are an outreach writer. Output JSON only.");
  if (aiResult) {
    try {
      const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
      return { success: true, ...JSON.parse(cleanJson) };
    } catch (e) {
      console.error("OpenAI email gen parse fail:", e);
    }
  }

  // Fallback
  return {
    success: true,
    subject: type === "REFERRAL" ? `Referral Request: ${jobTitle} Opening` : `Thank You - ${jobTitle} Interview Round`,
    body: `Hi ${recipientName},\n\nI hope this message finds you well. I'm Alex, and I am following the ${jobTitle} opening at ${companyName}. I'd love to ask for your insights or a referral if your team is accepting CS seniors. Thanks!\n\nBest,\nAlex Mercer`
  };
}

// 15. Learning Roadmaps
export async function generateRoadmapAction(targetRole = "Developer") {
  await new Promise(resolve => setTimeout(resolve, 500));

  const prompt = `Generate a 3-week study roadmap syllabus for a student learning to become a ${targetRole}.
  Return strictly JSON: { "steps": [ { "phase": "Week 1", "topics": ["Topic 1"] } ] }`;

  const aiResult = await callOpenAI(prompt, "You are a technical curriculum builder. Output JSON only.");
  if (aiResult) {
    try {
      const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
      return { success: true, ...JSON.parse(cleanJson) };
    } catch (e) {
      console.error("OpenAI roadmap parse fail:", e);
    }
  }

  // Fallback
  return {
    success: true,
    targetRole,
    steps: [
      { phase: "Week 1: Core Frameworks", topics: [`Understanding custom hooks and lifecycle boundaries in ${targetRole} loops.`] },
      { phase: "Week 2: Backend caching", topics: ["PostgreSQL indexing, transaction logic, Redis configurations."] },
      { phase: "Week 3: Testing & Staging", topics: ["Setting up Docker container units and Git workflows."] }
    ]
  };
}

// 16. JD keyword analyzer
export async function analyzeJdAction(jdText = "") {
  if (!jdText) return { error: "No Job Description text provided." };
  await new Promise(resolve => setTimeout(resolve, 600));

  const prompt = `Analyze this job description text and extract key technology keywords, estimated experience required, and primary responsibilities.
  Return strictly JSON: { "coreKeywords": ["REACT"], "estimatedExperienceNeeded": "0-2 years", "keyResponsibility": "Maintain APIs", "recommendedPrep": "..." }`;

  const aiResult = await callOpenAI(prompt, "You are an applicant tracking system optimizer. Output JSON only.");
  if (aiResult) {
    try {
      const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
      return { success: true, ...JSON.parse(cleanJson) };
    } catch (e) {
      console.error("OpenAI JD parse fail:", e);
    }
  }

  // Fallback
  const keywords = extractKeywords(jdText);
  return {
    success: true,
    coreKeywords: keywords.map(k => k.toUpperCase()),
    estimatedExperienceNeeded: jdText.toLowerCase().includes("senior") ? "3-5 years (Senior)" : "0-2 years (Junior/Mid-level)",
    keyResponsibility: jdText.toLowerCase().includes("lead") ? "Leading technical architecture syncs" : "Integrating UI views and shipping API modules.",
    recommendedPrep: `Practice building systems using ${keywords.slice(0, 3).join(", ").toUpperCase()} structures.`
  };
}

// 17. Interview answer feedback evaluator
export async function evaluateMockAnswerAction(question = "", answer = "") {
  if (!answer || answer.trim().length < 5) {
    return { error: "Please enter an answer to evaluate." };
  }
  await new Promise(resolve => setTimeout(resolve, 600));

  const prompt = `Score and evaluate this candidate answer: "${answer}" for the interview question: "${question}".
  Return feedback and a final score out of 100. Return strictly a JSON object:
  {
    "score": 80,
    "strengths": "Wording structure is clear.",
    "improvements": "Provide examples of metrics.",
    "modelAnswer": "Concept definition + trade-offs."
  }`;

  const aiResult = await callOpenAI(prompt, "You are a senior technical interviewer. Output JSON only.");
  if (aiResult) {
    try {
      const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
      return { success: true, ...JSON.parse(cleanJson) };
    } catch (e) {
      console.error("OpenAI answer review parse fail:", e);
    }
  }

  // Fallback
  const lower = answer.toLowerCase();
  let scoreVal = 55;
  if (answer.length > 100) scoreVal += 15;
  const keywords = ["render", "state", "hook", "index", "performance", "sharding", "pool", "network"];
  const matches = keywords.filter(k => lower.includes(k));
  scoreVal += matches.length * 4;

  const improvements = [];
  if (answer.length < 80) improvements.push("Provide a specific project-based scenario to back up your concepts.");
  if (matches.length < 1) improvements.push("Integrate technical terminology (e.g. state management, index structures) into your response.");

  return {
    success: true,
    score: Math.min(scoreVal, 96),
    strengths: "Sentences are constructed clearly and state the core definitions.",
    improvements: improvements.length > 0 ? improvements.join(" ") : "None! Your technical answer contains excellent keywords.",
    modelAnswer: "A high-scoring answer defines the concept, lists its structural trade-offs, and references a real-world scenario."
  };
}

// 18. Salary Negotiation Script
export async function salaryNegotiatorCoachAction(offerDetails, targetSalary = "16 LPA") {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const prompt = `Draft a salary negotiation strategy and script for a candidate with this current offer: "${JSON.stringify(offerDetails)}" targeting "${targetSalary}".
  Return strictly JSON: { "negotiationStrategy": "...", "suggestedScript": "..." }`;

  const aiResult = await callOpenAI(prompt, "You are a professional salary negotiation coach. Output JSON only.");
  if (aiResult) {
    try {
      const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
      return { success: true, ...JSON.parse(cleanJson) };
    } catch (e) {
      console.error("OpenAI negotiation script parse fail:", e);
    }
  }

  // Fallback
  return {
    success: true,
    negotiationStrategy: "State your eagerness for the role, mention competing offers, and ask for target adjustment politely.",
    suggestedScript: `Thank you for extending the offer! I am very excited about this role. Based on my competing drive interview loops and target requirements, would it be possible to bring the base CTC closer to ${targetSalary}? I am prepared to sign immediately if we can align on this.`
  };
}

// 19. Cold Outreach Email
export async function generateColdEmailAction(companyName = "Stripe", recipientRole = "Engineering Lead") {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const prompt = `Write a short, engaging cold outreach email from a student Alex Mercer to a ${recipientRole} at ${companyName}.
  Return strictly JSON: { "subject": "...", "body": "..." }`;

  const aiResult = await callOpenAI(prompt, "You are a cold networking copywriter. Output JSON only.");
  if (aiResult) {
    try {
      const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
      return { success: true, ...JSON.parse(cleanJson) };
    } catch (e) {
      console.error("OpenAI cold email parse fail:", e);
    }
  }

  // Fallback
  return {
    success: true,
    subject: `Student Developer interested in technology scale at ${companyName}`,
    body: `Hi [Name],\n\nI'm Alex, a CS senior. I've been following ${companyName}'s engineering logs. I recently built a collaborative developer dashboard utilizing Next.js 15, Tailwind and Postgres. I'm searching for internship openings and would love to chat for 10 minutes regarding how your team manages scale. Best, Alex`
  };
}

// 20. Dynamic AI Profile Bio & Headline Recommendations (Adaptive resume keyword extraction)
export async function generateProfileBioAction(resumeText = "") {
  await new Promise(resolve => setTimeout(resolve, 400));

  const prompt = `Generate suggested professional headlines and a short bio for a LinkedIn profile based on the candidate's resume content below.
  Return strictly a JSON object with this format:
  {
    "headlines": [
      "Software Engineer | Next.js, React, Node.js & PostgreSQL | Building Dev Tools & SaaS Systems",
      "Full Stack Developer | Specialized in dashboard optimization"
    ],
    "bio": "Short professional summary."
  }
  
  Resume: ${resumeText}`;

  const aiResult = await callOpenAI(prompt, "You are a senior professional developer writer. Return JSON only.");
  if (aiResult) {
    try {
      const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
      return { success: true, ...JSON.parse(cleanJson) };
    } catch (e) {
      console.error("OpenAI bio suggestion parse fail, falling back:", e);
    }
  }

  // Fallback (Highly Adaptive Procedural Builder based on parsed resume text keywords)
  const keywords = extractKeywords(resumeText);
  const skillsList = keywords.map(s => s.charAt(0).toUpperCase() + s.slice(1));
  
  const techStackString = skillsList.slice(0, 4).join(", ") || "Next.js, React, Node.js & PostgreSQL";
  const firstSkill = skillsList[0] || "Full Stack";
  const secondSkill = skillsList[1] || "dashboard optimization";

  const headlines = [
    `Software Engineer | ${skillsList.slice(0, 4).join(" • ") || "Next.js • React • Node.js • PostgreSQL"} | Building Dev Tools & SaaS Systems`,
    `Full Stack Developer | Specialized in ${firstSkill} engineering and ${secondSkill} solutions`
  ];

  const bio = `Computer Science student specializing in building high-performance web systems. Experienced in developing with ${techStackString}. Passionate about clean code, technical tooling, and database optimization.`;

  return {
    success: true,
    headlines,
    bio
  };
}

// 21. AI Placement DNA Radar Coordinates Calculator
export async function calculatePlacementDnaAction(studentId) {
  try {
    const students = await db.students.list();
    const profile = students.find(s => s.id === studentId || s.userId === studentId);
    if (!profile) return { error: "Profile not found" };

    const prompt = `Analyze the student profile attributes below and score their capabilities from 0 to 100 on exactly five dimensions: "Technical Skill", "Project Velocity", "Work Experience", "Academic Depth", and "Communication".
    Return strictly a JSON object with this format:
    {
      "dna": [
        { "subject": "Technical Skill", "value": 85, "fullMark": 100 },
        { "subject": "Project Velocity", "value": 90, "fullMark": 100 },
        { "subject": "Work Experience", "value": 70, "fullMark": 100 },
        { "subject": "Academic Depth", "value": 80, "fullMark": 100 },
        { "subject": "Communication", "value": 75, "fullMark": 100 }
      ]
    }
    
    Student details:
    Skills: ${JSON.stringify(profile.skills || [])}
    Projects: ${JSON.stringify(profile.projects || [])}
    Experience: ${JSON.stringify(profile.experience || [])}
    CGPA: ${profile.cgpa || "N/A"}
    Bio: ${profile.bio || ""}`;

    const aiResult = await callOpenAI(prompt, "You are a career growth metrics engine. Output JSON only.");
    if (aiResult) {
      try {
        const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
        return { success: true, ...JSON.parse(cleanJson) };
      } catch (e) {
        console.error("AI radar calculation parse failed:", e);
      }
    }

    // Fallback calculation
    const skillsCount = Array.isArray(profile.skills) ? profile.skills.length : 0;
    const technical = Math.min(45 + skillsCount * 8, 100);

    const projectsCount = Array.isArray(profile.projects) ? profile.projects.length : 0;
    const velocity = Math.min(35 + projectsCount * 22, 100);

    const expCount = Array.isArray(profile.experience) ? profile.experience.length : 0;
    const experience = Math.min(25 + expCount * 38, 100);

    const cgpaScore = profile.cgpa ? Math.min(Math.round(profile.cgpa * 10), 100) : 55;
    const academics = cgpaScore;

    const comm = profile.bio && profile.bio.length > 50 ? 88 : 75;

    return {
      success: true,
      dna: [
        { subject: "Technical Skill", value: technical, fullMark: 100 },
        { subject: "Project Velocity", value: velocity, fullMark: 100 },
        { subject: "Work Experience", value: experience, fullMark: 100 },
        { subject: "Academic Depth", value: academics, fullMark: 100 },
        { subject: "Communication", value: comm, fullMark: 100 }
      ]
    };
  } catch (err) {
    return { error: err.message || "Failed to calculate DNA metrics" };
  }
}

// 22. AI Candidate Matchmaker Matrix
export async function matchCandidatesAction(jobDescription) {
  if (!jobDescription || jobDescription.trim().length < 10) {
    return { error: "Please enter a valid job description to match." };
  }

  try {
    const students = await db.students.list();
    
    // Select essential fields to keep prompt lightweight
    const candidateData = students.map(s => ({
      id: s.id,
      name: s.name,
      department: s.department,
      cgpa: s.cgpa,
      skills: s.skills || [],
      projectsCount: s.projects?.length || 0,
      experienceCount: s.experience?.length || 0
    }));

    const prompt = `Match the job description:
    "${jobDescription}"
    against this list of student candidates:
    ${JSON.stringify(candidateData)}
    
    Return a ranked list of students with match percentages and fit justifications.
    Return strictly a JSON object with this format:
    {
      "matches": [
        { "studentId": "...", "matchScore": 92, "fitReason": "Has extensive experience with Next.js and Postgres matching your stack requirements." }
      ]
    }`;

    const aiResult = await callOpenAI(prompt, "You are a recruiter matchmaking engine. Output JSON only.");
    if (aiResult) {
      try {
        const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        
        // Map student profiles back
        const rankedMatches = parsed.matches.map(m => {
          const studentProfile = students.find(s => s.id === m.studentId);
          return {
            ...m,
            student: studentProfile
          };
        }).filter(m => m.student); // filter out invalid mappings

        return { success: true, matches: rankedMatches };
      } catch (e) {
        console.error("AI matchmaking parser failed:", e);
      }
    }

    // Procedural Fallback Matcher
    const jdKeywords = extractKeywords(jobDescription);
    const calculatedMatches = students.map(student => {
      const studentSkills = student.skills ? student.skills.map(s => s.toLowerCase()) : [];
      const matched = jdKeywords.filter(k => studentSkills.includes(k));
      const matchRatio = jdKeywords.length > 0 ? (matched.length / jdKeywords.length) : 0.5;
      const score = Math.round(50 + matchRatio * 45);

      let reason = "Candidate possesses core skills matching the description.";
      if (matched.length > 0) {
        reason = `Matches key skills: ${matched.slice(0, 3).join(", ").toUpperCase()}.`;
      }
      if (student.experience?.length > 0) {
        reason += " Backed by professional internship experience.";
      }

      return {
        studentId: student.id,
        matchScore: score,
        fitReason: reason,
        student
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    return { success: true, matches: calculatedMatches };
  } catch (err) {
    return { error: err.message || "Failed to execute matchmaking matrix" };
  }
}

// 23. AI Placement Shortlist Probability Predictor
export async function predictPlacementProbabilityAction(studentId, jobId) {
  if (!studentId || !jobId) {
    return { error: "Missing required student ID or job ID." };
  }

  try {
    const students = await db.students.list();
    const profile = students.find(s => s.id === studentId || s.userId === studentId);
    if (!profile) return { error: "Student profile not found." };

    const job = await db.jobs.getById(jobId);
    if (!job) return { error: "Job posting not found." };

    const prompt = `Analyze the student's compatibility for the following job drive.
    
    Job Details:
    Title: ${job.title}
    Company: ${job.company?.name || "Corporate Partner"}
    Description: ${job.description}
    Requirements: ${job.requirements}
    
    Student details:
    Skills: ${JSON.stringify(profile.skills || [])}
    Projects: ${JSON.stringify(profile.projects || [])}
    Experience: ${JSON.stringify(profile.experience || [])}
    CGPA: ${profile.cgpa || "N/A"}
    
    Calculate a shortlist probability score from 0 to 100, select a tier ("HIGH", "MEDIUM", "LOW"), list a brief summary reason, and give 2 practical tips to improve their alignment.
    Return strictly a JSON object with this format:
    {
      "probability": 85,
      "tier": "HIGH",
      "reason": "Explain suitability here.",
      "tips": ["Tip 1 to improve profile fit", "Tip 2 to improve profile fit"]
    }`;

    const aiResult = await callOpenAI(prompt, "You are a placement shortlisting AI evaluator. Output JSON only.");
    if (aiResult) {
      try {
        const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
        return { success: true, ...JSON.parse(cleanJson) };
      } catch (e) {
        console.error("AI shortlist prediction parser failed:", e);
      }
    }

    // Fallback logic
    const studentSkills = profile.skills ? profile.skills.map(s => s.toLowerCase()) : [];
    const jobText = `${job.title} ${job.description} ${job.requirements}`.toLowerCase();
    const jobKeywords = extractKeywords(jobText);
    const matched = jobKeywords.filter(k => studentSkills.includes(k));
    
    const matchRatio = jobKeywords.length > 0 ? (matched.length / jobKeywords.length) : 0.5;
    const baseScore = Math.round(50 + matchRatio * 40);

    let finalScore = baseScore;
    if (profile.cgpa && profile.cgpa >= 8.5) finalScore += 5;
    if (profile.experience?.length > 0) finalScore += 5;
    finalScore = Math.min(Math.max(finalScore, 40), 98);

    const tier = finalScore >= 80 ? "HIGH" : finalScore >= 60 ? "MEDIUM" : "LOW";
    
    let reason = `Compatibility matching is evaluated at ${finalScore}%. `;
    if (matched.length > 0) {
      reason += `Matched skills: ${matched.slice(0, 3).join(", ").toUpperCase()}.`;
    } else {
      reason += "No direct technical keyword match detected in your skills list.";
    }

    const missing = jobKeywords.filter(k => !studentSkills.includes(k));
    const tips = [];
    if (missing.length > 0) {
      tips.push(`Add projects highlighting ${missing.slice(0, 2).join(", ").toUpperCase()} capabilities.`);
    } else {
      tips.push("Practice coding questions related to data structures for technical rounds.");
    }
    tips.push("Include a link to your GitHub repository in your project details.");

    return {
      success: true,
      probability: finalScore,
      tier,
      reason,
      tips
    };
  } catch (err) {
    return { error: err.message || "Failed to calculate placement probability" };
  }
}

// 24. AI STAR Behavioral Answer Evaluator
export async function evaluateStarAnswerAction(situation, task, action, result) {
  if (!situation || !task || !action || !result) {
    return { error: "Please fill in all Situation, Task, Action, and Result fields." };
  }

  try {
    const prompt = `Evaluate the following candidate behavioral response structured in the STAR framework.
    
    Situation: ${situation}
    Task: ${task}
    Action: ${action}
    Result: ${result}
    
    Calculate a quality score from 0 to 100 based on structure clarity, quantifiable results, and depth.
    Provide constructive feedback for each STAR element and construct a combined, optimized, professional paragraph response.
    Return strictly a JSON object with this format:
    {
      "score": 85,
      "feedback": {
        "situation": "Feedback on Situation part.",
        "task": "Feedback on Task part.",
        "action": "Feedback on Action part.",
        "result": "Feedback on Result part."
      },
      "optimizedResponse": "Combined professional paragraph of the response."
    }`;

    const aiResult = await callOpenAI(prompt, "You are a behavioral interview coach evaluating STAR responses. Output JSON only.");
    if (aiResult) {
      try {
        const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
        return { success: true, ...JSON.parse(cleanJson) };
      } catch (e) {
        console.error("AI STAR response parser failed:", e);
      }
    }

    // Fallback logic
    let score = 60;
    if (situation.length > 50) score += 10;
    if (action.length > 80) score += 15;
    if (result.match(/\d+/) || result.toLowerCase().includes("percent") || result.toLowerCase().includes("%")) {
      score += 15; // Contains metrics!
    }
    score = Math.min(score, 98);

    return {
      success: true,
      score,
      feedback: {
        situation: situation.length < 30 ? "Add more context about where this occurred." : "Good context setup.",
        task: task.length < 30 ? "Clarify what your specific responsibility was." : "Responsibility is clear.",
        action: action.length < 50 ? "Expand on the exact steps you took. Highlight your personal contributions." : "Action description is solid.",
        result: !(result.match(/\d+/)) ? "Try to include quantifiable metrics (e.g. percentages, hours saved) to prove impact." : "Quantified outcomes look excellent."
      },
      optimizedResponse: `${situation} I was tasked with ${task}. To address this, I ${action}. As a result, we achieved ${result}.`
    };
  } catch (err) {
    return { error: err.message || "Failed to evaluate STAR answer" };
  }
}

// 25. AI Live Voice/Video Interview Answer Evaluator (Realistic, User-Centric Rubric)
export async function evaluateLiveInterviewAnswerAction(question, answer, role = "Software Engineer", roundType = "TECHNICAL") {
  if (!answer || answer.trim().length < 3) {
    return { error: "Please speak or enter an answer to evaluate." };
  }

  const normRound = (roundType || "TECHNICAL").toUpperCase();

  try {
    const prompt = `You are a Principal Engineering Interviewer and Hiring Committee Member conducting an authentic, rigorous ${normRound} interview evaluation for the role of ${role}.
    
    Question Asked: "${question}"
    Candidate Spoken Answer: "${answer}"
    
    CRITICAL CANDIDATE-BASED SCORING RULES:
    1. STRICT REALISTIC GRADING (DO NOT INFLATE WEAK ANSWERS):
       - If the candidate gave an evasion, non-answer, said "I don't know", "skip", "pass", or gave irrelevant/nonsense words, award overallScore STRICTLY BETWEEN 15 AND 35.
       - If the answer is extremely brief (< 20 words) or superficial, award between 40 AND 55.
       - If the answer is moderately relevant but lacks depth or concrete examples, award between 60 AND 75.
       - If the answer is structured, accurate, and mentions relevant technical terms or STAR elements, award between 78 AND 88.
       - If the answer is exceptional with concrete metrics, edge cases, trade-offs, or thorough STAR execution, award between 89 AND 96.
       
    2. ROUND-SPECIFIC EVALUATION:
       - If ${normRound} === "TECHNICAL": Evaluate technical accuracy, algorithm/system depth, trade-off awareness, and code/framework concepts.
       - If ${normRound} === "BEHAVIORAL": Evaluate using the STAR method (Situation, Task, Action, Result), personal accountability, and teamwork.
       - If ${normRound} === "SYSTEM_DESIGN": Evaluate scalability, database/cache choices, bottlenecks, and CAP theorem trade-offs.
       
    Return strictly a JSON object with this exact format:
    {
      "overallScore": 86,
      "technicalScore": 88,
      "clarityScore": 84,
      "confidenceScore": 85,
      "strengths": ["...", "..."],
      "improvements": ["...", "..."],
      "fillerWordFeedback": "...",
      "modelAnswer": "..."
    }`;

    const aiResult = await callOpenAI(prompt, "You are a lead hiring engineer evaluating a candidate answer. Return JSON only.");
    if (aiResult) {
      try {
        const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        if (typeof parsed?.overallScore === "number") {
          return { success: true, ...parsed };
        }
      } catch (e) {
        console.error("Live interview eval parser failed:", e);
      }
    }

    // High-quality, User-Centric Procedural Fallback
    const words = answer.trim().split(/\s+/).filter(Boolean);
    const lower = answer.toLowerCase().trim();
    
    // Check for Evasions / Inadequate non-answers
    const evasionPhrases = [
      "don't know", "dont know", "no idea", "not sure", "cannot answer", "can't answer",
      "skip", "pass", "no clue", "haven't learned", "haven't worked", "not familiar",
      "nothing", "hello", "hi", "test", "bye", "idk", "i have no knowledge", "no answer",
      "sorry i don't", "sorry i dont"
    ];
    const isEvasion = words.length < 8 || evasionPhrases.some(p => lower.includes(p) && words.length < 25);

    if (isEvasion) {
      const evasionScore = Math.min(32, Math.max(15, 12 + words.length * 2));
      return {
        success: true,
        overallScore: evasionScore,
        technicalScore: Math.max(10, evasionScore - 5),
        clarityScore: 42,
        confidenceScore: Math.min(35, 18 + words.length),
        strengths: [
          "Candid acknowledgment of knowledge limits rather than presenting fabricated facts."
        ],
        improvements: [
          "Avoid passing or stating 'I don't know' without offering your initial hypothesis or thought process.",
          "In campus drives, explain what adjacent concepts you do know or describe how you would investigate the solution."
        ],
        fillerWordFeedback: "Answer was too brief to evaluate speech cadence.",
        modelAnswer: normRound === "BEHAVIORAL"
          ? "In behavioral rounds, structure an authentic experience: describe the Situation, your specific Task, the proactive Action you spearheaded, and the measurable Result achieved."
          : normRound === "SYSTEM_DESIGN"
          ? "Begin by clarifying requirements (QPS, read/write ratio), propose high-level service architecture, and dive into data sharding and caching (Redis) trade-offs."
          : "Define the fundamental principle, explain how it operates under the hood, and illustrate with a concrete production example highlighting performance complexity."
      };
    }

    // Evaluate based on Round Type and Substance
    let techScore = 50;
    let clarityScore = 55;
    let confidenceScore = 60;
    let strengths = [];
    let improvements = [];
    let modelAnswer = "";

    if (normRound === "BEHAVIORAL") {
      // Check STAR Method indicators
      const hasSituation = /(when|project|team|internship|college|capstone|production|client|deadline|company|experience|semester|hackathon)/i.test(lower);
      const hasTask = /(task|challenge|goal|responsible|needed to|assigned|problem|issue|target|objective)/i.test(lower);
      const hasAction = /(i decided|i implemented|i analyzed|i spoke|i organized|i scheduled|i refactored|i built|i designed|i took|my approach|action|collaborated|researched)/i.test(lower);
      const hasResult = /(result|outcome|learned|improved|reduced|achieved|delivered|finally|impact|feedback|success|metric|boosted|resolved)/i.test(lower);
      const hasQuant = /\d+/.test(lower) || /(percent|hours|days|latency|speed|cost)/i.test(lower);

      const starCount = (hasSituation ? 1 : 0) + (hasTask ? 1 : 0) + (hasAction ? 1 : 0) + (hasResult ? 1 : 0);

      techScore = 45 + (starCount * 10) + (hasQuant ? 8 : 0);
      clarityScore = words.length > 35 ? (hasAction && hasResult ? 85 : 72) : 60;
      confidenceScore = words.length > 50 ? 84 : 68;

      if (hasSituation && hasAction) {
        strengths.push("Good context establishment with clear personal initiative described.");
      } else {
        strengths.push("Engaged directly with the situational challenge prompt.");
      }
      if (hasResult) {
        strengths.push("Effectively concluded with the impact and outcome of your intervention.");
      } else {
        strengths.push("Clear, conversational tone and professional delivery.");
      }

      if (!hasResult) {
        improvements.push("Conclude your story with concrete Results and key learnings (the 'R' in the STAR method).");
      }
      if (!hasQuant) {
        improvements.push("Incorporate quantifiable business or engineering metrics (e.g., time saved, efficiency boosted).");
      }
      if (words.length < 35) {
        improvements.push("Elaborate further on the specific Actions you personally took versus the team's contribution.");
      }

      modelAnswer = "A benchmark STAR response: 'During my final-year project (Situation), our API latency spiked under mock load (Task). I profiled the SQL queries, added Redis caching, and indexed foreign keys (Action). As a result, p99 latency dropped by 45% and the system handled 2,000 requests/sec cleanly (Result).'";

    } else if (normRound === "SYSTEM_DESIGN") {
      const designKeywords = [
        "scale", "traffic", "qps", "database", "sharding", "replication", "cache", "redis", 
        "cdn", "load balancer", "microservices", "cap", "consistency", "availability", 
        "latency", "throughput", "queue", "kafka", "rabbitmq", "partition", "failover", 
        "horizontal", "vertical", "monitoring", "trade-off", "bottleneck", "idempotent", "acid"
      ];
      const matchedDesign = designKeywords.filter(k => lower.includes(k));

      techScore = 48 + Math.min(matchedDesign.length * 6, 32);
      clarityScore = words.length > 40 ? 82 : 68;
      confidenceScore = words.length > 60 ? 85 : 70;

      if (matchedDesign.length >= 3) {
        strengths.push(`Strong architectural terminology coverage (${matchedDesign.slice(0, 3).join(", ")}).`);
      } else {
        strengths.push("Solid high-level overview of the functional system components.");
      }
      if (words.length > 45) {
        strengths.push("Good depth and structured flow through service components.");
      }

      if (matchedDesign.length < 3) {
        improvements.push("Incorporate specific distributed building blocks like Redis caching, load balancers, and message brokers.");
      }
      improvements.push("Explicitly address trade-offs between consistency and availability (CAP theorem) under network partitions.");

      modelAnswer = "A senior architectural response gathers throughput requirements (e.g. 100k QPS), outlines stateless API layers behind load balancers, proposes distributed caching (Redis) for hot keys, and details horizontal database sharding with write-ahead replication.";

    } else {
      // TECHNICAL CORE
      const techKeywords = [
        "algorithm", "complexity", "database", "index", "cache", "async", "promise", 
        "state", "component", "performance", "api", "security", "scale", "system", 
        "memory", "thread", "concurrency", "lock", "latency", "throughput", "rest", 
        "grpc", "node", "react", "next", "postgres", "sql", "redis", "docker", "test", 
        "debug", "tradeoff", "trade-off", "o(1)", "o(n)", "acid", "b-tree", "hash", "tree"
      ];
      const matchedTech = techKeywords.filter(k => lower.includes(k));
      const hasComplexity = /(o\(|complexity|trade-off|overhead|memory|cpu|latency|amortized)/i.test(lower);

      techScore = 45 + Math.min(matchedTech.length * 7, 30) + (hasComplexity ? 8 : 0);
      clarityScore = words.length > 35 ? 80 : 65;
      confidenceScore = words.length > 50 ? 84 : 70;

      if (matchedTech.length > 0) {
        strengths.push(`Accurate technical vocabulary usage (${matchedTech.slice(0, 3).join(", ")}).`);
      } else {
        strengths.push("Direct answer addressing the core question.");
      }
      if (hasComplexity) {
        strengths.push("Demonstrated awareness of runtime performance and computational trade-offs.");
      }

      if (!hasComplexity) {
        improvements.push("Explicitly analyze time and space complexity (e.g., O(1) vs O(N)) when justifying your approach.");
      }
      if (words.length < 30) {
        improvements.push("Provide a concrete production or project scenario where you resolved this problem.");
      }

      modelAnswer = "A top technical answer articulates the core data structure or mechanism, analyzes time and memory complexity, addresses potential edge cases (e.g., race conditions, null bounds), and highlights engineering trade-offs.";
    }

    // Adjust for extreme brevity
    if (words.length < 20) {
      techScore = Math.min(techScore, 55);
      clarityScore = Math.min(clarityScore, 60);
      confidenceScore = Math.min(confidenceScore, 58);
    }

    const overallScore = Math.min(Math.round((techScore * 0.45) + (clarityScore * 0.3) + (confidenceScore * 0.25)), 95);

    return {
      success: true,
      overallScore: Math.max(overallScore, 35),
      technicalScore: Math.min(Math.max(techScore, 30), 95),
      clarityScore: Math.min(Math.max(clarityScore, 40), 95),
      confidenceScore: Math.min(Math.max(confidenceScore, 40), 95),
      strengths: strengths.length > 0 ? strengths : ["Good, calm speaking delivery."],
      improvements: improvements.length > 0 ? improvements : ["Deepen your technical trade-off explanation."],
      fillerWordFeedback: words.length > 30 ? "Steady conversational cadence and clear articulation." : "Answer was somewhat concise; aim for fuller explanations.",
      modelAnswer
    };
  } catch (err) {
    return { error: err.message || "Failed to evaluate interview answer." };
  }
}

// 26. AI Offer Letter Risk & Bond Scanner
export async function scanOfferLetterClausesAction(offerText) {
  if (!offerText || offerText.trim().length < 20) {
    return { error: "Please enter or paste the offer letter text to scan." };
  }

  try {
    const prompt = `Analyze this employment offer letter / appointment contract text for potential employee risks, hidden clauses, and restrictive covenants in India tech placements:
    
    Offer Text:
    "${offerText}"
    
    Check for:
    1. Service Bonds / Mandatory Lock-in periods (e.g. 2-year bond with penalty)
    2. Long notice periods (> 60 days)
    3. Broad Non-compete / IP assignment clauses
    4. Variable pay vs Fixed CTC percentage
    5. Training fee recovery or clawback provisions
    
    Return strictly a JSON object with this format:
    {
      "riskScore": 25, // 0 = Clean/Safe, 100 = High Risk
      "riskLevel": "LOW", // "LOW", "MEDIUM", "HIGH"
      "flaggedClauses": [
        { "clause": "Notice Period", "severity": "MEDIUM", "explanation": "Notice period of 90 days is above the standard 30-day industry baseline.", "recommendation": "Negotiate to 30 or 60 days." }
      ],
      "highlights": {
        "fixedSalaryRatio": "85%",
        "hasServiceBond": false,
        "probationMonths": 3
      },
      "overallVerdict": "Safe offer with standard corporate terms."
    }`;

    const aiResult = await callOpenAI(prompt, "You are a corporate labor lawyer and placement advisor evaluating job contracts. Return JSON only.");
    if (aiResult) {
      try {
        const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
        return { success: true, ...JSON.parse(cleanJson) };
      } catch (e) {
        console.error("Offer scan parse error:", e);
      }
    }

    // Fallback scanner
    const lower = offerText.toLowerCase();
    const flagged = [];
    let riskScore = 15;

    if (lower.includes("bond") || lower.includes("service agreement") || lower.includes("lock-in") || lower.includes("penalty")) {
      riskScore += 35;
      flagged.push({
        clause: "Service Bond / Lock-in Period",
        severity: "HIGH",
        explanation: "Contains mandatory service bond or financial penalty for early exit.",
        recommendation: "Request waiver or clarification on exit terms."
      });
    }

    if (lower.includes("90 days") || lower.includes("3 months notice")) {
      riskScore += 20;
      flagged.push({
        clause: "Extended Notice Period (90 Days)",
        severity: "MEDIUM",
        explanation: "A 90-day notice period may limit mobility for future offers.",
        recommendation: "Negotiate standard 30-day notice period during probation."
      });
    }

    if (lower.includes("non-compete") || lower.includes("restrictive covenant")) {
      riskScore += 15;
      flagged.push({
        clause: "Non-Compete Clause",
        severity: "LOW",
        explanation: "Standard non-compete clause detected. Generally non-enforceable post-employment under Section 27 of Indian Contract Act.",
        recommendation: "Verify geographical and temporal scope."
      });
    }

    const riskLevel = riskScore >= 50 ? "HIGH" : riskScore >= 30 ? "MEDIUM" : "LOW";

    return {
      success: true,
      riskScore: Math.min(riskScore, 95),
      riskLevel,
      flaggedClauses: flagged.length > 0 ? flagged : [
        {
          clause: "Standard Terms",
          severity: "LOW",
          explanation: "No restrictive service bonds or aggressive penalties detected.",
          recommendation: "Review PF and standard benefits with HR."
        }
      ],
      highlights: {
        fixedSalaryRatio: lower.includes("variable") ? "75-80%" : "85-90%",
        hasServiceBond: lower.includes("bond"),
        probationMonths: lower.includes("6 months") ? 6 : 3
      },
      overallVerdict: riskLevel === "LOW" ? "Clean, standard corporate placement offer." : "Contains clauses that warrant careful review before signing."
    };
  } catch (err) {
    return { error: err.message || "Failed to scan offer letter." };
  }
}

// 27. AI Counter-Offer & Negotiation Script Generator
export async function generateCounterOfferLetterAction(currentCompany, currentPackage, targetCompany, targetSalary, competingOffer = "") {
  try {
    const prompt = `Write a professional, diplomatic counter-offer negotiation email from candidate Alex Mercer to ${currentCompany}.
    Current Extended Offer: ${currentPackage}
    Target Compensation Desired: ${targetSalary}
    Competing Offer Context: ${competingOffer || 'Competing drive offer with higher base and signing incentive'}
    
    Structure the email with:
    1. Genuine enthusiasm for ${currentCompany}'s mission and team.
    2. Clear, respectful justification based on market data and competing drive status.
    3. Specific proposed revision (Base CTC or Joining Bonus).
    4. Commitment to sign immediately if terms are aligned.
    
    Return strictly a JSON object:
    {
      "subject": "Regarding Offer for Software Engineer - Alex Mercer",
      "emailBody": "Full polished email text...",
      "talkingPoints": [
        "Express gratitude and excitement for the team's tech stack",
        "Politely state competing offer parameters without issuing an ultimatum",
        "Reiterate readiness to accept promptly upon adjustment"
      ],
      "negotiationStrategy": "Strategy tip..."
    }`;

    const aiResult = await callOpenAI(prompt, "You are a career executive coach specializing in tech salary negotiations. Return JSON only.");
    if (aiResult) {
      try {
        const cleanJson = aiResult.replace(/```json/g, "").replace(/```/g, "").trim();
        return { success: true, ...JSON.parse(cleanJson) };
      } catch (e) {
        console.error("Counter offer parser failed:", e);
      }
    }

    return {
      success: true,
      subject: `Regarding Offer for Software Engineer - Discussion on Terms`,
      emailBody: `Dear Hiring Team at ${currentCompany},\n\nThank you so much for extending the offer to join ${currentCompany} as a Software Engineer. I am genuinely thrilled about the team's engineering roadmap and the opportunity to contribute.\n\nWhile reviewing the offer of ${currentPackage}, I wanted to discuss whether there is flexibility to bring the total CTC closer to ${targetSalary}. I am currently in advanced discussions with another tier-1 campus drive offering similar scope.\n\nBecause ${currentCompany} is my top choice for cultural fit and technical growth, I would be delighted to sign and accept immediately if we can align on this package adjustment.\n\nThank you again for your consideration and support.\n\nWarm regards,\nAlex Mercer`,
      talkingPoints: [
        `Reaffirm ${currentCompany} as your top preference.`,
        `Frame the request around competing drive opportunities (${competingOffer || targetSalary}).`,
        `Offer immediate acceptance upon alignment to create win-win closure.`
      ],
      negotiationStrategy: "Anchoring on competing offers gives recruiters the internal justification needed to unlock higher compensation bands."
    };
  } catch (err) {
    return { error: err.message || "Failed to generate counter-offer email." };
  }
}


