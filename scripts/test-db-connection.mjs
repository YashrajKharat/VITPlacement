import dns from "dns";
import { MongoClient } from "mongodb";

// Set Google DNS to ensure SRV records can resolve properly on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ No MONGODB_URI found. Please specify MONGODB_URI in your .env file.");
  process.exit(1);
}

console.log("--------------------------------------------------");
console.log("Testing MongoDB Atlas Connection...");
console.log("URI Target:", uri.replace(/:([^@]+)@/, ":****@"));
console.log("--------------------------------------------------");

async function run() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  });

  try {
    await client.connect();
    console.log("✅ SUCCESS! Connected to MongoDB Atlas!");
    const db = client.db("vit_placement");
    const ping = await db.command({ ping: 1 });
    console.log("✅ Ping OK:", ping);
    
    const collections = await db.listCollections().toArray();
    console.log(`✅ Collections in 'vit_placement' (${collections.length}):`, collections.map(c => c.name));
    
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:");
    console.error("   Error Name:", err.name);
    console.error("   Message   :", err.message);
    if (err.message.includes("SSL alert number 80") || err.message.includes("tlsv1 alert internal error")) {
      console.log("\n💡 ROOT CAUSE IDENTIFIED: SSL Alert 80 / IP Not Whitelisted in Atlas");
      console.log("MongoDB Atlas rejected the TLS connection because your IP is not in 'Network Access'.");
      console.log("👉 Go to https://cloud.mongodb.com -> Network Access -> Add IP -> 0.0.0.0/0 (Allow Anywhere)");
    } else if (err.message.includes("querySrv ECONNREFUSED")) {
      console.log("\n💡 ROOT CAUSE IDENTIFIED: Local DNS Refused SRV Query");
      console.log("Your local router/ISP DNS refused SRV resolution. Using 8.8.8.8 or Direct ReplicaSet solves this.");
    }
    await client.close().catch(() => {});
    process.exit(1);
  }
}

run();
