"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// 1. Get List of Interview Experiences
export async function getInterviewExperiencesAction(filters = {}) {
  try {
    const experiences = await db.interviewExperiences.list(filters);
    return { success: true, experiences };
  } catch (err) {
    console.error("Failed to fetch interview experiences:", err);
    return { error: "Failed to load placement experiences." };
  }
}

// 2. Get Single Experience by ID
export async function getInterviewExperienceByIdAction(id) {
  try {
    const experience = await db.interviewExperiences.getById(id);
    if (!experience) return { error: "Experience record not found." };
    return { success: true, experience };
  } catch (err) {
    return { error: err.message || "Failed to load experience." };
  }
}

// 3. Create New Interview Experience (Shared by Student / Alumni)
export async function createInterviewExperienceAction(formData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Please log in to share your placement drive experience." };
  }

  const {
    company,
    role,
    package: pkgValue,
    packageTier,
    verdict,
    difficulty,
    cgpaRequired,
    summary,
    rounds,
    tips
  } = formData;

  if (!company || !role || !summary) {
    return { error: "Please fill in all required fields (Company, Role, Summary)." };
  }

  try {
    const studentName = session.user.name ? `${session.user.name} ('26)` : "Student Alumni";
    const student = await db.students.getByUserId(session.user.id);
    const department = student?.department || "CMPN";

    const newExp = await db.interviewExperiences.create({
      studentName,
      department,
      company,
      role,
      package: pkgValue || "12.0 LPA",
      packageTier: packageTier || (parseFloat(pkgValue) >= 20 ? "SUPER_DREAM" : parseFloat(pkgValue) >= 10 ? "DREAM" : "REGULAR"),
      verdict: verdict || "SELECTED",
      difficulty: difficulty || "MEDIUM",
      cgpaRequired: cgpaRequired || "7.5+",
      summary,
      rounds: Array.isArray(rounds) && rounds.length > 0 ? rounds : [
        { roundNumber: 1, title: "Online Assessment", duration: "60 Mins", details: "Coding & Aptitude test." },
        { roundNumber: 2, title: "Technical Interview", duration: "45 Mins", details: "DSA and Core CS questions." },
        { roundNumber: 3, title: "HR & Managerial Round", duration: "30 Mins", details: "Behavioral and cultural fit questions." }
      ],
      tips: Array.isArray(tips) && tips.length > 0 ? tips : [
        "Revise fundamental DSA patterns.",
        "Maintain clear communication during coding rounds."
      ]
    });

    await db.activityLogs.create({
      userId: session.user.id,
      action: "Published Interview Experience",
      details: `Shared placement drive interview experience for ${company}.`
    });

    return { success: true, experience: newExp };
  } catch (err) {
    console.error("Failed to create experience:", err);
    return { error: "Failed to publish interview experience." };
  }
}

// 4. Upvote Interview Experience
export async function upvoteInterviewExperienceAction(experienceId) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in to upvote." };
  }

  try {
    const updated = await db.interviewExperiences.upvote(experienceId, session.user.id);
    return { success: true, upvotes: updated?.upvotes || 1 };
  } catch (err) {
    return { error: "Failed to register upvote." };
  }
}
