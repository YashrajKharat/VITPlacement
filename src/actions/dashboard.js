"use server";

import { auth } from "@/lib/auth";
import { db, toPlain } from "@/lib/db";
import { getJobRecommendationsAction } from "./ai";

export async function getStudentDashboardAction() {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    return { error: "Unauthorized" };
  }
  let student = await db.students.getByUserId(session.user.id);
  if (!student) {
    student = {
      id: `student-profile-${session.user.id}`,
      userId: session.user.id,
      name: session.user.name || "Student",
      email: session.user.email,
      department: "CMPN",
      batch: "2026",
      cgpa: null,
      education: [],
      experience: [],
      projects: [],
      skills: [],
      achievements: [],
      certificates: [],
      placementReadinessScore: 0,
      atsScore: 0,
      skillGapScore: 0
    };
  }

  const applications = await db.applications.listByStudent(student.id);
  const interviews = await db.interviews.listByStudent(student.id);
  const activityLogs = await db.activityLogs.listByUser(session.user.id);

  return toPlain({
    success: true,
    session,
    student,
    applications: applications || [],
    interviews: interviews || [],
    activityLogs: activityLogs || []
  });
}

export async function getStudentProfileAction() {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    return { error: "Unauthorized" };
  }
  let student = await db.students.getByUserId(session.user.id);
  return toPlain({ success: true, session, student });
}

export async function getStudentJobsAction() {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    return { error: "Unauthorized" };
  }
  let student = await db.students.getByUserId(session.user.id);
  if (!student) return { error: "Profile not found" };

  const jobs = await db.jobs.list();
  const bookmarks = await db.bookmarks.listByStudent(student.id);
  const applications = await db.applications.listByStudent(student.id);
  const recsRes = await getJobRecommendationsAction(student.id);

  return toPlain({
    success: true,
    session,
    student,
    jobs: jobs || [],
    bookmarks: bookmarks || [],
    applications: applications || [],
    recommendations: recsRes?.success ? recsRes.recommendations : []
  });
}

export async function getStudentInterviewsAction() {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    return { error: "Unauthorized" };
  }
  const student = await db.students.getByUserId(session.user.id);
  if (!student) return { error: "Profile not found" };

  const interviews = await db.interviews.listByStudent(student.id);
  return toPlain({ success: true, session, interviews: interviews || [] });
}

export async function getStudentOffersAction() {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    return { error: "Unauthorized" };
  }
  const student = await db.students.getByUserId(session.user.id);
  if (!student) return { error: "Profile not found" };

  const offers = await db.offerLetters.listByStudent(student.id);
  return toPlain({ success: true, session, student, offers: offers || [] });
}

export async function getRecruiterDashboardAction() {
  const session = await auth();
  if (!session || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  const recruiters = await db.recruiters.list();
  let currentRec = recruiters.find(r => r.userId === session.user.id);
  if (!currentRec) {
    currentRec = await db.recruiters.getByUserId(session.user.id);
  }
  if (!currentRec) return { error: "Recruiter profile not found" };

  const applications = await db.applications.listByRecruiter(session.user.id);
  const allJobs = await db.jobs.list();
  const companyJobs = allJobs.filter(j => j.companyId === currentRec.companyId);

  return toPlain({
    success: true,
    session,
    recruiter: currentRec,
    applications: applications || [],
    jobs: companyJobs || []
  });
}

export async function getRecruiterCompanyAction() {
  const session = await auth();
  if (!session || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  const recruiters = await db.recruiters.list();
  let currentRec = recruiters.find(r => r.userId === session.user.id);
  if (!currentRec) {
    currentRec = await db.recruiters.getByUserId(session.user.id);
  }
  if (!currentRec) return { error: "Recruiter profile not found" };

  const allCompanies = await db.companies.list();
  const company = allCompanies.find(c => c.id === currentRec.companyId);

  return toPlain({
    success: true,
    session,
    company
  });
}

export async function getRecruiterCandidatesAction() {
  const session = await auth();
  if (!session || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }
  const students = await db.students.list();
  return toPlain({ success: true, session, students: students || [] });
}

export async function getRecruiterInterviewsAction() {
  const session = await auth();
  if (!session || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }
  const interviews = await db.interviews.listByRecruiter(session.user.id);
  return toPlain({ success: true, session, interviews: interviews || [] });
}

export async function getTpoDashboardAction() {
  const session = await auth();
  if (!session || session.user.role !== "TPO") {
    return { error: "Unauthorized" };
  }

  const companies = await db.companies.list();
  const students = await db.students.list();
  const applications = await db.applications.listAll();
  const recruiters = await db.recruiters.list();

  return toPlain({
    success: true,
    session,
    companies: companies || [],
    students: students || [],
    applications: applications || [],
    recruiters: recruiters || []
  });
}

export async function getAdminDashboardAction() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const allUsers = await db.users.list();
  const students = await db.students.list();
  const recruiters = await db.recruiters.list();
  const companies = await db.companies.list();
  const jobs = await db.jobs.list();
  const logs = await db.activityLogs.listAll();

  return toPlain({
    success: true,
    session,
    stats: {
      users: allUsers.length,
      students: students.length,
      recruiters: recruiters.length,
      companies: companies.length,
      jobs: jobs.length
    },
    logs: logs || []
  });
}

export async function getAdminUsersAction() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }
  try {
    const userList = await db.users.list();
    return toPlain({ success: true, session, users: userList || [] });
  } catch (err) {
    return { error: err.message || "Failed to load users" };
  }
}

