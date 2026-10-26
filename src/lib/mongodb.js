import { MongoClient } from "mongodb";
import dns from "dns";

// Configure standard DNS resolvers to prevent SRV lookup failures on restrictive local networks
try {
  if (typeof dns.setServers === "function") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  }
} catch (e) {
  // Ignore in environments where setServers is restricted
}

function getMongoUri() {
  if (process.env.MONGODB_URI && process.env.MONGODB_URI.trim() !== "") {
    return process.env.MONGODB_URI.trim();
  }
  if (process.env.DATABASE_URL && (process.env.DATABASE_URL.startsWith("mongodb://") || process.env.DATABASE_URL.startsWith("mongodb+srv://"))) {
    return process.env.DATABASE_URL.trim();
  }
  return null;
}

const globalForMongo = global;
const COOLDOWN_MS = 45000; // 45 seconds cooldown between reconnection attempts if offline

export async function getMongoClient() {
  const uri = getMongoUri();
  if (!uri) return null;

  // If already successfully connected, return the active client
  if (globalForMongo._mongoClient) {
    return globalForMongo._mongoClient;
  }

  const COOLDOWN_MS = 10000; // 10 seconds cooldown between reconnection attempts if offline

  // Circuit breaker: If previous connection failed recently, avoid blocking queries
  const now = Date.now();
  if (globalForMongo._mongoFailureTime && (now - globalForMongo._mongoFailureTime < COOLDOWN_MS)) {
    return null;
  }

  if (!globalForMongo._mongoClientPromise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      socketTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    globalForMongo._mongoClientPromise = client.connect()
      .then((connectedClient) => {
        globalForMongo._mongoClient = connectedClient;
        globalForMongo._mongoFailureTime = 0;
        globalForMongo._mongoWarned = false;
        console.log(" Connected to MongoDB Atlas successfully.");
        return connectedClient;
      })
      .catch((err) => {
        globalForMongo._mongoFailureTime = Date.now();
        globalForMongo._mongoClientPromise = null;
        globalForMongo._mongoClient = null;

        if (!globalForMongo._mongoWarned) {
          console.warn(" MongoDB Atlas notice:", err?.message || "Cluster unreachable. Verify IP whitelist in MongoDB Atlas.");
          globalForMongo._mongoWarned = true;
        }
        return null;
      });
  }

  return await globalForMongo._mongoClientPromise;
}

export async function getMongoDb(dbName = "vit_placement") {
  try {
    const client = await getMongoClient();
    if (!client) return null;
    return client.db(dbName);
  } catch (err) {
    return null;
  }
}

// Auto-seed fresh MongoDB database with all default accounts, requirements & data
export async function seedMongoDbIfEmpty(db, initialData) {
  if (!db || !initialData) return;

  try {
    const userCount = await db.collection("users").countDocuments();
    if (userCount === 0) {
      console.log(" Fresh MongoDB database detected. Seeding initial accounts and requirements...");

      if (initialData.users?.length) {
        await db.collection("users").insertMany(initialData.users);
      }
      if (initialData.students?.length) {
        await db.collection("students").insertMany(initialData.students);
      }
      if (initialData.recruiters?.length) {
        await db.collection("recruiters").insertMany(initialData.recruiters);
      }
      if (initialData.companies?.length) {
        await db.collection("companies").insertMany(initialData.companies);
      }
      if (initialData.jobs?.length) {
        await db.collection("jobs").insertMany(initialData.jobs);
      }
      if (initialData.internshipRequirements?.length) {
        await db.collection("internship_requirements").insertMany(initialData.internshipRequirements);
      }
      if (initialData.internshipSubmissions?.length) {
        await db.collection("internship_submissions").insertMany(initialData.internshipSubmissions);
      }
      if (initialData.certificateVerifications?.length) {
        await db.collection("certificate_verifications").insertMany(initialData.certificateVerifications);
      }
      if (initialData.reportAnalyses?.length) {
        await db.collection("report_analyses").insertMany(initialData.reportAnalyses);
      }
      if (initialData.companyMentorEvaluations?.length) {
        await db.collection("company_mentor_evaluations").insertMany(initialData.companyMentorEvaluations);
      }
      if (initialData.facultyEvaluations?.length) {
        await db.collection("faculty_evaluations").insertMany(initialData.facultyEvaluations);
      }
      if (initialData.internshipAuditLogs?.length) {
        await db.collection("internship_audit_logs").insertMany(initialData.internshipAuditLogs);
      }

      console.log(" MongoDB seeding completed successfully!");
    }
  } catch (err) {
    console.warn("MongoDB auto-seed note:", err?.message || err);
  }
}
