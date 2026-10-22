"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import fs from "fs/promises";
import path from "path";
import { extractTextFromFile } from "@/lib/resume-parser";
import { 
  extractCertificateDetails, 
  detectCertificateAuthenticity,
  auditCompanyCredibility,
  verifyCertificateAgainstSubmission, 
  analyzeInternshipReport, 
  generateFacultyAiGradingAssistant,
  enhanceWeeklyWorkLogWithAi,
  extractInternshipSkillsForProfile,
  calculateFinalGrade 
} from "@/lib/internship-verifier";

// Helper: Call AI (Gemini / OpenAI) if configured
async function callAiService(prompt, systemInstruction = "You are an expert academic evaluator.") {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim() !== "" && !geminiKey.includes("your-key")) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `${systemInstruction}\n\n${prompt}` }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1000 }
        })
      });
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
        if (text) return text;
      }
    } catch (err) {
      console.warn("Gemini API call failed:", err);
    }
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey && apiKey.trim() !== "" && !apiKey.includes("your-key")) {
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
          temperature: 0.3,
          max_tokens: 1000
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content || null;
      }
    } catch (err) {
      console.warn("OpenAI API call failed:", err);
    }
  }
  return null;
}

// ----------------------------------------------------
// 1. Requirements Management (Coordinator / Admin / TPO)
// ----------------------------------------------------

export async function getInternshipRequirementsAction() {
  try {
    const list = await db.internships.requirements.list();
    return { success: true, requirements: list || [] };
  } catch (err) {
    return { error: err.message || "Failed to load internship requirements" };
  }
}

export async function getInternshipRequirementByIdAction(id) {
  try {
    const req = await db.internships.requirements.getById(id);
    if (!req) return { error: "Requirement not found" };
    return { success: true, requirement: req };
  } catch (err) {
    return { error: err.message || "Failed to load requirement" };
  }
}

export async function saveInternshipRequirementAction(data) {
  const session = await auth();
  if (!session || (session.user.role !== "INTERNSHIP_COORDINATOR" && session.user.role !== "ADMIN" && session.user.role !== "TPO")) {
    return { error: "Unauthorized. Coordinator or Admin access required." };
  }

  try {
    let saved;
    if (data.id && data.id.trim() !== "") {
      saved = await db.internships.requirements.update(data.id, data);
    } else {
      saved = await db.internships.requirements.create(data);
    }

    await db.activityLogs.create({
      userId: session.user.id,
      action: "Internship Requirement Configured",
      details: `${saved.semester} requirement for ${saved.department} (${saved.academicYear}) updated.`
    });

    return { success: true, requirement: saved };
  } catch (err) {
    return { error: err.message || "Failed to save requirement" };
  }
}

export async function deleteInternshipRequirementAction(id) {
  const session = await auth();
  if (!session || (session.user.role !== "INTERNSHIP_COORDINATOR" && session.user.role !== "ADMIN")) {
    return { error: "Unauthorized" };
  }

  try {
    await db.internships.requirements.delete(id);
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to delete requirement" };
  }
}

// ----------------------------------------------------
// 2. Student Internship Submission & Document Uploads
// ----------------------------------------------------

export async function getStudentInternshipsAction() {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    return { error: "Unauthorized" };
  }

  try {
    const student = await db.students.getByUserId(session.user.id);
    if (!student) return { error: "Student profile not found" };

    const requirements = await db.internships.requirements.list();
    const submissions = await db.internships.submissions.listByStudent(student.id);

    return {
      success: true,
      session,
      student,
      requirements: requirements || [],
      submissions: submissions || []
    };
  } catch (err) {
    return { error: err.message || "Failed to load student internships" };
  }
}

