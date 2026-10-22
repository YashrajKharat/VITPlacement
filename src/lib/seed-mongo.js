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
    { id: "admin-1", email: "admin@portal.com", passwordHash: "$2a$10$abcdefghijklmnopqrstuv", role: "ADMIN", name: "System Admin" }
  ],
  students: [],
  companies: [],
  recruiters: [],
  jobs: [],
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
