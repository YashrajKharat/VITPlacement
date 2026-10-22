"use server";

import { db, toPlain } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createJobAction(data) {
  const session = await auth();
  if (!session || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized. Only recruiters can post jobs." };
  }

  const { title, description, salaryRange, location, type, requirements } = data;
  if (!title || !description || !location || !type) {
    return { error: "Missing required job details." };
  }

  try {
    const job = await db.jobs.create({
      title,
      description,
      salaryRange,
      location,
      type,
      requirements: requirements || [],
      companyId: session.user.companyId
    });

    // Notify all students of a new job opening
    const students = await db.students.list();
    for (const student of students) {
      await db.notifications.create({
        userId: student.userId,
        title: "New Job Opening",
        message: `${session.user.name} has posted a new role: ${title} at Stripe.`,
        type: "INFO"
      });
    }

    revalidatePath("/dashboard/recruiter");
    revalidatePath("/dashboard/student");
    return { success: true, job };
  } catch (err) {
    return { error: err.message || "Failed to create job posting." };
  }
}

export async function deleteJobAction(jobId) {
  const session = await auth();
  if (!session || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized." };
  }

  try {
    await db.jobs.delete(jobId);
    revalidatePath("/dashboard/recruiter");
    revalidatePath("/dashboard/student");
    return { success: true };
  } catch (err) {
    return { error: "Failed to delete job posting." };
  }
}

export async function updateJobAction(jobId, data) {
  const session = await auth();
  if (!session || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized. Only recruiters can update jobs." };
  }

  const { title, description, salaryRange, location, type, requirements } = data;
  if (!title || !description || !location || !type) {
    return { error: "Missing required job details." };
  }

  try {
    const job = await db.jobs.update(jobId, {
      title,
      description,
      salaryRange,
      location,
      type,
      requirements: requirements || []
    });

    revalidatePath("/dashboard/recruiter");
    revalidatePath("/dashboard/student");
    return { success: true, job };
  } catch (err) {
    return { error: err.message || "Failed to update job posting." };
  }
}

export async function applyToJobAction(formData) {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    return { error: "Unauthorized. Only students can apply to jobs." };
  }

  const jobId = formData.get("jobId");
  const resumeUrl = formData.get("resumeUrl") || "https://res.cloudinary.com/demo/image/upload/sample_resume.pdf";

  if (!jobId) return { error: "Invalid Job ID" };

  try {
    const student = await db.students.getByUserId(session.user.id);
    if (!student) return { error: "Student profile not found." };

    // Check if already applied
    const applications = await db.applications.listByStudent(student.id);
    const alreadyApplied = applications.some(a => a.jobId === jobId);
    if (alreadyApplied) {
      return { error: "You have already applied to this drive." };
    }

    const application = await db.applications.create({
      jobId,
      studentId: student.id,
      resumeUrl
    });

    // Notify Recruiter
    const job = await db.jobs.getById(jobId);
    const recruiters = await db.recruiters.list();
    const companyRecruiters = recruiters.filter(r => r.companyId === job.companyId);
    
    for (const rec of companyRecruiters) {
      await db.notifications.create({
        userId: rec.userId,
        title: "New Application Received",
        message: `${student.name} applied for the ${job.title} position.`,
        type: "INFO"
      });
    }

    // Log Activity
    await db.activityLogs.create({
      userId: session.user.id,
      action: "Applied for Job",
      details: `Submitted application for ${job.title} at ${job.company.name}`
    });

    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/recruiter");
    return { success: true, application };
  } catch (err) {
    return { error: err.message || "Failed to submit application." };
  }
}

export async function updateApplicationStatusAction(applicationId, status, recruiterName) {
  const session = await auth();
  if (!session || !["RECRUITER", "TPO"].includes(session.user.role)) {
    return { error: "Unauthorized." };
  }

  try {
    const app = await db.applications.updateStatus(applicationId, status);
    
    // Get student details to send notification
    const student = await db.students.getByUserId(session.user.id); // placeholder or retrieve
    // In our simplified mock db, we can find the student profile in all applications
    const apps = await db.applications.listAll();
    const currentApp = apps.find(a => a.id === applicationId);

    if (currentApp) {
      const studentUserId = currentApp.student.userId;
      
      let title = "Application Updated";
      let type = "INFO";
      let msg = `Your application for ${currentApp.job.title} has been updated to ${status}.`;

      if (status === "SHORTLISTED") {
        title = "Congratulations! Shortlisted";
        type = "SUCCESS";
        msg = `You have been shortlisted for ${currentApp.job.title} by ${currentApp.job.company.name}. Prepare for the upcoming interview!`;
      } else if (status === "REJECTED") {
        title = "Application Status Update";
        type = "DANGER";
        msg = `Thank you for your interest in ${currentApp.job.title} at ${currentApp.job.company.name}. Unfortunately, they are not moving forward at this stage.`;
      } else if (status === "OFFERED") {
        title = "Job Offer Received! 🥂";
        type = "SUCCESS";
        msg = `You have received a formal Job Offer for ${currentApp.job.title} at ${currentApp.job.company.name}! Check your dashboard.`;
      }

      await db.notifications.create({
        userId: studentUserId,
        title,
        message: msg,
        type
      });
    }

    revalidatePath("/dashboard/recruiter");
    revalidatePath("/dashboard/student");
    return { success: true };
  } catch (err) {
    return { error: "Failed to update application status." };
  }
}