export async function submitInternshipAction(formData) {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    return { error: "Unauthorized" };
  }

  try {
    const student = await db.students.getByUserId(session.user.id);
    if (!student) return { error: "Student profile not found" };

    const requirementId = formData.get("requirementId");
    const companyName = formData.get("companyName");
    const internshipRole = formData.get("internshipRole");
    const internshipType = formData.get("internshipType") || "Industry Internship";
    const startDateStr = formData.get("startDate");
    const endDateStr = formData.get("endDate");
    const durationWeeks = parseInt(formData.get("durationWeeks")) || 8;
    const location = formData.get("location") || "Mumbai";
    const workMode = formData.get("workMode") || "HYBRID";
    const industryMentorName = formData.get("industryMentorName") || "";
    const industryMentorEmail = formData.get("industryMentorEmail") || "";
    const facultyMentorId = formData.get("facultyMentorId") || "";
    const facultyMentorName = formData.get("facultyMentorName") || "Assigned Faculty Mentor";
    const description = formData.get("description") || "";
    const skillsRaw = formData.get("skills") || "";
    const projectTitle = formData.get("projectTitle") || "";
    const projectDescription = formData.get("projectDescription") || "";

    if (!requirementId || !companyName || !internshipRole || !startDateStr || !endDateStr) {
      return { error: "Please fill in all required fields (Requirement, Company, Role, Dates)." };
    }

    const requirement = await db.internships.requirements.getById(requirementId);
    if (!requirement) {
      return { error: "Selected internship requirement is invalid." };
    }

    // Check submission deadline
    const now = new Date();
    if (requirement.endDate && new Date(requirement.endDate) < now && requirement.status !== "OPEN") {
      return { error: "The deadline for this internship requirement has closed." };
    }

    // Parse skills
    const skills = typeof skillsRaw === "string" 
      ? skillsRaw.split(",").map(s => s.trim()).filter(Boolean)
      : [];

    const submissionData = {
      studentId: student.id,
      requirementId,
      companyName,
      internshipRole,
      internshipType,
      startDate: new Date(startDateStr),
      endDate: new Date(endDateStr),
      durationWeeks,
      location,
      workMode,
      industryMentorName,
      industryMentorEmail,
      facultyMentorId,
      facultyMentorName,
      description,
      skills,
      projectTitle,
      projectDescription,
      status: "SUBMITTED"
    };

    const submission = await db.internships.submissions.create(submissionData);

    // Create Audit Log
    await db.internships.auditLogs.create({
      submissionId: submission.id,
      userId: session.user.id,
      userName: student.name,
      role: "STUDENT",
      action: "INTERNSHIP_SUBMITTED",
      details: `Submitted ${internshipRole} at ${companyName} (${requirement.semester})`
    });

    // Handle Certificate File Upload
    const certFile = formData.get("certificateFile");
    let certText = "";
    if (certFile && typeof certFile === "object" && certFile.size > 0) {
      const uploadRes = await saveInternshipFile(certFile, session.user.id, "certificate");
      if (uploadRes.fileUrl) {
        await db.internships.documents.create({
          submissionId: submission.id,
          docType: "CERTIFICATE",
          fileUrl: uploadRes.fileUrl,
          fileName: certFile.name || "certificate.pdf",
          fileSize: certFile.size,
          mimeType: certFile.type
        });
        certText = uploadRes.extractedText || "";
      }
    }

    // Handle Report File Upload
    const reportFile = formData.get("reportFile");
    let reportText = "";
    if (reportFile && typeof reportFile === "object" && reportFile.size > 0) {
      const uploadRes = await saveInternshipFile(reportFile, session.user.id, "report");
      if (uploadRes.fileUrl) {
        await db.internships.documents.create({
          submissionId: submission.id,
          docType: "REPORT",
          fileUrl: uploadRes.fileUrl,
          fileName: reportFile.name || "report.pdf",
          fileSize: reportFile.size,
          mimeType: reportFile.type
        });
        reportText = uploadRes.extractedText || "";
      }
    }

    // Run Automated Document Extraction & Verification Pipeline
    if (certText && certText.trim().length > 10) {
      const extracted = await extractCertificateDetails(certText, callAiService);
      const verifyRes = verifyCertificateAgainstSubmission(
        extracted, 
        { ...submissionData, student }, 
        requirement.marksConfig
      );

      // Feature 1 & 3: Run AI Authenticity & Forgery Inspection
      const authenticityRes = await detectCertificateAuthenticity(
        extracted,
        certText,
        { ...submissionData, student },
        callAiService
      );

      await db.internships.certificateVerifications.upsert(submission.id, {
        extractedStudentName: extracted.studentName,
        extractedCompany: extracted.company,
        extractedRole: extracted.role,
        extractedStartDate: extracted.startDate,
        extractedEndDate: extracted.endDate,
        extractedDuration: extracted.duration,
        extractedIssueDate: extracted.issueDate,
        extractedCertId: extracted.certificateId,
        extractedAuthority: extracted.authority,
        nameMatchScore: verifyRes.nameMatchScore,
        companyMatchScore: verifyRes.companyMatchScore,
        roleMatchScore: verifyRes.roleMatchScore,
        durationMatchScore: verifyRes.durationMatchScore,
        dateMatchScore: verifyRes.dateMatchScore,
        overallConfidence: verifyRes.overallConfidence,
        status: authenticityRes.aiGeneratedRisk === "HIGH" ? "NEEDS_REVIEW" : verifyRes.status,
        verificationScore: verifyRes.verificationScore,
        breakdown: verifyRes.breakdown,
        anomalies: verifyRes.anomalies,
        // AI Authenticity & Credibility Fields
        authenticityScore: authenticityRes.authenticityScore,
        aiGeneratedRisk: authenticityRes.aiGeneratedRisk,
        riskLevel: authenticityRes.riskLevel,
        authenticityVerdict: authenticityRes.authenticityVerdict,
        forensicFlags: authenticityRes.forensicFlags,
        forensicAnalysis: authenticityRes.forensicAnalysis,
        companyCredibility: authenticityRes.companyCredibility,
        forensicSummary: authenticityRes.summary
      });
    }

    if (reportText && reportText.trim().length > 10) {
      const reportRes = await analyzeInternshipReport(
        reportText, 
        submissionData, 
        requirement.marksConfig, 
        callAiService
      );

      await db.internships.reportAnalyses.upsert(submission.id, {
        completenessScore: reportRes.completenessScore,
        technicalDepthScore: reportRes.technicalDepthScore,
        workDescriptionScore: reportRes.workDescriptionScore,
        learningOutcomesScore: reportRes.learningOutcomesScore,
        documentationScore: reportRes.documentationScore,
        aiSuggestedScore: reportRes.aiSuggestedScore,
        originalityScore: reportRes.originalityScore,
        plagiarismScore: reportRes.plagiarismScore,
        aiWritingProbability: reportRes.aiWritingProbability,
        sectionsFound: reportRes.sectionsFound,
        feedback: reportRes.feedback
      });
    }

    // Generate Company Mentor Evaluation Token Link
    const companyToken = `eval-${submission.id}-${Math.random().toString(36).substring(2, 10)}`;
    await db.internships.companyEvaluations.upsert(submission.id, {
      accessToken: companyToken,
      mentorName: industryMentorName,
      mentorEmail: industryMentorEmail,
      isSubmitted: false
    });

    // Notify Student
    await db.notifications.create({
      userId: session.user.id,
      title: "Internship Submitted Successfully",
      message: `Your ${requirement.semester} internship at ${companyName} has been submitted for verification.`,
      type: "SUCCESS"
    });

    return { success: true, submissionId: submission.id };
  } catch (err) {
    console.error("Submit internship error:", err);
    return { error: err.message || "Failed to submit internship" };
  }
}

