/* Seed script: creates an admin user, default categories, and demo services.
 * Usage:
 *   node scripts/seed.mjs
 *   node scripts/seed.mjs --email admin@example.com --password admin123 --name "Admin"
 */

import { config } from "dotenv";
// Next.js stores secrets in .env.local — load it explicitly
config({ path: ".env.local" });
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .reduce((acc, cur, i, arr) => {
      if (cur.startsWith("--")) acc.push([cur.slice(2), arr[i + 1]]);
      return acc;
    }, [])
);

const EMAIL    = args.email    || "admin@osta.com";
const PASSWORD = args.password || "admin123";
const NAME     = args.name     || "Admin";

// ──────────────────────────────────────────
// Schemas (inline — no circular deps in seed)
// ──────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name:     String,
    email:    { type: String, unique: true, lowercase: true, trim: true },
    password: String,
    role:     { type: String, enum: ["customer", "provider", "admin"], default: "customer" },
    phone:    String,
    avatar:   String,
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model("User", userSchema);

const categorySchema = new mongoose.Schema(
  { name: { type: String, unique: true }, description: String, image: String },
  { timestamps: true }
);
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

const serviceSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    category:    { type: String, required: true },
    price:       { type: Number, required: true },
    location:    { type: String, required: true },
    coordinates: { lat: Number, lng: Number },
    image:       { type: String, default: "" },
    provider:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);
const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

// ──────────────────────────────────────────
// Data
// ──────────────────────────────────────────
const DEFAULT_CATEGORIES = [
  { name: "Cleaning",    description: "House and office cleaning services" },
  { name: "Plumbing",    description: "Pipe repair, fixtures, leaks" },
  { name: "Electrical",  description: "Wiring, outlets, lighting" },
  { name: "Painting",    description: "Interior and exterior painting" },
  { name: "Gardening",   description: "Lawn care and landscaping" },
  { name: "Moving",      description: "Local moving and packing" },
  { name: "AC Repair",   description: "Air conditioning installation and repair" },
  { name: "Carpentry",   description: "Furniture and woodwork" },
];

const DEMO_PROVIDERS = [
  { name: "Sara Al-Ahmad",  email: "sara.provider@osta.com",  password: "provider123", role: "provider" },
  { name: "Khalid Mansour", email: "khalid.provider@osta.com", password: "provider123", role: "provider" },
];

function getDemoServices(providerIds) {
  const [s1, s2] = providerIds;
  return [
    {
      title:       "Deep House Cleaning",
      description: "Professional deep cleaning for your entire home. We handle kitchens, bathrooms, living areas, and bedrooms with eco-friendly products.",
      category:    "Cleaning",
      price:       45,
      location:    "Amman",
      coordinates: { lat: 31.9539, lng: 35.9106 },
      provider:    s1,
    },
    {
      title:       "Plumbing Repair & Maintenance",
      description: "Fix leaky pipes, install fixtures, unclog drains, and handle all plumbing emergencies quickly and professionally.",
      category:    "Plumbing",
      price:       30,
      location:    "Zarqa",
      coordinates: { lat: 32.0630, lng: 36.0880 },
      provider:    s2,
    },
    {
      title:       "Electrical Wiring & Outlets",
      description: "Safe and certified electrical work including wiring, outlet installation, lighting, and circuit breaker repair.",
      category:    "Electrical",
      price:       40,
      location:    "Irbid",
      coordinates: { lat: 32.5556, lng: 35.8500 },
      provider:    s1,
    },
    {
      title:       "Interior & Exterior Painting",
      description: "High-quality painting services for homes and offices. We use premium paints with clean, precise finishing.",
      category:    "Painting",
      price:       55,
      location:    "Amman",
      coordinates: { lat: 31.9539, lng: 35.9106 },
      provider:    s2,
    },
    {
      title:       "Garden & Lawn Care",
      description: "Complete garden maintenance: mowing, trimming, planting, irrigation setup, and seasonal clean-up.",
      category:    "Gardening",
      price:       25,
      location:    "Aqaba",
      coordinates: { lat: 29.5321, lng: 35.0063 },
      provider:    s1,
    },
    {
      title:       "AC Installation & Repair",
      description: "Install, service, and repair all air conditioning brands. We also do routine maintenance and refrigerant refills.",
      category:    "AC Repair",
      price:       60,
      location:    "Amman",
      coordinates: { lat: 31.9539, lng: 35.9106 },
      provider:    s2,
    },
    {
      title:       "Furniture Assembly & Carpentry",
      description: "Custom woodwork, furniture assembly, cabinet installation, and repairs. IKEA assembly welcome!",
      category:    "Carpentry",
      price:       35,
      location:    "Zarqa",
      coordinates: { lat: 32.0630, lng: 36.0880 },
      provider:    s1,
    },
    {
      title:       "Local Moving & Packing",
      description: "Reliable and careful moving service. We pack, load, transport, and unpack your belongings safely.",
      category:    "Moving",
      price:       80,
      location:    "Irbid",
      coordinates: { lat: 32.5556, lng: 35.8500 },
      provider:    s2,
    },
  ];
}

// ──────────────────────────────────────────
// Main
// ──────────────────────────────────────────
async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("ERROR: MONGODB_URI is not set in .env.local");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, { dbName: "osta" });
  console.log("✓ Connected to MongoDB");

  // 1. Admin user
  const existingAdmin = await User.findOne({ email: EMAIL.toLowerCase() });
  if (existingAdmin) {
    if (existingAdmin.role !== "admin") {
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log(`✓ Promoted ${EMAIL} to admin`);
    } else {
      console.log(`✓ Admin ${EMAIL} already exists`);
    }
  } else {
    const hashed = await bcrypt.hash(PASSWORD, 10);
    await User.create({ name: NAME, email: EMAIL.toLowerCase(), password: hashed, role: "admin" });
    console.log(`✓ Created admin: ${EMAIL} / ${PASSWORD}`);
  }

  // 2. Categories
  for (const cat of DEFAULT_CATEGORIES) {
    await Category.updateOne({ name: cat.name }, { $setOnInsert: cat }, { upsert: true });
  }
  console.log(`✓ Ensured ${DEFAULT_CATEGORIES.length} default categories`);

  // 3. Demo provider accounts
  const providerIds = [];
  for (const p of DEMO_PROVIDERS) {
    const existing = await User.findOne({ email: p.email });
    if (existing) {
      providerIds.push(existing._id);
      console.log(`✓ Provider ${p.email} already exists`);
    } else {
      const hashed = await bcrypt.hash(p.password, 10);
      const created = await User.create({ ...p, password: hashed });
      providerIds.push(created._id);
      console.log(`✓ Created provider: ${p.email} / ${p.password}`);
    }
  }

  // 4. Demo services (only if none exist yet)
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    const demos = getDemoServices(providerIds);
    await Service.insertMany(demos);
    console.log(`✓ Inserted ${demos.length} demo services`);
  } else {
    console.log(`✓ Services already exist (${serviceCount} found) — skipping demo insert`);
  }

  await mongoose.disconnect();
  console.log("✓ Done");
  console.log("\n─────────────────────────────────────────");
  console.log("  Admin login:    admin@osta.com / admin123");
  console.log("  Provider 1:     sara.provider@osta.com / provider123");
  console.log("  Provider 2:     khalid.provider@osta.com / provider123");
  console.log("─────────────────────────────────────────\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
