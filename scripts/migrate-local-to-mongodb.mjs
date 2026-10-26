import dns from "dns";
import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ No MONGODB_URI found in environment.");
  process.exit(1);
}

const mockDbPath = path.join(process.cwd(), ".mockdb.json");
if (!fs.existsSync(mockDbPath)) {
  console.error("❌ No .mockdb.json file found to migrate.");
  process.exit(1);
}

const localData = JSON.parse(fs.readFileSync(mockDbPath, "utf-8"));

async function migrate() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  
  try {
    await client.connect();
    console.log(" Connected to MongoDB Atlas!");
    const db = client.db("vit_placement");

    const collections = Object.keys(localData);
    console.log(`Migrating ${collections.length} collections into 'vit_placement'...`);

    for (const key of collections) {
      const records = localData[key];
      if (Array.isArray(records) && records.length > 0) {
        const col = db.collection(key);
        // Clean existing to avoid duplicates or upsert
        for (const item of records) {
          const filter = item.id ? { id: item.id } : (item._id ? { _id: item._id } : { email: item.email });
          await col.replaceOne(filter, item, { upsert: true });
        }
        console.log(`  Synced ${records.length.toString().padStart(3)} records -> collection: "${key}"`);
      }
    }

    console.log("\n MIGRATION COMPLETE! All local data is now in MongoDB Atlas!");
    await client.close();
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    await client.close().catch(() => {});
  }
}

migrate();