// Resubmit internship after correction request
export async function resubmitInternshipAction(submissionId, formData) {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    return { error: "Unauthorized" };
  }

  try {
    const sub = await db.internships.submissions.getById(submissionId);
    if (!sub) return { error: "Submission not found" };

    const companyName = formData.get("companyName") || sub.companyName;
    const internshipRole = formData.get("internshipRole") || sub.internshipRole;
    const description = formData.get("description") || sub.description;
    const projectTitle = formData.get("projectTitle") || sub.projectTitle;
    const projectDescription = formData.get("projectDescription") || sub.projectDescription;

    const updated = await db.internships.submissions.update(submissionId, {
      companyName,
      internshipRole,
      description,
      projectTitle,
      projectDescription,
      status: "RESUBMITTED",
      resubmittedAt: new Date()
    });

    // Check for updated certificate file
    const certFile = formData.get("certificateFile");
    if (certFile && typeof certFile === "object" && certFile.size > 0) {
      const uploadRes = await saveInternshipFile(certFile, session.user.id, "certificate");
      if (uploadRes.fileUrl) {
        await db.internships.documents.create({
          submissionId,
          docType: "CERTIFICATE",
          fileUrl: uploadRes.fileUrl,
          fileName: certFile.name || "certificate.pdf",
          fileSize: certFile.size,
          mimeType: certFile.type
        });

        if (uploadRes.extractedText) {
          const extracted = await extractCertificateDetails(uploadRes.extractedText, callAiService);
          const verifyRes = verifyCertificateAgainstSubmission(
            extracted, 
            { ...updated, student: sub.student }, 
            sub.requirement?.marksConfig
          );

          await db.internships.certificateVerifications.upsert(submissionId, {
            extractedStudentName: extracted.studentName,
            extractedCompany: extracted.company,
            extractedRole: extracted.role,
            extractedStartDate: extracted.startDate,
            extractedEndDate: extracted.endDate,
            extractedDuration: extracted.duration,
            extractedIssueDate: extracted.issueDate,
            extractedCertId: extracted.certificateId,
            extractedAuthority: extracted.authority,
            nameMatchScore: verifyRes.nameMatchScore,
            companyMatchScore: verifyRes.companyMatchScore,
            roleMatchScore: verifyRes.roleMatchScore,
            durationMatchScore: verifyRes.durationMatchScore,
            dateMatchScore: verifyRes.dateMatchScore,
            overallConfidence: verifyRes.overallConfidence,
            status: verifyRes.status,
            verificationScore: verifyRes.verificationScore,
            breakdown: verifyRes.breakdown,
            anomalies: verifyRes.anomalies
          });
        }
      }
    }

    // Check for updated report file
    const reportFile = formData.get("reportFile");
    if (reportFile && typeof reportFile === "object" && reportFile.size > 0) {
      const uploadRes = await saveInternshipFile(reportFile, session.user.id, "report");
      if (uploadRes.fileUrl) {
        await db.internships.documents.create({
          submissionId,
          docType: "REPORT",
          fileUrl: uploadRes.fileUrl,
          fileName: reportFile.name || "report.pdf",
          fileSize: reportFile.size,
          mimeType: reportFile.type
        });

        if (uploadRes.extractedText) {
          const reportRes = await analyzeInternshipReport(
            uploadRes.extractedText, 
            updated, 
            sub.requirement?.marksConfig, 
            callAiService
          );

          await db.internships.reportAnalyses.upsert(submissionId, {
            completenessScore: reportRes.completenessScore,
            technicalDepthScore: reportRes.technicalDepthScore,
            workDescriptionScore: reportRes.workDescriptionScore,
            learningOutcomesScore: reportRes.learningOutcomesScore,
            documentationScore: reportRes.documentationScore,
            aiSuggestedScore: reportRes.aiSuggestedScore,
            sectionsFound: reportRes.sectionsFound,
            feedback: reportRes.feedback
          });
        }
      }
    }

    // Audit Log
    await db.internships.auditLogs.create({
      submissionId,
      userId: session.user.id,
      userName: sub.student?.name || "Student",
      role: "STUDENT",
      action: "CORRECTION_RESUBMITTED",
      oldValue: "CORRECTION_REQUIRED",
      newValue: "RESUBMITTED",
      details: "Student resubmitted corrected internship documents and details."
    });

    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to resubmit internship" };
  }
}

