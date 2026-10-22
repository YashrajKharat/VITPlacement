"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getStudentProfileAction, updateStudentProfileAction } from "@/actions/dashboard";
import { 
  FileText, Printer, Sparkles, CheckCircle2, 
  ArrowLeft, Plus, Trash2, Eye, RefreshCw, Check, 
  GraduationCap, Briefcase, FolderGit2, Award, 
  Globe, User, Phone, Mail, ExternalLink, Save,
  BookOpen, Terminal, Layers, ShieldCheck, ChevronRight
} from "lucide-react";

export default function ResumeBuilderPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [template, setTemplate] = useState("harvard"); // harvard | tech_modern | executive_pro
  const [activeSection, setActiveSection] = useState("contact"); // contact | education | experience | projects | skills | achievements | certifications | leadership

  // Comprehensive Resume Data Structure
  const [resumeData, setResumeData] = useState({
    name: "Yashraj Nana Kharat",
    headline: "Computer Engineering Undergraduate • Full Stack & Cloud Developer",
    email: "yashraj.kharat@vit.edu.in",
    phone: "+91 98207 91961",
    location: "Mumbai, Maharashtra, India",
    linkedin: "https://linkedin.com/in/yashraj-kharat",
    github: "https://github.com/yashrajkharat",
    portfolio: "https://yashraj.dev",
    summary: "Computer Engineering undergraduate at Vidyalankar Institute of Technology with proven hands-on experience in building high-concurrency web platforms, microservices, and distributed database systems using Next.js, Node.js, and PostgreSQL. Passionate about solving complex algorithmic problems and scalable system architecture.",
    education: [
      {
        institution: "Vidyalankar Institute of Technology (VIT Wadala)",
        degree: "B.Tech in Computer Engineering",
        duration: "2022 – 2026",
        score: "CGPA: 9.20 / 10.0"
      },
      {
        institution: "Pace Junior Science College",
        degree: "Higher Secondary Certificate (HSC) — Science",
        duration: "2020 – 2022",
        score: "Percentage: 94.5%"
      }
    ],
    experience: [
      {
        role: "Full Stack Engineering Intern",
        company: "Stripe Partner Lab",
        location: "Mumbai / Remote",
        duration: "June 2025 – Dec 2025",
        bullets: [
          "Developed automated webhook ingestion pipeline handling 15,000+ daily events with 99.98% delivery rate.",
          "Optimized Postgres index structures and connection pooling via PgBouncer, reducing p95 query latency by 38%.",
          "Implemented automated Jest unit test suites achieving 92% code coverage across core billing modules."
        ]
      },
      {
        role: "Backend & Cloud Developer Intern",
        company: "Tech Mahindra Innovation Hub",
        location: "Mumbai, India",
        duration: "Jan 2025 – May 2025",
        bullets: [
          "Architected RESTful microservices in Node.js and Express handling authentication and rate-limiting for 5,000+ active users.",
          "Dockerized application services and established automated GitHub Actions CI/CD pipelines deploying to AWS EC2."
        ]
      }
    ],
    projects: [
      {
        title: "Distributed Campus Placement & OA Portal",
        tech: "Next.js 16, PostgreSQL, Prisma, Web Speech API, TailwindCSS",
        link: "https://github.com/yashrajkharat/placement-portal",
        bullets: [
          "Architected real-time mock interview simulator with speech recognition, sentiment scoring, and automated feedback.",
          "Designed multi-role access control for 2,000+ candidates and 50+ corporate recruiters with instant candidate search.",
          "Integrated real-time analytics dashboard with dynamic export of student hiring funnel statistics."
        ]
      },
      {
        title: "High-Performance In-Memory Cache Engine",
        tech: "Go (Golang), Redis Protocol, TCP Sockets, Concurrency",
        link: "https://github.com/yashrajkharat/go-cache",
        bullets: [
          "Engineered concurrent key-value storage engine supporting LRU eviction and atomic TTL expirations.",
          "Benchmarked throughput exceeding 85,000 requests/sec with sub-millisecond execution times under heavy load."
        ]
      },
      {
        title: "Smart ATS Resume Auditor & Skill Matcher",
        tech: "Python, FastAPI, SpaCy NLP, React, Scikit-Learn",
        link: "https://github.com/yashrajkharat/ats-auditor",
        bullets: [
          "Trained natural language parser to extract competencies and calculate semantic job match cosine scores."
        ]
      }
    ],
    skills: {
      languages: "C++, Java, Python, JavaScript (ES6+), TypeScript, Go, SQL",
      frameworks: "React.js, Next.js 16, Node.js, Express.js, TailwindCSS, Spring Boot",
      databases: "PostgreSQL, MongoDB, Redis, MySQL, Prisma ORM",
      tools: "Docker, Git, GitHub Actions, AWS (S3, EC2), Postman, Linux, Vercel",
      fundamentals: "Data Structures & Algorithms, Object-Oriented Programming (OOP), OS, DBMS, Computer Networks, System Design"
    },
    achievements: [
      "Winner (1st Place) – Smart India Hackathon College Level among 350+ participating teams",
      "Ranked Top 2% Globally on LeetCode Weekly Contests (Knight Badge • Rating 1940+)",
      "5-Star C++ & Problem Solving Gold Badge on HackerRank (Solvers Top 1%)",
      "National Hackathon Finalist — FinTech Innovation Challenge 2025"
    ],
    certifications: [
      {
        title: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services (AWS)",
        year: "2025",
        credentialId: "AWS-CCP-982071"
      },
      {
        title: "Meta Certified Front-End Developer Specialization",
        issuer: "Meta / Coursera",
        year: "2024",
        credentialId: "META-FED-88412"
      }
    ],
    leadership: [
      {
        role: "Technical Lead",
        organization: "Google Developer Student Clubs (GDSC) — VIT Wadala",
        duration: "2024 – 2025",
        details: "Conducted 6 hands-on workshops on Web3 & Full Stack Development for 400+ undergraduate engineering students."
      },
      {
        role: "Student Placement Coordinator",
        organization: "Training & Placement Cell, VIT Mumbai",
        duration: "2024 – Present",
        details: "Assisted TPO in coordinating on-campus hiring drives for 30+ Tier-1 tech recruiters."
      }
    ]
  });

  // Load verified student profile details
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getStudentProfileAction();
        if (res?.success && res.student) {
          const st = res.student;
          setResumeData(prev => ({
            ...prev,
            name: st.name || prev.name,
            email: st.email || prev.email,
            phone: st.phone || prev.phone,
            linkedin: st.linkedin || prev.linkedin,
            github: st.github || prev.github,
            portfolio: st.portfolio || prev.portfolio,
            summary: st.bio || prev.summary,
            education: Array.isArray(st.education) && st.education.length > 0 ? st.education : prev.education,
            experience: Array.isArray(st.experience) && st.experience.length > 0 ? st.experience : prev.experience,
            projects: Array.isArray(st.projects) && st.projects.length > 0 ? st.projects : prev.projects,
            achievements: Array.isArray(st.achievements) && st.achievements.length > 0 ? st.achievements : prev.achievements,
            certifications: Array.isArray(st.certificates) && st.certificates.length > 0 
              ? st.certificates.map(c => typeof c === "string" ? { title: c, issuer: "Certified", year: "2025" } : c)
              : prev.certifications,
            skills: {
              ...prev.skills,
              languages: Array.isArray(st.skills) && st.skills.length > 0 ? st.skills.join(", ") : prev.skills.languages
            }
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Save changes directly to student DB profile
  const handleSaveToProfile = async () => {
    setSaving(true);
    try {
      const skillsArray = resumeData.skills.languages
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      await updateStudentProfileAction({
        name: resumeData.name,
        phone: resumeData.phone,
        bio: resumeData.summary,
        github: resumeData.github,
        linkedin: resumeData.linkedin,
        portfolio: resumeData.portfolio,
        skills: skillsArray,
        education: resumeData.education,
        experience: resumeData.experience,
        projects: resumeData.projects,
        achievements: resumeData.achievements,
        certificates: resumeData.certifications
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Calculate live ATS Score
  const calculateAtsScore = () => {
    let score = 35;
    if (resumeData.name && resumeData.email && resumeData.phone) score += 15;
    if (resumeData.summary?.length > 80) score += 10;
    if (resumeData.education?.length > 0) score += 10;
    if (resumeData.projects?.length >= 2) score += 10;
    if (resumeData.experience?.length >= 1) score += 10;
    if (resumeData.skills?.languages && resumeData.skills?.frameworks) score += 5;
    if (resumeData.achievements?.length > 0) score += 5;
    return Math.min(score, 98);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper functions for dynamic lists
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: "Vidyalankar Institute of Technology", degree: "B.Tech in Computer Engineering", duration: "2022 – 2026", score: "CGPA: 9.0 / 10.0" }
      ]
    }));
  };

  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index, field, value) => {
    setResumeData(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          role: "Software Engineering Intern",
          company: "Tech Company",
          location: "Mumbai, India",
          duration: "May 2025 – July 2025",
          bullets: ["Engineered scalable REST APIs and improved response times by 25%."]
        }
      ]
    }));
  };

  const removeExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index, field, value) => {
    setResumeData(prev => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const addExpBullet = (expIndex) => {
    setResumeData(prev => {
      const updated = [...prev.experience];
      const currentBullets = Array.isArray(updated[expIndex].bullets) ? updated[expIndex].bullets : [];
      updated[expIndex].bullets = [...currentBullets, "Collaborated with agile engineering team to deliver customer-facing features."];
      return { ...prev, experience: updated };
    });
  };

  const updateExpBullet = (expIndex, bulletIndex, value) => {
    setResumeData(prev => {
      const updated = [...prev.experience];
      const currentBullets = [...(updated[expIndex].bullets || [])];
      currentBullets[bulletIndex] = value;
      updated[expIndex].bullets = currentBullets;
      return { ...prev, experience: updated };
    });
  };

  const removeExpBullet = (expIndex, bulletIndex) => {
    setResumeData(prev => {
      const updated = [...prev.experience];
      const currentBullets = (updated[expIndex].bullets || []).filter((_, i) => i !== bulletIndex);
      updated[expIndex].bullets = currentBullets;
      return { ...prev, experience: updated };
    });
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: "Full-Stack Web Application",
          tech: "React, Node.js, MongoDB, TailwindCSS",
          link: "https://github.com/username/project",
          bullets: ["Developed responsive web application with JWT authentication and real-time state management."]
        }
      ]
    }));
  };

  const removeProject = (index) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const updateProject = (index, field, value) => {
    setResumeData(prev => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const addProjBullet = (projIndex) => {
    setResumeData(prev => {
      const updated = [...prev.projects];
      const currentBullets = Array.isArray(updated[projIndex].bullets) ? updated[projIndex].bullets : [];
      updated[projIndex].bullets = [...currentBullets, "Integrated third-party APIs and optimized data queries for low-latency retrieval."];
      return { ...prev, projects: updated };
    });
  };

  const updateProjBullet = (projIndex, bulletIndex, value) => {
    setResumeData(prev => {
      const updated = [...prev.projects];
      const currentBullets = [...(updated[projIndex].bullets || [])];
      currentBullets[bulletIndex] = value;
      updated[projIndex].bullets = currentBullets;
      return { ...prev, projects: updated };
    });
  };

  const removeProjBullet = (projIndex, bulletIndex) => {
    setResumeData(prev => {
      const updated = [...prev.projects];
      const currentBullets = (updated[projIndex].bullets || []).filter((_, i) => i !== bulletIndex);
      updated[projIndex].bullets = currentBullets;
      return { ...prev, projects: updated };
    });
  };

  const addAchievement = () => {
    setResumeData(prev => ({
      ...prev,
      achievements: [...prev.achievements, "Finalist – National Level Coding Competition 2025"]
    }));
  };

  const updateAchievement = (index, value) => {
    setResumeData(prev => {
      const updated = [...prev.achievements];
      updated[index] = value;
      return { ...prev, achievements: updated };
    });
  };

  const removeAchievement = (index) => {
    setResumeData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        { title: "Google Cloud Digital Leader", issuer: "Google Cloud", year: "2025", credentialId: "GCP-102938" }
      ]
    }));
  };

  const updateCertification = (index, field, value) => {
    setResumeData(prev => {
      const updated = [...(prev.certifications || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, certifications: updated };
    });
  };

  const removeCertification = (index) => {
    setResumeData(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== index)
    }));
  };

  const addLeadership = () => {
    setResumeData(prev => ({
      ...prev,
      leadership: [
        ...(prev.leadership || []),
        { role: "Event Lead", organization: "ACM Student Chapter VIT", duration: "2024 – 2025", details: "Organized annual 24-hour hackathon with 500+ participants." }
      ]
    }));
  };

  const updateLeadership = (index, field, value) => {
    setResumeData(prev => {
      const updated = [...(prev.leadership || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, leadership: updated };
    });
  };

  const removeLeadership = (index) => {
    setResumeData(prev => ({
      ...prev,
      leadership: (prev.leadership || []).filter((_, i) => i !== index)
    }));
  };

  const navSections = [
    { id: "contact", label: "Contact & Bio", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "skills", label: "Skills & Stack", icon: Terminal },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "certifications", label: "Certifications", icon: ShieldCheck },
    { id: "leadership", label: "Leadership & POR", icon: BookOpen },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-left pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1C4980] mb-1">
            <Link href="/dashboard/student/profile" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to My Profile
            </Link>
            <span>•</span>
            <span className="bg-blue-50 text-[#1C4980] px-2 py-0.5 rounded-full font-bold">CAMPUS ATS RESUME SUITE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Vidyalankar ATS Resume Architect
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build, edit, and export an industry-standard ATS-friendly single-column resume with FAANG-grade formatting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Template Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setTemplate("harvard")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                template === "harvard" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Harvard Classic
            </button>
            <button
              onClick={() => setTemplate("tech_modern")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                template === "tech_modern" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tech Modern
            </button>
            <button
              onClick={() => setTemplate("executive_pro")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                template === "executive_pro" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Executive Pro
            </button>
          </div>

          <button
            onClick={handleSaveToProfile}
            disabled={saving}
            className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : saveSuccess ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>{saveSuccess ? "Saved to Profile!" : "Save Profile"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-2xl bg-[#DD3333] hover:bg-[#c52b2b] text-white font-bold text-xs shadow-md shadow-[#DD3333]/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>1-Click PDF Download</span>
          </button>
        </div>
      </div>

      {/* ATS Live Score Meter */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-sm border border-emerald-200">
            {calculateAtsScore()}%
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 flex items-center gap-2">
              ATS Compliance & Single-Column Readability Score
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">FAANG Approved</span>
            </p>
            <p className="text-[11px] text-slate-500">Includes quantified metrics, action verbs, clean hyperlinks, and strict parsing schema.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>Single-Column ATS Parser Ready</span>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Comprehensive Multi-Section Editor (Hidden on Print) */}
        <div className="lg:col-span-5 space-y-4 print:hidden">
          {/* Section Navigation Tabs */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-1.5">
            {navSections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? "bg-[#1C4980] text-white shadow-sm" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* 1. CONTACT & BIO */}
          {activeSection === "contact" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <User className="h-4 w-4 text-[#1C4980]" />
                1. Personal Details & Contact Links
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resumeData.name}
                    onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={resumeData.headline || ""}
                    onChange={(e) => setResumeData({ ...resumeData, headline: e.target.value })}
                    placeholder="e.g. SDE Intern / Computer Engineer"
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={resumeData.email}
                    onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={resumeData.phone}
                    onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Location (City, Country)</label>
                <input
                  type="text"
                  value={resumeData.location}
                  onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={resumeData.linkedin}
                    onChange={(e) => setResumeData({ ...resumeData, linkedin: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
                    placeholder="linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={resumeData.github}
                    onChange={(e) => setResumeData({ ...resumeData, github: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
                    placeholder="github.com/username"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Portfolio URL</label>
                  <input
                    type="text"
                    value={resumeData.portfolio}
                    onChange={(e) => setResumeData({ ...resumeData, portfolio: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
                    placeholder="yashraj.dev"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Professional Summary / Objective</label>
                <textarea
                  rows={4}
                  value={resumeData.summary}
                  onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* 2. EDUCATION */}
          {activeSection === "education" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[#1C4980]" />
                  2. Education & Academic Background
                </h3>
                <button
                  onClick={addEducation}
                  className="text-xs font-bold text-[#1C4980] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Degree
                </button>
              </div>

              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 relative">
                  <button
                    onClick={() => removeEducation(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 cursor-pointer"
                    title="Remove Degree"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Institution / College Name</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Degree & Major</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Score / CGPA / %</label>
                      <input
                        type="text"
                        value={edu.score}
                        onChange={(e) => updateEducation(idx, "score", e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Duration / Years</label>
                    <input
                      type="text"
                      value={edu.duration}
                      onChange={(e) => updateEducation(idx, "duration", e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                      placeholder="e.g. 2022 – 2026"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. EXPERIENCE & INTERNSHIPS */}
          {activeSection === "experience" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[#1C4980]" />
                  3. Work Experience & Internships
                </h3>
                <button
                  onClick={addExperience}
                  className="text-xs font-bold text-[#1C4980] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Experience
                </button>
              </div>

              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 relative">
                  <button
                    onClick={() => removeExperience(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 cursor-pointer"
                    title="Remove Experience"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Company / Organization</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(idx, "company", e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Role / Designation</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExperience(idx, "role", e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Duration</label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => updateExperience(idx, "duration", e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                        placeholder="e.g. June 2025 – Dec 2025"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateExperience(idx, "location", e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                        placeholder="e.g. Mumbai / Remote"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold uppercase text-slate-500">Accomplishments (STAR Bullets)</label>
                      <button
                        type="button"
                        onClick={() => addExpBullet(idx)}
                        className="text-[10px] font-bold text-[#1C4980] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" /> Add Bullet
                      </button>
                    </div>
                    {(exp.bullets || []).map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <textarea
                          rows={2}
                          value={b}
                          onChange={(e) => updateExpBullet(idx, bIdx, e.target.value)}
                          className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none"
                          placeholder="Action verb + Context + Quantified metric (e.g. Accelerated query speed by 35%)..."
                        />
                        <button
                          type="button"
                          onClick={() => removeExpBullet(idx, bIdx)}
                          className="text-slate-300 hover:text-rose-500 cursor-pointer p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. TECHNICAL PROJECTS */}
          {activeSection === "projects" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FolderGit2 className="h-4 w-4 text-[#1C4980]" />
                  4. Technical Projects
                </h3>
                <button
                  onClick={addProject}
                  className="text-xs font-bold text-[#1C4980] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Project
                </button>
              </div>

              {resumeData.projects.map((proj, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 relative">
                  <button
                    onClick={() => removeProject(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 cursor-pointer"
                    title="Remove Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Project Title</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => updateProject(idx, "title", e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Technologies Used</label>
                      <input
                        type="text"
                        value={proj.tech}
                        onChange={(e) => updateProject(idx, "tech", e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                        placeholder="e.g. Next.js 16, PostgreSQL, Docker"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Codebase / Live Link</label>
                      <input
                        type="text"
                        value={proj.link}
                        onChange={(e) => updateProject(idx, "link", e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold uppercase text-slate-500">Key Deliverables & Bullets</label>
                      <button
                        type="button"
                        onClick={() => addProjBullet(idx)}
                        className="text-[10px] font-bold text-[#1C4980] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" /> Add Bullet
                      </button>
                    </div>
                    {(proj.bullets || []).map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <textarea
                          rows={2}
                          value={b}
                          onChange={(e) => updateProjBullet(idx, bIdx, e.target.value)}
                          className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none"
                          placeholder="What did you build, what tools did you use, and what was the measured result?..."
                        />
                        <button
                          type="button"
                          onClick={() => removeProjBullet(idx, bIdx)}
                          className="text-slate-300 hover:text-rose-500 cursor-pointer p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. TECHNICAL SKILLS & STACK */}
          {activeSection === "skills" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#1C4980]" />
                5. Technical Stack & Core Competencies
              </h3>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Programming Languages</label>
                <input
                  type="text"
                  value={resumeData.skills.languages}
                  onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, languages: e.target.value } })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-semibold"
                  placeholder="e.g. C++, Java, Python, JavaScript, TypeScript, Go, SQL"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Frameworks & Web Technologies</label>
                <input
                  type="text"
                  value={resumeData.skills.frameworks}
                  onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, frameworks: e.target.value } })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-semibold"
                  placeholder="e.g. React.js, Next.js, Node.js, Express, Spring Boot, TailwindCSS"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Databases & Caching</label>
                <input
                  type="text"
                  value={resumeData.skills.databases}
                  onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, databases: e.target.value } })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-semibold"
                  placeholder="e.g. PostgreSQL, MongoDB, Redis, MySQL, Prisma ORM"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Developer Tools, Cloud & DevOps</label>
                <input
                  type="text"
                  value={resumeData.skills.tools}
                  onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, tools: e.target.value } })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-semibold"
                  placeholder="e.g. Docker, Git, GitHub Actions, AWS (S3, EC2), Postman, Linux"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Core CS Fundamentals</label>
                <input
                  type="text"
                  value={resumeData.skills.fundamentals || ""}
                  onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, fundamentals: e.target.value } })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-semibold"
                  placeholder="e.g. Data Structures & Algorithms, OOP, OS, DBMS, Computer Networks, System Design"
                />
              </div>
            </div>
          )}

          {/* 6. ACHIEVEMENTS */}
          {activeSection === "achievements" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#1C4980]" />
                  6. Honors, Hackathons & Competitive Coding
                </h3>
                <button
                  onClick={addAchievement}
                  className="text-xs font-bold text-[#1C4980] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Achievement
                </button>
              </div>

              <div className="space-y-2">
                {resumeData.achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ach}
                      onChange={(e) => updateAchievement(idx, e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium"
                    />
                    <button
                      onClick={() => removeAchievement(idx)}
                      className="text-slate-300 hover:text-rose-500 cursor-pointer p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. CERTIFICATIONS */}
          {activeSection === "certifications" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#1C4980]" />
                  7. Professional Certifications
                </h3>
                <button
                  onClick={addCertification}
                  className="text-xs font-bold text-[#1C4980] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Certificate
                </button>
              </div>

              {(resumeData.certifications || []).map((cert, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative">
                  <button
                    onClick={() => removeCertification(idx)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Certificate Name</label>
                    <input
                      type="text"
                      value={cert.title}
                      onChange={(e) => updateCertification(idx, "title", e.target.value)}
                      className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Issuing Body</label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => updateCertification(idx, "issuer", e.target.value)}
                        className="w-full p-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Year / ID</label>
                      <input
                        type="text"
                        value={cert.year}
                        onChange={(e) => updateCertification(idx, "year", e.target.value)}
                        className="w-full p-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 8. LEADERSHIP & POR */}
          {activeSection === "leadership" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#1C4980]" />
                  8. Leadership & Positions of Responsibility
                </h3>
                <button
                  onClick={addLeadership}
                  className="text-xs font-bold text-[#1C4980] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Position
                </button>
              </div>

              {(resumeData.leadership || []).map((lead, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative">
                  <button
                    onClick={() => removeLeadership(idx)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Role / Position</label>
                      <input
                        type="text"
                        value={lead.role}
                        onChange={(e) => updateLeadership(idx, "role", e.target.value)}
                        className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Organization / Club</label>
                      <input
                        type="text"
                        value={lead.organization}
                        onChange={(e) => updateLeadership(idx, "organization", e.target.value)}
                        className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Details & Responsibilities</label>
                    <textarea
                      rows={2}
                      value={lead.details}
                      onChange={(e) => updateLeadership(idx, "details", e.target.value)}
                      className="w-full p-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Live Rendered Resume Document */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl print:p-0 print:border-0 print:shadow-none min-h-[950px]">
          {/* =========================================================================
              1. HARVARD CLASSIC ATS TEMPLATE (Default industry gold standard)
             ========================================================================= */}
          {template === "harvard" && (
            <div className="font-serif text-slate-900 space-y-3.5 text-xs leading-relaxed max-w-[800px] mx-auto print:text-black">
              {/* Header */}
              <div className="text-center space-y-1 border-b border-black pb-2.5">
                <h1 className="text-2xl font-bold tracking-tight uppercase">{resumeData.name}</h1>
                <p className="text-[11px] text-slate-700 print:text-black font-sans">
                  {resumeData.location} • {resumeData.phone} • {resumeData.email}
                </p>
                <p className="text-[11px] text-slate-700 print:text-black font-sans">
                  <a href={resumeData.linkedin} className="hover:underline">{resumeData.linkedin}</a> • <a href={resumeData.github} className="hover:underline">{resumeData.github}</a> • <a href={resumeData.portfolio} className="hover:underline">{resumeData.portfolio}</a>
                </p>
              </div>

              {/* Education */}
              {resumeData.education?.length > 0 && (
                <div className="space-y-1">
                  <h2 className="font-bold font-sans text-xs uppercase tracking-widest border-b border-slate-300 pb-0.5">
                    Education
                  </h2>
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-baseline font-bold text-xs">
                        <span>{edu.institution || edu.degree}</span>
                        <span className="font-sans font-normal text-[11px]">{edu.duration || edu.year}</span>
                      </div>
                      <div className="flex justify-between items-baseline text-[11px] italic">
                        <span>{edu.degree}</span>
                        <span className="font-sans font-semibold not-italic">{edu.score || edu.cgpa}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Experience */}
              {resumeData.experience?.length > 0 && (
                <div className="space-y-1.5">
                  <h2 className="font-bold font-sans text-xs uppercase tracking-widest border-b border-slate-300 pb-0.5">
                    Experience & Internships
                  </h2>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-baseline font-bold text-xs">
                        <span>{exp.company} — {exp.role}</span>
                        <span className="font-sans font-normal text-[11px]">{exp.duration}</span>
                      </div>
                      {exp.location && (
                        <p className="text-[10px] text-slate-600 font-sans italic">{exp.location}</p>
                      )}
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-slate-800 print:text-black">
                        {Array.isArray(exp.bullets) ? exp.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        )) : (
                          <li>{exp.description || "Contributed to core feature delivery and API endpoints."}</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Technical Projects */}
              {resumeData.projects?.length > 0 && (
                <div className="space-y-1.5">
                  <h2 className="font-bold font-sans text-xs uppercase tracking-widest border-b border-slate-300 pb-0.5">
                    Technical Projects
                  </h2>
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-baseline font-bold text-xs">
                        <span>{proj.title} <span className="font-normal text-[10px] text-slate-600 font-sans">| {proj.tech}</span></span>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" className="font-sans text-[10px] underline">Codebase</a>
                        )}
                      </div>
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-slate-800 print:text-black">
                        {Array.isArray(proj.bullets) ? proj.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        )) : (
                          <li>{proj.description || "Designed modular architecture and responsive interface."}</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Technical Skills */}
              <div className="space-y-1">
                <h2 className="font-bold font-sans text-xs uppercase tracking-widest border-b border-slate-300 pb-0.5">
                  Technical Skills & Fundamentals
                </h2>
                <div className="text-[11px] space-y-0.5">
                  {resumeData.skills.languages && <p><strong>Languages:</strong> {resumeData.skills.languages}</p>}
                  {resumeData.skills.frameworks && <p><strong>Frameworks:</strong> {resumeData.skills.frameworks}</p>}
                  {resumeData.skills.databases && <p><strong>Databases:</strong> {resumeData.skills.databases}</p>}
                  {resumeData.skills.tools && <p><strong>Tools & Cloud:</strong> {resumeData.skills.tools}</p>}
                  {resumeData.skills.fundamentals && <p><strong>Core Fundamentals:</strong> {resumeData.skills.fundamentals}</p>}
                </div>
              </div>

              {/* Achievements */}
              {resumeData.achievements?.length > 0 && (
                <div className="space-y-1">
                  <h2 className="font-bold font-sans text-xs uppercase tracking-widest border-b border-slate-300 pb-0.5">
                    Honors & Achievements
                  </h2>
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px]">
                    {resumeData.achievements.map((ach, idx) => (
                      <li key={idx}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Certifications */}
              {resumeData.certifications?.length > 0 && (
                <div className="space-y-1">
                  <h2 className="font-bold font-sans text-xs uppercase tracking-widest border-b border-slate-300 pb-0.5">
                    Certifications
                  </h2>
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px]">
                    {resumeData.certifications.map((c, idx) => (
                      <li key={idx}>
                        <strong>{c.title}</strong> — {c.issuer} ({c.year}) {c.credentialId && `[ID: ${c.credentialId}]`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Leadership & POR */}
              {resumeData.leadership?.length > 0 && (
                <div className="space-y-1">
                  <h2 className="font-bold font-sans text-xs uppercase tracking-widest border-b border-slate-300 pb-0.5">
                    Leadership & Positions of Responsibility
                  </h2>
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px]">
                    {resumeData.leadership.map((l, idx) => (
                      <li key={idx}>
                        <strong>{l.role}</strong>, {l.organization} ({l.duration}) — {l.details}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              2. TECH MODERN TEMPLATE (Sleek modern styling with bold typography)
             ========================================================================= */}
          {template === "tech_modern" && (
            <div className="font-sans text-slate-900 space-y-4 text-xs leading-relaxed max-w-[800px] mx-auto">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{resumeData.name}</h1>
                  <p className="text-xs font-semibold text-[#DD3333] mt-0.5">{resumeData.headline || "Software Development Engineer"}</p>
                </div>
                <div className="text-right text-[11px] text-slate-600 space-y-0.5">
                  <p>{resumeData.email} • {resumeData.phone}</p>
                  <p>{resumeData.location}</p>
                  <p>{resumeData.github} • {resumeData.linkedin}</p>
                </div>
              </div>

              {/* Experience */}
              {resumeData.experience?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#DD3333]" /> Experience & Internships
                  </h3>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl space-y-1">
                      <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
                        <span>{exp.role} @ {exp.company}</span>
                        <span className="text-[10px] text-slate-500">{exp.duration}</span>
                      </div>
                      <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
                        {Array.isArray(exp.bullets) && exp.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {resumeData.projects?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#1C4980]" /> Technical Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {resumeData.projects.map((proj, idx) => (
                      <div key={idx} className="p-3 border border-slate-200 rounded-xl space-y-1 bg-white">
                        <p className="font-bold text-xs text-slate-900">{proj.title}</p>
                        <p className="text-[10px] font-semibold text-[#DD3333]">{proj.tech}</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                          {Array.isArray(proj.bullets) ? proj.bullets.slice(0, 2).map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          )) : (
                            <li>{proj.description}</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Technical Proficiencies
                </h3>
                <div className="p-3 bg-slate-50 rounded-xl text-[11px] space-y-1 text-slate-700">
                  <p><strong>Languages:</strong> {resumeData.skills.languages}</p>
                  <p><strong>Frameworks:</strong> {resumeData.skills.frameworks}</p>
                  <p><strong>Databases & Cloud:</strong> {resumeData.skills.databases}, {resumeData.skills.tools}</p>
                  {resumeData.skills.fundamentals && <p><strong>CS Fundamentals:</strong> {resumeData.skills.fundamentals}</p>}
                </div>
              </div>

              {/* Education */}
              {resumeData.education?.length > 0 && (
                <div className="space-y-1">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500" /> Education
                  </h3>
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-baseline text-[11px] border-b border-slate-100 py-1">
                      <div>
                        <span className="font-bold">{edu.institution}</span> — <span>{edu.degree}</span>
                      </div>
                      <span className="font-semibold text-slate-600">{edu.score} • {edu.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              3. EXECUTIVE PRO TEMPLATE (Clean high-contrast layout)
             ========================================================================= */}
          {template === "executive_pro" && (
            <div className="font-sans text-slate-900 space-y-3.5 text-xs leading-relaxed max-w-[800px] mx-auto">
              <div className="bg-[#1C4980] text-white p-4 rounded-xl flex justify-between items-center print:bg-black">
                <div>
                  <h1 className="text-xl font-bold tracking-wide uppercase">{resumeData.name}</h1>
                  <p className="text-[11px] text-blue-100 mt-0.5">{resumeData.headline || "Engineering Student • Placement Ready"}</p>
                </div>
                <div className="text-right text-[10px] text-blue-100 space-y-0.5">
                  <p>{resumeData.phone} | {resumeData.email}</p>
                  <p>{resumeData.location}</p>
                  <p>{resumeData.github} | {resumeData.linkedin}</p>
                </div>
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] text-slate-700 italic">
                  {resumeData.summary}
                </div>
              )}

              {/* Experience */}
              {resumeData.experience?.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C4980] border-b border-blue-100 pb-1">
                    Internship Experience
                  </h3>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-baseline font-bold text-xs">
                        <span>{exp.role} <span className="font-normal text-slate-600">@ {exp.company}</span></span>
                        <span className="text-[10px] text-slate-500">{exp.duration}</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-slate-700">
                        {Array.isArray(exp.bullets) && exp.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {resumeData.projects?.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C4980] border-b border-blue-100 pb-1">
                    Featured Projects
                  </h3>
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-baseline font-bold text-xs">
                        <span>{proj.title} <span className="font-normal text-[10px] text-slate-500">[{proj.tech}]</span></span>
                        {proj.link && <span className="text-[10px] underline text-[#DD3333]">Link</span>}
                      </div>
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-slate-700">
                        {Array.isArray(proj.bullets) && proj.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Grid */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C4980] border-b border-blue-100 pb-1">
                  Technical Expertise
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <p className="font-bold text-slate-800">Languages & Core:</p>
                    <p className="text-slate-600">{resumeData.skills.languages}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <p className="font-bold text-slate-800">Frameworks & Tools:</p>
                    <p className="text-slate-600">{resumeData.skills.frameworks}, {resumeData.skills.tools}</p>
                  </div>
                </div>
              </div>

              {/* Achievements & Certifications */}
              <div className="grid grid-cols-2 gap-4">
                {resumeData.achievements?.length > 0 && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C4980] border-b border-blue-100 pb-1">
                      Honors & Awards
                    </h3>
                    <ul className="list-disc list-outside ml-4 space-y-0.5 text-[10px] text-slate-700">
                      {resumeData.achievements.map((a, idx) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {resumeData.education?.length > 0 && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C4980] border-b border-blue-100 pb-1">
                      Education
                    </h3>
                    <div className="space-y-1 text-[10px] text-slate-700">
                      {resumeData.education.map((e, idx) => (
                        <div key={idx}>
                          <p className="font-bold text-slate-800">{e.institution}</p>
                          <p>{e.degree} • <span className="font-semibold">{e.score}</span></p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
