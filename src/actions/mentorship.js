"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// 1. List Mentors
export async function getMentorsAction(filters = {}) {
  try {
    const mentors = await db.mentors.list(filters);
    return { success: true, mentors };
  } catch (err) {
    return { error: "Failed to load mentors." };
  }
}

// 2. Get Single Mentor Details
export async function getMentorByIdAction(id) {
  try {
    const mentor = await db.mentors.getById(id);
    if (!mentor) return { error: "Mentor not found" };
    return { success: true, mentor };
  } catch (err) {
    return { error: err.message || "Failed to load mentor." };
  }
}

// 3. Book 1-on-1 Session with a Mentor
export async function bookMentorSessionAction(mentorId, bookingData) {
  try {
    const session = await auth();
    const studentId = session?.user?.id || "student-1788620582804";
    const studentName = session?.user?.name || "Yashraj Nana kharat";
    const studentEmail = session?.user?.email || "yashraj200@gmail.com";

    const mentor = await db.mentors.getById(mentorId);
    if (!mentor) return { error: "Mentor not found" };

    const booking = await db.mentorshipBookings.create({
      mentorId,
      mentorName: mentor.name,
      mentorCompany: mentor.company,
      mentorAvatar: mentor.avatar,
      studentId,
      studentName,
      studentEmail,
      serviceName: bookingData.serviceName || "1:1 Career & Interview Guidance",
      duration: bookingData.duration || "45 Mins",
      date: bookingData.date || new Date().toISOString().split("T")[0],
      timeSlot: bookingData.timeSlot || "05:00 PM - 05:45 PM",
      notes: bookingData.notes || "Preparing for campus placement technical interviews."
    });

    return { success: true, booking };
  } catch (err) {
    return { error: err.message || "Session booking failed." };
  }
}

// 4. Get Student's Booked Sessions
export async function getStudentBookingsAction() {
  try {
    const session = await auth();
    const studentId = session?.user?.id || "student-1788620582804";
    const bookings = await db.mentorshipBookings.listByStudent(studentId);
    return { success: true, bookings };
  } catch (err) {
    return { error: "Failed to load mentorship bookings." };
  }
}