// ----------------------------------------------------
// Replace Certificate Action
// ----------------------------------------------------
export async function replaceInternshipCertificateAction(submissionId, formData) {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized. Please log in." };
  }

  try {
    const sub = await db.internships.submissions.getById(submissionId);
    if (!sub) return { error: "Submission not found." };

    if (session.user.role === "STUDENT") {
      const student = await db.students.getByUserId(session.user.id);
      if (!student || student.id !== sub.studentId) {
        return { error: "Unauthorized. You can only update your own submission." };
      }
    } else if (session.user.role !== "INTERNSHIP_COORDINATOR" && session.user.role !== "ADMIN" && session.user.role !== "TPO") {
      return { error: "Unauthorized." };
    }

    if (sub.isLocked) {
      return { error: "This submission has been finalized and locked by faculty." };
    }

    const certFile = formData.get("certificateFile");
    if (!certFile || typeof certFile !== "object" || certFile.size === 0) {
      return { error: "Please select a valid certificate file (PDF, DOCX, etc.)." };
    }

    const uploadRes = await saveInternshipFile(certFile, session.user.id, "certificate");
    if (!uploadRes.fileUrl) {
      return { error: "Failed to upload certificate file." };
    }

    // Replace document in database
    await db.internships.documents.replace(submissionId, "CERTIFICATE", {
      fileUrl: uploadRes.fileUrl,
      fileName: certFile.name || "certificate.pdf",
      fileSize: certFile.size,
      mimeType: certFile.type
    });

    let verifyRes = null;
    let authenticityRes = null;
    if (uploadRes.extractedText && uploadRes.extractedText.trim().length > 10) {
      const extracted = await extractCertificateDetails(uploadRes.extractedText, callAiService);
      verifyRes = verifyCertificateAgainstSubmission(
        extracted,
        { ...sub, student: sub.student },
        sub.requirement?.marksConfig
      );

      authenticityRes = await detectCertificateAuthenticity(
        extracted,
        uploadRes.extractedText,
        { ...sub, student: sub.student },
        callAiService
      );

      await db.internships.certificateVerifications.upsert(submissionId, {
        extractedStudentName: extracted.studentName,
        extractedCompany: extracted.company,
        extractedRole: extracted.role,
        extractedStartDate: extracted.startDate,
        extractedEndDate: extracted.endDate,
        extractedDuration: extracted.duration,
        extractedIssueDate: extracted.issueDate,
        extractedCertId: extracted.certificateId,
        extractedAuthority: extracted.authority,
        nameMatchScore: verifyRes.nameMatchScore,
        companyMatchScore: verifyRes.companyMatchScore,
        roleMatchScore: verifyRes.roleMatchScore,
        durationMatchScore: verifyRes.durationMatchScore,
        dateMatchScore: verifyRes.dateMatchScore,
        overallConfidence: verifyRes.overallConfidence,
        status: authenticityRes.aiGeneratedRisk === "HIGH" ? "NEEDS_REVIEW" : verifyRes.status,
        verificationScore: verifyRes.verificationScore,
        breakdown: verifyRes.breakdown,
        anomalies: verifyRes.anomalies,
        authenticityScore: authenticityRes.authenticityScore,
        aiGeneratedRisk: authenticityRes.aiGeneratedRisk,
        riskLevel: authenticityRes.riskLevel,
        authenticityVerdict: authenticityRes.authenticityVerdict,
        forensicFlags: authenticityRes.forensicFlags,
        forensicAnalysis: authenticityRes.forensicAnalysis,
        companyCredibility: authenticityRes.companyCredibility,
        forensicSummary: authenticityRes.summary
      });
    }

    // Update submission status if needed
    const newStatus = sub.status === "CORRECTION_REQUIRED" ? "RESUBMITTED" : sub.status;
    await db.internships.submissions.update(submissionId, {
      status: newStatus,
      resubmittedAt: new Date()
    });

    // Create Audit Log
    await db.internships.auditLogs.create({
      submissionId,
      userId: session.user.id,
      userName: session.user.name || "Student",
      role: session.user.role,
      action: "CERTIFICATE_REPLACED",
      details: `Replaced certificate file with "${certFile.name}". Automated OCR confidence: ${verifyRes?.overallConfidence || 0}%, score: ${verifyRes?.verificationScore || 0}/20.`
    });

    // Send Notification
    await db.notifications.create({
      userId: session.user.id,
      title: "Certificate Replaced Successfully",
      message: `Your certificate for ${sub.companyName} was replaced with ${certFile.name} and re-verified.`,
      type: "SUCCESS"
    });

    const updatedSub = await db.internships.submissions.getById(submissionId);

    return {
      success: true,
      message: "Certificate replaced and verified successfully!",
      submission: updatedSub,
      verification: verifyRes
    };
  } catch (err) {
    console.error("Replace certificate error:", err);
    return { error: err.message || "Failed to replace certificate" };
  }
}

