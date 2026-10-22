"use server";

import { signIn, signOut, hashPassword } from "@/lib/auth";
import { db, toPlain } from "@/lib/db";
import { redirect } from "next/navigation";

export async function loginAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  try {
    const result = await signIn(email, password);
    if (result.success) {
      // Redirect to correct dashboard based on role
      const role = result.role;
      let target = "/dashboard/student";
      if (role === "FACULTY_MENTOR") target = "/dashboard/faculty/internships";
      if (role === "INTERNSHIP_COORDINATOR") target = "/dashboard/coordinator/internships";
      if (role === "RECRUITER") target = "/dashboard/recruiter";
      if (role === "TPO") target = "/dashboard/tpo";
      if (role === "ADMIN") target = "/dashboard/admin";
      
      return { success: true, redirectUrl: target };
    }
  } catch (err) {
    return { error: err.message || "Invalid email or password." };
  }
}

export async function registerAction(data) {
  const { email, password, name, role, companyId, newCompanyName } = data;

  if (!email || !password || !name || !role) {
    return { error: "Missing required registration details." };
  }

  try {
    // Check if email already exists
    const existing = await db.users.findByEmail(email);
    if (existing) {
      return { error: "An account with this email already exists." };
    }

    let finalCompanyId = companyId;
    if (role === "RECRUITER") {
      if (companyId === "new-company" && newCompanyName) {
        // Create new company dynamically!
        const newComp = await db.companies.create({
          name: newCompanyName,
          website: `https://${newCompanyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
          industry: "Software Engineering",
          location: "Mumbai",
        });
        finalCompanyId = newComp.id;
      } else if (!companyId || companyId === "") {
        return { error: "Please select or enter a corporate partner company." };
      }
    }

    const passwordHash = await hashPassword(password);
    await db.users.create({
      email,
      passwordHash,
      role,
      name,
      companyId: finalCompanyId
    });

    // Automatically sign in the user after registering
    const result = await signIn(email, password);
    if (result.success) {
      const role = result.role;
      let target = "/dashboard/student";
      if (role === "FACULTY_MENTOR") target = "/dashboard/faculty/internships";
      if (role === "INTERNSHIP_COORDINATOR") target = "/dashboard/coordinator/internships";
      if (role === "RECRUITER") target = "/dashboard/recruiter";
      if (role === "TPO") target = "/dashboard/tpo";
      if (role === "ADMIN") target = "/dashboard/admin";
      return { success: true, redirectUrl: target };
    }
  } catch (err) {
    return { error: err.message || "Registration failed. Please try again." };
  }
}

export async function getCompaniesListAction() {
  try {
    const list = await db.companies.list();
    return { success: true, companies: list || [] };
  } catch (err) {
    return { error: "Failed to load corporate partners" };
  }
}

export async function logoutAction() {
  await signOut();
  redirect("/login");
}

export async function forgotPasswordAction(email) {
  if (!email) return { error: "Email is required." };
  // Mock forgot password - in production, send email using Resend
  return { success: true, message: "If an account exists, a reset link has been sent to your email." };
}

export async function resetPasswordAction(token, newPassword) {
  if (!token || !newPassword) return { error: "Invalid request data." };
  // Mock reset password success
  return { success: true, message: "Your password has been successfully reset. Please login." };
}

export async function verifyEmailAction(token) {
  if (!token) return { error: "Invalid verification token." };
  return { success: true, message: "Your email has been verified. Welcome aboard!" };
}
