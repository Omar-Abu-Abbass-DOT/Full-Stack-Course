import mongoose from "mongoose";

// Pre-register every model so .populate(<ref>) works regardless of which API
// route is hit first in dev (otherwise Mongoose throws MissingSchemaError when
// a referenced model hasn't been imported yet).
import "@/models/User";
import "@/models/Category";
import "@/models/Service";
import "@/models/Booking";
import "@/models/Review";
import "@/models/Notification";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.__mongooseConn;
if (!cached) {
  cached = global.__mongooseConn = { conn: null, promise: null };
}

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { dbName: "osta", bufferCommands: false })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