// ----------------------------------------------------
// Replace Report Action
// ----------------------------------------------------
export async function replaceInternshipReportAction(submissionId, formData) {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized. Please log in." };
  }

  try {
    const sub = await db.internships.submissions.getById(submissionId);
    if (!sub) return { error: "Submission not found." };

    if (session.user.role === "STUDENT") {
      const student = await db.students.getByUserId(session.user.id);
      if (!student || student.id !== sub.studentId) {
        return { error: "Unauthorized. You can only update your own submission." };
      }
    } else if (session.user.role !== "INTERNSHIP_COORDINATOR" && session.user.role !== "ADMIN" && session.user.role !== "TPO") {
      return { error: "Unauthorized." };
    }

    if (sub.isLocked) {
      return { error: "This submission has been finalized and locked by faculty." };
    }

    const reportFile = formData.get("reportFile");
    if (!reportFile || typeof reportFile !== "object" || reportFile.size === 0) {
      return { error: "Please select a valid report file (PDF, DOCX, etc.)." };
    }

    const uploadRes = await saveInternshipFile(reportFile, session.user.id, "report");
    if (!uploadRes.fileUrl) {
      return { error: "Failed to upload report file." };
    }

    // Replace document in database
    await db.internships.documents.replace(submissionId, "REPORT", {
      fileUrl: uploadRes.fileUrl,
      fileName: reportFile.name || "report.pdf",
      fileSize: reportFile.size,
      mimeType: reportFile.type
    });

    let reportRes = null;
    if (uploadRes.extractedText && uploadRes.extractedText.trim().length > 10) {
      reportRes = await analyzeInternshipReport(
        uploadRes.extractedText,
        sub,
        sub.requirement?.marksConfig,
        callAiService
      );

      await db.internships.reportAnalyses.upsert(submissionId, {
        completenessScore: reportRes.completenessScore,
        technicalDepthScore: reportRes.technicalDepthScore,
        workDescriptionScore: reportRes.workDescriptionScore,
        learningOutcomesScore: reportRes.learningOutcomesScore,
        documentationScore: reportRes.documentationScore,
        aiSuggestedScore: reportRes.aiSuggestedScore,
        originalityScore: reportRes.originalityScore,
        plagiarismScore: reportRes.plagiarismScore,
        aiWritingProbability: reportRes.aiWritingProbability,
        sectionsFound: reportRes.sectionsFound,
        feedback: reportRes.feedback
      });
    }

    // Update submission status if needed
    const newStatus = sub.status === "CORRECTION_REQUIRED" ? "RESUBMITTED" : sub.status;
    await db.internships.submissions.update(submissionId, {
      status: newStatus,
      resubmittedAt: new Date()
    });

    // Create Audit Log
    await db.internships.auditLogs.create({
      submissionId,
      userId: session.user.id,
      userName: session.user.name || "Student",
      role: session.user.role,
      action: "REPORT_REPLACED",
      details: `Replaced internship report file with "${reportFile.name}". AI suggested score: ${reportRes?.aiSuggestedScore || 0}/20.`
    });

    // Send Notification
    await db.notifications.create({
      userId: session.user.id,
      title: "Internship Report Replaced Successfully",
      message: `Your report for ${sub.companyName} was replaced with ${reportFile.name} and re-analyzed.`,
      type: "SUCCESS"
    });

    const updatedSub = await db.internships.submissions.getById(submissionId);

    return {
      success: true,
      message: "Internship report replaced and analyzed successfully!",
      submission: updatedSub,
      reportAnalysis: reportRes
    };
  } catch (err) {
    console.error("Replace report error:", err);
    return { error: err.message || "Failed to replace report" };
  }
}

// ----------------------------------------------------
// 3. Faculty Verification & Evaluation Actions
// ----------------------------------------------------

