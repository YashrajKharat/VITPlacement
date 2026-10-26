import dns from "dns";
import fs from "fs";
import { MongoClient } from "mongodb";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;
if (!uri) {
  console.error("Error: MONGODB_URI environment variable is required to seed the database.");
  process.exit(1);
}

const initialData = {
  users: [
    { id: "faculty-1", email: "faculty@college.edu", passwordHash: "$2a$10$abcdefghijklmnopqrstuv", role: "FACULTY_MENTOR", name: "Faculty Mentor" },
    { id: "coordinator-1", email: "coordinator@college.edu", passwordHash: "$2a$10$abcdefghijklmnopqrstuv", role: "INTERNSHIP_COORDINATOR", name: "Internship Coordinator" },
    { id: "tpo-1", email: "tpo@college.edu", passwordHash: "$2a$10$abcdefghijklmnopqrstuv", role: "TPO", name: "Training & Placement Officer" },
    { id: "admin-1", email: "admin@portal.com", passwordHash: "$2a$10$abcdefghijklmnopqrstuv", role: "ADMIN", name: "System Admin" },
    { id: "recruiter-1", email: "recruiter@company.com", passwordHash: "$2a$10$abcdefghijklmnopqrstuv", role: "RECRUITER", name: "Google HR / Campus Talent Partner", companyId: "company-google" },
    { id: "recruiter-2", email: "hr@tcs.com", passwordHash: "$2a$10$abcdefghijklmnopqrstuv", role: "RECRUITER", name: "TCS Lead Talent Acquisition", companyId: "company-tcs" },
    { id: "student-1", email: "student@college.edu", passwordHash: "$2a$10$abcdefghijklmnopqrstuv", role: "STUDENT", name: "Aarav Sharma (CMPN Candidate)" }
  ],
  students: [
    {
      id: "student-profile-student-1",
      userId: "student-1",
      name: "Aarav Sharma",
      rollNumber: "22102A0045",
      department: "CMPN",
      year: "Third Year",
      division: "A",
      cgpa: 8.85,
      skills: ["React", "Node.js", "Python", "Data Structures", "TypeScript"],
      isPlaced: false,
      createdAt: new Date("2026-01-01")
    }
  ],
  companies: [
    { id: "company-google", name: "Google India", website: "https://careers.google.com", industry: "Cloud & AI Engineering", location: "Mumbai / Bengaluru / Hyderabad", description: "Global technology pioneer.", isVerified: true, logo: "🔍" },
    { id: "company-tcs", name: "Tata Consultancy Services (TCS)", website: "https://www.tcs.com", industry: "IT Services & Consulting", location: "Mumbai / Pune", description: "Premier IT services enterprise.", isVerified: true, logo: "🏢" }
  ],
  recruiters: [
    { id: "recruiter-profile-recruiter-1", userId: "recruiter-1", name: "Google HR / Campus Talent Partner", email: "recruiter@company.com", designation: "Lead University Recruiter", companyId: "company-google", isVerified: true, createdAt: new Date() },
    { id: "recruiter-profile-recruiter-2", userId: "recruiter-2", name: "TCS Lead Talent Acquisition", email: "hr@tcs.com", designation: "Senior Campus Hiring Manager", companyId: "company-tcs", isVerified: true, createdAt: new Date() }
  ],
  jobs: [
    { id: "job-1", title: "Software Development Engineer (SDE-1)", companyId: "company-google", companyName: "Google India", location: "Bengaluru / Mumbai (Hybrid)", type: "FULL_TIME", salaryRange: "24 - 32 LPA", description: "Core Engineering team.", requirements: ["C++", "DSA", "7.5+ CGPA"], status: "ACTIVE", applicantsCount: 42, createdAt: new Date() },
    { id: "job-2", title: "Systems Engineer (Digital & Prime)", companyId: "company-tcs", companyName: "Tata Consultancy Services (TCS)", location: "Mumbai / Pune", type: "FULL_TIME", salaryRange: "7.5 - 11.5 LPA", description: "Enterprise cloud fullstack solutions.", requirements: ["React", "Node.js", "60%+"], status: "ACTIVE", applicantsCount: 128, createdAt: new Date() }
  ],
  internshipRequirements: [
    {
      id: "req-sem6-2026",
      academicYear: "2025-2026",
      semester: "SEM_6",
      department: "CMPN",
      year: "Third Year",
      divisions: ["A", "B", "C"],
      internshipType: "Industry Internship",
      startDate: new Date("2026-01-05"),
      endDate: new Date("2026-10-30"),
      minDurationWeeks: 4,
      maxDurationWeeks: 8,
      requiredCredits: 4,
      requiredDocuments: ["CERTIFICATE", "REPORT"],
      marksConfig: { certificate: 20, company: 30, report: 20, technical: 15, viva: 10, attendance: 5, total: 100 },
      gradeBoundaries: { "A+": [90, 100], "A": [80, 89.9], "B": [70, 79.9], "C": [60, 69.9], "D": [50, 59.9], "F": [0, 49.9] },
      status: "OPEN",
      createdAt: new Date("2026-01-01")
    },
    {
      id: "req-sem8-2026",
      academicYear: "2025-2026",
      semester: "SEM_8",
      department: "CMPN",
      year: "Fourth Year",
      divisions: ["A", "B"],
      internshipType: "Industry Internship",
      startDate: new Date("2026-01-10"),
      endDate: new Date("2026-11-15"),
      minDurationWeeks: 8,
      maxDurationWeeks: 16,
      requiredCredits: 8,
      requiredDocuments: ["CERTIFICATE", "REPORT", "OFFER_LETTER"],
      marksConfig: { certificate: 20, company: 30, report: 20, technical: 15, viva: 10, attendance: 5, total: 100 },
      gradeBoundaries: { "A+": [90, 100], "A": [80, 89.9], "B": [70, 79.9], "C": [60, 69.9], "D": [50, 59.9], "F": [0, 49.9] },
      status: "OPEN",
      createdAt: new Date("2026-01-01")
    }
  ],
  internshipSubmissions: [],
  certificateVerifications: [],
  companyMentorEvaluations: [],
  facultyEvaluations: []
};

async function seedMongo() {
  console.log("Connecting to MongoDB Atlas Cluster...");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("vit_placement");

  for (const [colName, docs] of Object.entries({
    users: initialData.users,
    students: initialData.students,
    recruiters: initialData.recruiters,
    companies: initialData.companies,
    jobs: initialData.jobs,
    internship_requirements: initialData.internshipRequirements,
    internship_submissions: initialData.internshipSubmissions,
    certificate_verifications: initialData.certificateVerifications,
    company_mentor_evaluations: initialData.companyMentorEvaluations,
    faculty_evaluations: initialData.facultyEvaluations
  })) {
    for (const doc of docs) {
      await db.collection(colName).updateOne(
        { id: doc.id },
        { $set: doc },
        { upsert: true }
      );
    }
    const count = await db.collection(colName).countDocuments();
    console.log(`✓ Collection ${colName}: ${count} documents`);
  }

  console.log("\n🎉 MongoDB Atlas vit_placement database successfully populated!");
  await client.close();
}

seedMongo().catch(err => {
  console.error("Seed error:", err);
});
