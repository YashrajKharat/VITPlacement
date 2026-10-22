import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global;
const COOLDOWN_MS = 45000;

const createPrismaClient = () => {
  if (
    typeof process !== "undefined" &&
    process.env.DATABASE_URL &&
    process.env.DATABASE_URL.startsWith("postgresql://") &&
    !process.env.DATABASE_URL.includes("localhost:51213")
  ) {
    try {
      const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 2000,
      });
      const adapter = new PrismaPg(pool);
      return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["warn"] : ["error"],
      });
    } catch (err) {
      return null;
    }
  }
  return null;
};

export const prisma = globalForPrisma.prisma || createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function isPrismaHealthy() {
  if (!prisma) return false;
  const now = Date.now();
  if (globalForPrisma._prismaFailureTime && (now - globalForPrisma._prismaFailureTime < COOLDOWN_MS)) {
    return false;
  }

  try {
    // Run lightweight probe query
    await prisma.$executeRawUnsafe("SELECT 1");
    globalForPrisma._prismaFailureTime = 0;
    return true;
  } catch (err) {
    globalForPrisma._prismaFailureTime = Date.now();
    if (!globalForPrisma._prismaWarned) {
      console.warn(" PostgreSQL/Supabase database unreachable. Using local persistent database.");
      globalForPrisma._prismaWarned = true;
    }
    return false;
  }
}