export async function getFacultyInternshipsAction(filters = {}) {
  const session = await auth();
  if (!session || (session.user.role !== "FACULTY_MENTOR" && session.user.role !== "INTERNSHIP_COORDINATOR" && session.user.role !== "ADMIN" && session.user.role !== "TPO")) {
    return { error: "Unauthorized" };
  }

  try {
    const list = await db.internships.submissions.list();
    const requirements = await db.internships.requirements.list();

    return {
      success: true,
      session,
      submissions: list || [],
      requirements: requirements || []
    };
  } catch (err) {
    return { error: err.message || "Failed to load faculty reviews" };
  }
}

export async function getSubmissionDetailsAction(submissionId) {
  try {
    const sub = await db.internships.submissions.getById(submissionId);
    if (!sub) return { error: "Submission not found" };
    return { success: true, submission: sub };
  } catch (err) {
    return { error: err.message || "Failed to load submission details" };
  }
}

export async function submitFacultyEvaluationAction(submissionId, data) {
  const session = await auth();
  if (!session || (session.user.role !== "FACULTY_MENTOR" && session.user.role !== "INTERNSHIP_COORDINATOR" && session.user.role !== "ADMIN")) {
    return { error: "Unauthorized" };
  }

  try {
    const sub = await db.internships.submissions.getById(submissionId);
    if (!sub) return { error: "Submission not found" };

    const {
      technicalImplementation = 5,
      problemSolving = 5,
      qualityOfOutput = 5,
      vivaUnderstanding = 3,
      vivaExplanation = 3,
      vivaCommunication = 2,
      vivaQuestionHandling = 2,
      attendanceScore = 5,
      reportScore = 20,
      comments = "",
      status = "APPROVED" // APPROVED, CORRECTION_REQUIRED, REJECTED
    } = data;

    // 1. Save Faculty Evaluation
    const facEval = await db.internships.facultyEvaluations.upsert(submissionId, {
      facultyId: session.user.id,
      facultyName: session.user.name || "Faculty Mentor",
      technicalImplementation: parseInt(technicalImplementation),
      problemSolving: parseInt(problemSolving),
      qualityOfOutput: parseInt(qualityOfOutput),
      vivaUnderstanding: parseInt(vivaUnderstanding),
      vivaExplanation: parseInt(vivaExplanation),
      vivaCommunication: parseInt(vivaCommunication),
      vivaQuestionHandling: parseInt(vivaQuestionHandling),
      attendanceScore: parseFloat(attendanceScore),
      comments,
      recommendation: status
    });

    // 2. Update Report Faculty Final Score if provided
    if (reportScore !== undefined) {
      await db.internships.reportAnalyses.upsert(submissionId, {
        facultyFinalScore: parseFloat(reportScore),
        facultyComments: comments
      });
    }

    // 3. Compute Final Score Aggregate (/100)
    // Formula: Cert (20) + Company (30) + Report (20) + Technical (15) + Viva (10) + Attendance (5) = 100
    const certScore = sub.certificateVerify?.verificationScore || 0;
    const compScore = sub.companyEvaluation?.totalScore || (sub.companyEvaluation?.isSubmitted ? sub.companyEvaluation.totalScore : 25);
    const repScore = parseFloat(reportScore) || sub.reportAnalysis?.facultyFinalScore || sub.reportAnalysis?.aiSuggestedScore || 18;
    const techScore = facEval.technicalScore || 15;
    const vivaScore = facEval.vivaScore || 10;
    const attScore = facEval.attendanceScore || 5;

    const finalScore = parseFloat((certScore + compScore + repScore + techScore + vivaScore + attScore).toFixed(1));
    const finalGrade = calculateFinalGrade(finalScore, sub.requirement?.gradeBoundaries);

    // 4. Update Submission Status & Final Marks
    const updatedSub = await db.internships.submissions.update(submissionId, {
      status,
      finalScore,
      finalGrade,
      isLocked: status === "APPROVED"
    });

    // 5. Audit Log
    await db.internships.auditLogs.create({
      submissionId,
      userId: session.user.id,
      userName: session.user.name || "Faculty Mentor",
      role: session.user.role,
      action: `EVALUATION_${status}`,
      oldValue: sub.status,
      newValue: status,
      details: `Faculty evaluated submission. Score: ${finalScore}/100 (Grade: ${finalGrade}). Comments: ${comments}`
    });

    // 6. Notify Student
    if (sub.student?.userId) {
      await db.notifications.create({
        userId: sub.student.userId,
        title: status === "APPROVED" ? "Internship Approved 🎉" : status === "CORRECTION_REQUIRED" ? "Correction Required on Internship" : "Internship Status Updated",
        message: status === "APPROVED" 
          ? `Congratulations! Your ${sub.requirement?.semester} internship has been approved with a Final Score of ${finalScore}/100 (Grade: ${finalGrade}).`
          : `Faculty review update: ${comments || "Please check the correction remarks on your internship portal."}`,
        type: status === "APPROVED" ? "SUCCESS" : status === "CORRECTION_REQUIRED" ? "WARNING" : "INFO"
      });
    }

    return { success: true, submission: updatedSub };
  } catch (err) {
    console.error("Submit faculty eval error:", err);
    return { error: err.message || "Failed to submit evaluation" };
  }
}