export async function getUserNotificationsAction() {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };
  try {
    const list = await db.notifications.listByUser(session.user.id);
    return toPlain({ success: true, notifications: list || [] });
  } catch (err) {
    return { error: "Failed to load notifications" };
  }
}

export async function markNotificationReadAction(notificationId) {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };
  try {
    await db.notifications.markAsRead(notificationId);
    return { success: true };
  } catch (err) {
    return { error: "Failed to mark notification as read" };
  }
}

export async function markAllNotificationsReadAction() {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };
  try {
    const list = await db.notifications.listByUser(session.user.id);
    for (const n of list) {
      if (!n.read) {
        await db.notifications.markAsRead(n.id);
      }
    }
    return { success: true };
  } catch (err) {
    return { error: "Failed to mark all notifications as read" };
  }
}

export async function getAdminAuditLogsAction() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }
  try {
    const logs = await db.activityLogs.listAll();
    return toPlain({ success: true, logs });
  } catch (err) {
    return { error: err.message || "Failed to load audit logs" };
  }
}

export async function updateCompanyAction(companyId, companyData) {
  const session = await auth();
  if (!session || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }
  try {
    const updated = await db.companies.update(companyId, companyData);
    return toPlain({ success: true, company: updated });
  } catch (err) {
    return { error: err.message || "Failed to update company" };
  }
}

export async function updateStudentProfileAction(studentData) {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    return { error: "Unauthorized" };
  }
  try {
    const updated = await db.students.update(session.user.id, studentData);
    
    await db.activityLogs.create({
      userId: session.user.id,
      action: "Profile Saved",
      details: "Updated core student personal and academic details."
    });

    return toPlain({ success: true, student: updated });
  } catch (err) {
    return { error: err.message || "Failed to update profile" };
  }
}

export async function deleteStudentResumeAction() {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    return { error: "Unauthorized" };
  }
  try {
    const student = await db.students.getByUserId(session.user.id);
    if (student?.resumeUrl) {
      try {
        const fs = await import("fs/promises");
        const path = await import("path");
        const relativePath = student.resumeUrl.replace(/^\//, "");
        const fullPath = path.join(process.cwd(), "public", relativePath);
        await fs.unlink(fullPath).catch(() => {});
      } catch (err) {
        // Ignore file system unlink errors
      }
    }

    const updated = await db.students.update(session.user.id, {
      resumeUrl: null,
      resumeText: null,
      atsScore: 0
    });

    await db.activityLogs.create({
      userId: session.user.id,
      action: "Resume Deleted",
      details: "Removed attached resume document from profile."
    });

    return toPlain({ success: true, student: updated });
  } catch (err) {
    return { error: err.message || "Failed to delete resume" };
  }
}

export async function verifyCompanyAction(companyId, status) {
  const session = await auth();
  if (!session || session.user.role !== "TPO") {
    return { error: "Unauthorized" };
  }
  try {
    const updated = await db.companies.verify(companyId, status);
    return toPlain({ success: true, company: updated });
  } catch (err) {
    return { error: err.message || "Failed to verify company" };
  }
}

export async function getTpoDrivesAction() {
  const session = await auth();
  if (!session || session.user.role !== "TPO") {
    return { error: "Unauthorized" };
  }
  try {
    const list = await db.jobs.list();
    return toPlain({ success: true, jobs: list });
  } catch (err) {
    return { error: err.message || "Failed to load drives" };
  }
}

export async function getTpoRecruitersAction() {
  const session = await auth();
  if (!session || session.user.role !== "TPO") {
    return { error: "Unauthorized" };
  }
  try {
    const list = await db.recruiters.list();
    return toPlain({ success: true, recruiters: list });
  } catch (err) {
    return { error: err.message || "Failed to load recruiters" };
  }
}

export async function verifyRecruiterAction(recId, status) {
  const session = await auth();
  if (!session || session.user.role !== "TPO") {
    return { error: "Unauthorized" };
  }
  try {
    const updated = await db.recruiters.verify(recId, status);
    return toPlain({ success: true, recruiter: updated });
  } catch (err) {
    return { error: err.message || "Failed to verify recruiter" };
  }
}

export async function getTpoStudentsAction() {
  const session = await auth();
  if (!session || session.user.role !== "TPO") {
    return { error: "Unauthorized" };
  }
  try {
    const list = await db.students.list();
    return toPlain({ success: true, students: list });
  } catch (err) {
    return { error: err.message || "Failed to load students" };
  }
}
