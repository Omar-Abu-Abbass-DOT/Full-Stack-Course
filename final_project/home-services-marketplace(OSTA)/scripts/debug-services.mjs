import { config } from "dotenv";
config({ path: ".env.local" });
import mongoose from "mongoose";

await mongoose.connect(process.env.MONGODB_URI, { dbName: "osta" });

const { db } = mongoose.connection;
const collections = await db.listCollections().toArray();
console.log("Collections:", collections.map(c => c.name));

for (const col of ["services", "Service"]) {
  try {
    const count = await db.collection(col).countDocuments();
    const sample = await db.collection(col).find({}).limit(3).toArray();
    console.log(`Collection "${col}": count=${count}`);
    sample.forEach(s => console.log("  -", s.title, "$" + s.price, "in", s.category, "by", String(s.provider)));
  } catch (e) {
    console.log(`Collection "${col}": ERROR ${e.message}`);
  }
}

console.log("DB name in use:", db.databaseName);
console.log("URI host:", new URL(process.env.MONGODB_URI.replace('mongodb://','http://').split(',')[0]).host);

await mongoose.disconnect();