export async function requestCorrectionAction(submissionId, reason) {
  const session = await auth();
  if (!session || (session.user.role !== "FACULTY_MENTOR" && session.user.role !== "INTERNSHIP_COORDINATOR" && session.user.role !== "ADMIN")) {
    return { error: "Unauthorized" };
  }

  try {
    const sub = await db.internships.submissions.getById(submissionId);
    if (!sub) return { error: "Submission not found" };

    const updated = await db.internships.submissions.update(submissionId, {
      status: "CORRECTION_REQUIRED",
      correctionReason: reason
    });

    await db.internships.auditLogs.create({
      submissionId,
      userId: session.user.id,
      userName: session.user.name || "Faculty Mentor",
      role: session.user.role,
      action: "CORRECTION_REQUESTED",
      oldValue: sub.status,
      newValue: "CORRECTION_REQUIRED",
      details: `Correction requested: ${reason}`
    });

    if (sub.student?.userId) {
      await db.notifications.create({
        userId: sub.student.userId,
        title: "Internship Correction Requested ⚠️",
        message: `Faculty requested corrections on your ${sub.requirement?.semester} internship: "${reason}"`,
        type: "WARNING"
      });
    }

    return { success: true, submission: updated };
  } catch (err) {
    return { error: err.message || "Failed to request correction" };
  }
}

// ----------------------------------------------------
// 4. Company Mentor Evaluation Actions (Secure Tokenized)
// ----------------------------------------------------

export async function getCompanyEvaluationByTokenAction(token) {
  try {
    const evalData = await db.internships.companyEvaluations.getByToken(token);
    if (!evalData) return { error: "Invalid or expired evaluation link." };
    return { success: true, evaluation: evalData };
  } catch (err) {
    return { error: err.message || "Failed to load company evaluation" };
  }
}

export async function submitCompanyEvaluationAction(token, data) {
  try {
    const existing = await db.internships.companyEvaluations.getByToken(token);
    if (!existing) return { error: "Invalid or expired evaluation link." };
    if (existing.isSubmitted) {
      return { error: "This evaluation has already been submitted and locked." };
    }

    const submitted = await db.internships.companyEvaluations.submit(token, {
      mentorName: data.mentorName || existing.mentorName,
      mentorEmail: data.mentorEmail || existing.mentorEmail,
      technicalKnowledge: parseInt(data.technicalKnowledge) || 5,
      qualityOfWork: parseInt(data.qualityOfWork) || 5,
      problemSolving: parseInt(data.problemSolving) || 5,
      communication: parseInt(data.communication) || 5,
      teamwork: parseInt(data.teamwork) || 5,
      professionalism: parseInt(data.professionalism) || 5,
      feedback: data.feedback || ""
    });

    // Audit Log
    await db.internships.auditLogs.create({
      submissionId: existing.submissionId,
      userId: `company-mentor`,
      userName: data.mentorName || "Company Mentor",
      role: "RECRUITER",
      action: "COMPANY_EVALUATION_SUBMITTED",
      details: `Company mentor submitted performance evaluation. Score: ${submitted.totalScore}/30`
    });

    return { success: true, evaluation: submitted };
  } catch (err) {
    return { error: err.message || "Failed to submit company evaluation" };
  }
}

// ----------------------------------------------------
// 5. Coordinator & TPO Analytics & Audit Actions
// ----------------------------------------------------

export async function getCoordinatorInternshipsAction() {
  const session = await auth();
  if (!session || (session.user.role !== "INTERNSHIP_COORDINATOR" && session.user.role !== "ADMIN" && session.user.role !== "TPO")) {
    return { error: "Unauthorized" };
  }

  try {
    const requirements = await db.internships.requirements.list();
    const submissions = await db.internships.submissions.list();
    const students = await db.students.list();

    return {
      success: true,
      session,
      requirements: requirements || [],
      submissions: submissions || [],
      students: students || []
    };
  } catch (err) {
    return { error: err.message || "Failed to load coordinator data" };
  }
}

export async function getTpoInternshipsAction() {
  const session = await auth();
  if (!session || (session.user.role !== "TPO" && session.user.role !== "ADMIN" && session.user.role !== "INTERNSHIP_COORDINATOR")) {
    return { error: "Unauthorized" };
  }

  try {
    const submissions = await db.internships.submissions.list();
    const requirements = await db.internships.requirements.list();
    const students = await db.students.list();

    return {
      success: true,
      session,
      submissions: submissions || [],
      requirements: requirements || [],
      students: students || []
    };
  } catch (err) {
    return { error: err.message || "Failed to load TPO internship analytics" };
  }
}

export async function getInternshipAuditLogsAction(submissionId) {
  try {
    const logs = await db.internships.auditLogs.listBySubmission(submissionId);
    return { success: true, auditLogs: logs || [] };
  } catch (err) {
    return { error: err.message || "Failed to load audit logs" };
  }
}