export async function scheduleInterviewAction(data) {
  const session = await auth();
  if (!session || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized." };
  }

  const { applicationId, studentId, dateTime, duration, format, link } = data;

  try {
    const recruiter = await db.recruiters.list();
    const currentRecruiter = recruiter.find(r => r.userId === session.user.id);
    if (!currentRecruiter) return { error: "Recruiter profile not found." };

    const interview = await db.interviews.schedule({
      applicationId,
      studentId,
      recruiterId: currentRecruiter.id,
      dateTime: new Date(dateTime),
      duration: parseInt(duration),
      format,
      link
    });

    // Notify Student
    const studentProfile = await db.students.list();
    const targetStudent = studentProfile.find(s => s.id === studentId);
    if (targetStudent) {
      await db.notifications.create({
        userId: targetStudent.userId,
        title: "Interview Scheduled 📅",
        message: `An interview has been scheduled for you with Stripe. Format: ${format}. Time: ${new Date(dateTime).toLocaleString()}`,
        type: "WARNING"
      });
    }

    revalidatePath("/dashboard/recruiter");
    revalidatePath("/dashboard/student");
    return { success: true, interview };
  } catch (err) {
    return { error: err.message || "Failed to schedule interview." };
  }
}

export async function uploadOfferLetterAction(data) {
  const session = await auth();
  if (!session || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized." };
  }

  const { applicationId, studentId, offerLetterUrl, packageVal } = data;

  try {
    const offer = await db.offerLetters.create({
      applicationId,
      studentId,
      offerLetterUrl: offerLetterUrl || "https://res.cloudinary.com/demo/image/upload/sample_offer.pdf",
      package: packageVal
    });

    // Update application status to OFFERED
    await db.applications.updateStatus(applicationId, "OFFERED");

    // Get student details
    const studentProfile = await db.students.list();
    const targetStudent = studentProfile.find(s => s.id === studentId);
    if (targetStudent) {
      await db.notifications.create({
        userId: targetStudent.userId,
        title: "Offer Letter Uploaded 🥂",
        message: `Your official offer letter for ${packageVal} has been uploaded. Please review and accept/decline.`,
        type: "SUCCESS"
      });
    }

    revalidatePath("/dashboard/recruiter");
    revalidatePath("/dashboard/student");
    return { success: true, offer };
  } catch (err) {
    return { error: err.message || "Failed to upload offer letter." };
  }
}

export async function bookmarkJobAction(jobId, isBookmarked) {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    return { error: "Unauthorized." };
  }

  try {
    const student = await db.students.getByUserId(session.user.id);
    if (!student) return { error: "Student profile not found." };

    if (isBookmarked) {
      await db.bookmarks.create({ studentId: student.id, jobId });
    } else {
      await db.bookmarks.delete({ studentId: student.id, jobId });
    }

    revalidatePath("/dashboard/student");
    return { success: true };
  } catch (err) {
    return { error: "Failed to update bookmark status." };
  }
}

export async function updateOfferStatusAction(offerId, status) {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    return { error: "Unauthorized." };
  }

  try {
    const offer = await db.offerLetters.updateStatus(offerId, status);
    
    // Notify Recruiter
    const recruiters = await db.recruiters.list();
    const apps = await db.applications.listAll();
    const currentApp = apps.find(a => a.id === offer.applicationId);
    
    if (currentApp) {
      const companyRecruiters = recruiters.filter(r => r.companyId === currentApp.job.companyId);
      for (const rec of companyRecruiters) {
        await db.notifications.create({
          userId: rec.userId,
          title: "Offer Status Updated",
          message: `${session.user.name} has ${status.toLowerCase()}ed the job offer for ${currentApp.job.title}.`,
          type: status === "ACCEPTED" ? "SUCCESS" : "DANGER"
        });
      }
    }

    revalidatePath("/dashboard/student/offers");
    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/recruiter");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to update offer letter status." };
  }
}