// ----------------------------------------------------
// AI-Powered Actions (Features 2, 4, 5, 6)
// ----------------------------------------------------

// Feature 2 & 5: AI Faculty Mentor Grading Advice & Tailored Viva Defense Questions
export async function getFacultyAiGradingAdviceAction(submissionId) {
  try {
    const sub = await db.internships.submissions.getById(submissionId);
    if (!sub) return { error: "Submission not found" };

    const companyEval = sub.companyEvaluation;
    const certVerify = sub.certificateVerify;
    const reportAnalysis = sub.reportAnalysis;

    const advice = await generateFacultyAiGradingAssistant(
      sub,
      companyEval,
      certVerify,
      reportAnalysis,
      callAiService
    );

    return { success: true, advice };
  } catch (err) {
    return { error: err.message || "Failed to generate AI grading advice" };
  }
}

// Feature 6: AI Weekly Log Enhancer
export async function formatWeeklyLogWithAiAction(weekNumber, rawNotes, role = "Software Intern", companyName = "Company") {
  try {
    const enhanced = await enhanceWeeklyWorkLogWithAi(
      weekNumber,
      rawNotes,
      role,
      companyName,
      callAiService
    );
    return { success: true, enhanced };
  } catch (err) {
    return { error: err.message || "Failed to format weekly log with AI" };
  }
}

// Feature 6: Save / Update Weekly Work Logs
export async function saveWeeklyLogsAction(submissionId, weeklyLogs = []) {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  try {
    const sub = await db.internships.submissions.getById(submissionId);
    if (!sub) return { error: "Submission not found" };

    if (session.user.role === "STUDENT") {
      const student = await db.students.getByUserId(session.user.id);
      if (!student || student.id !== sub.studentId) {
        return { error: "Unauthorized" };
      }
    }

    await db.internships.submissions.update(submissionId, {
      weeklyLogs: weeklyLogs
    });

    await db.internships.auditLogs.create({
      submissionId,
      userId: session.user.id,
      userName: session.user.name || "Student",
      role: session.user.role,
      action: "WEEKLY_LOGS_UPDATED",
      details: `Saved ${weeklyLogs.length} weekly milestone logs for ${sub.companyName}.`
    });

    return { success: true, weeklyLogs };
  } catch (err) {
    return { error: err.message || "Failed to save weekly logs" };
  }
}

// Feature 4: AI Verified Skill Extraction & Profile Sync
export async function extractAndSyncInternshipSkillsAction(submissionId) {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  try {
    const sub = await db.internships.submissions.getById(submissionId);
    if (!sub) return { error: "Submission not found" };

    const student = sub.student || await db.students.getById(sub.studentId);
    if (!student) return { error: "Student profile not found" };

    const reportDoc = sub.documents?.find(d => d.docType === "REPORT");
    const extractedSkills = extractInternshipSkillsForProfile(
      sub.description || "",
      sub.projectDescription || "",
      sub.reportAnalysis?.feedback || "",
      sub.companyEvaluation?.feedback || ""
    );

    // Merge into student profile skills
    const existingSkills = Array.isArray(student.skills) ? student.skills : [];
    const newSkillNames = extractedSkills.map(s => s.name);
    const mergedSkills = Array.from(new Set([...existingSkills, ...newSkillNames]));

    await db.students.update(student.id, {
      skills: mergedSkills,
      industryVerifiedSkills: extractedSkills
    });

    // Save on submission record too
    await db.internships.submissions.update(submissionId, {
      verifiedSkills: extractedSkills
    });

    await db.activityLogs.create({
      userId: session.user.id,
      action: "Internship Skills Verified",
      details: `Verified ${extractedSkills.length} industry skills from ${sub.companyName} internship synced to placement profile.`
    });

    return {
      success: true,
      verifiedSkills: extractedSkills,
      allSkills: mergedSkills,
      message: `Successfully verified and synced ${extractedSkills.length} skills from ${sub.companyName} to your Placement Profile!`
    };
  } catch (err) {
    return { error: err.message || "Failed to sync verified skills" };
  }
}

// ----------------------------------------------------
// Helper: Secure File Storage
// ----------------------------------------------------
async function saveInternshipFile(file, userId, subDir = "documents") {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "internships", subDir);
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (e) {}

  const fileBytes = await file.arrayBuffer();
  const buffer = Buffer.from(fileBytes);
  const cleanBase = (file.name || "document.pdf").replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueFileName = `${userId}_${Date.now()}_${cleanBase}`;
  const targetFilePath = path.join(uploadsDir, uniqueFileName);
  
  await fs.writeFile(targetFilePath, buffer);
  const fileUrl = `/uploads/internships/${subDir}/${uniqueFileName}`;

  // Extract text
  let extractedText = "";
  try {
    extractedText = await extractTextFromFile(buffer, file.name, file.type);
  } catch (err) {
    console.warn("Text extraction warning:", err);
  }

  return { fileUrl, extractedText };
}
