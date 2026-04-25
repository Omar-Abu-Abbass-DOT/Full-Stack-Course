require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Category = require("./models/category");
const Product = require("./models/Product");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    console.log("🗑  Cleared existing data");

    // ── Admin user ──────────────────────────────────────────────
    const admin = await User.create({
      name: "Admin",
      email: "admin@shopzone.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    });

    // Optional regular user for testing
    await User.create({
      name: "Omar Abu Abbass",
      email: "omar@shopzone.com",
      password: await bcrypt.hash("user123", 10),
      role: "user",
    });

    console.log("👤 Admin  → admin@shopzone.com  / admin123");
    console.log("👤 User   → omar@shopzone.com   / user123");

    // ── Categories ──────────────────────────────────────────────
    const [electronics, clothing, books, home] = await Category.insertMany([
      {
        title: "Electronics",
        description: "Latest gadgets, devices, and tech accessories",
        imageUrl: "https://picsum.photos/seed/electronics/400/300",
        createdBy: admin._id,
      },
      {
        title: "Clothing",
        description: "Fashion and apparel for all occasions",
        imageUrl: "https://picsum.photos/seed/fashion/400/300",
        createdBy: admin._id,
      },
      {
        title: "Books",
        description: "Knowledge, stories, and education",
        imageUrl: "https://picsum.photos/seed/library/400/300",
        createdBy: admin._id,
      },
      {
        title: "Home & Garden",
        description: "Everything to make your space beautiful",
        imageUrl: "https://picsum.photos/seed/home/400/300",
        createdBy: admin._id,
      },
    ]);
    console.log("📂 Created 4 categories");

    // ── Products ────────────────────────────────────────────────
    await Product.insertMany([
      // Electronics (6)
      {
        name: "iPhone 15 Pro",
        description: "The latest iPhone with titanium design, A17 Pro chip, and a groundbreaking 48MP camera system. Features USB-C, Action Button, and all-day battery life.",
        price: 999.99,
        categoryId: electronics._id,
        stock: 25,
        imageUrl: "https://picsum.photos/seed/iphone15/400/300",
        createdBy: admin._id,
      },
      {
        name: "Samsung 55\" 4K Smart TV",
        description: "Crystal-clear 4K QLED display with built-in Alexa, HDR10+, and a super slim bezel design. Includes 4 HDMI ports and Wi-Fi 6.",
        price: 649.99,
        categoryId: electronics._id,
        stock: 10,
        imageUrl: "https://picsum.photos/seed/samsung-tv/400/300",
        createdBy: admin._id,
      },
      {
        name: "Sony WH-1000XM5 Headphones",
        description: "Industry-leading noise cancellation with 8 microphones. 30-hour battery life, multipoint Bluetooth, and exceptional Hi-Res audio quality.",
        price: 349.99,
        categoryId: electronics._id,
        stock: 40,
        imageUrl: "https://picsum.photos/seed/headphones/400/300",
        createdBy: admin._id,
      },
      {
        name: "MacBook Pro 14\"",
        description: "Supercharged by the M3 Pro chip. Liquid Retina XDR display, up to 22 hours battery life, and a world-class Magic Keyboard.",
        price: 1999.99,
        categoryId: electronics._id,
        stock: 15,
        imageUrl: "https://picsum.photos/seed/macbook/400/300",
        createdBy: admin._id,
      },
      {
        name: "iPad Air M2",
        description: "Powerful. Colorful. Wonderful. The M2 chip brings next-level performance. 10.9-inch Liquid Retina display and all-day battery.",
        price: 599.99,
        categoryId: electronics._id,
        stock: 30,
        imageUrl: "https://picsum.photos/seed/ipad-air/400/300",
        createdBy: admin._id,
      },
      {
        name: "GoPro HERO12 Black",
        description: "Stunning 5.3K60 video and 27MP photos. HyperSmooth 6.0 stabilization, waterproof to 10m, and new Enduro battery.",
        price: 399.99,
        categoryId: electronics._id,
        stock: 20,
        imageUrl: "https://picsum.photos/seed/gopro/400/300",
        createdBy: admin._id,
      },
      // Clothing (5)
      {
        name: "Classic White T-Shirt",
        description: "100% premium Egyptian cotton. Ultra-soft, breathable fabric with a relaxed fit. Pre-shrunk and fade-resistant. Available in sizes XS–3XL.",
        price: 29.99,
        categoryId: clothing._id,
        stock: 100,
        imageUrl: "https://picsum.photos/seed/white-tshirt/400/300",
        createdBy: admin._id,
      },
      {
        name: "Slim Fit Chino Pants",
        description: "Modern slim fit with 2% elastane for comfort and flexibility. Wrinkle-resistant fabric, perfect for office or casual wear.",
        price: 59.99,
        categoryId: clothing._id,
        stock: 75,
        imageUrl: "https://picsum.photos/seed/chinos/400/300",
        createdBy: admin._id,
      },
      {
        name: "Nike Air Max 270",
        description: "Inspired by Air Max icons. The large Air unit delivers unrivaled comfort. Breathable mesh upper with Foam midsole for all-day wear.",
        price: 149.99,
        categoryId: clothing._id,
        stock: 50,
        imageUrl: "https://picsum.photos/seed/nike-shoes/400/300",
        createdBy: admin._id,
      },
      {
        name: "Genuine Leather Jacket",
        description: "Full-grain cowhide leather jacket with satin lining. YKK zippers, two chest pockets, and a timeless biker silhouette.",
        price: 249.99,
        categoryId: clothing._id,
        stock: 20,
        imageUrl: "https://picsum.photos/seed/leather-jacket/400/300",
        createdBy: admin._id,
      },
      {
        name: "Merino Wool Sweater",
        description: "Fine Italian merino wool. Naturally temperature-regulating, machine washable, and surprisingly lightweight for a luxurious feel.",
        price: 89.99,
        categoryId: clothing._id,
        stock: 45,
        imageUrl: "https://picsum.photos/seed/sweater/400/300",
        createdBy: admin._id,
      },
      // Books (4)
      {
        name: "The Pragmatic Programmer",
        description: "The classic guide for programmers who want to become truly professional. Covers everything from career development to architectural techniques.",
        price: 39.99,
        categoryId: books._id,
        stock: 60,
        imageUrl: "https://picsum.photos/seed/pragmatic/400/300",
        createdBy: admin._id,
      },
      {
        name: "Clean Code by Robert Martin",
        description: "A handbook of agile software craftsmanship. Learn to write code that reads like well-written prose and stands the test of time.",
        price: 34.99,
        categoryId: books._id,
        stock: 45,
        imageUrl: "https://picsum.photos/seed/cleancode/400/300",
        createdBy: admin._id,
      },
      {
        name: "Atomic Habits",
        description: "#1 NYT Bestseller. An easy and proven way to build good habits and break bad ones using the science of tiny changes.",
        price: 19.99,
        categoryId: books._id,
        stock: 80,
        imageUrl: "https://picsum.photos/seed/atomichabits/400/300",
        createdBy: admin._id,
      },
      {
        name: "System Design Interview",
        description: "An insider's guide to designing scalable, reliable systems. Covers real-world architectures like URL shorteners, Instagram, and YouTube.",
        price: 44.99,
        categoryId: books._id,
        stock: 35,
        imageUrl: "https://picsum.photos/seed/systemdesign/400/300",
        createdBy: admin._id,
      },
      // Home (5)
      {
        name: "Ceramic Coffee Mug Set (4 pcs)",
        description: "Hand-crafted matte ceramic mugs with a minimalist Scandinavian design. 350ml capacity, microwave and dishwasher safe.",
        price: 34.99,
        categoryId: home._id,
        stock: 90,
        imageUrl: "https://picsum.photos/seed/mugs-set/400/300",
        createdBy: admin._id,
      },
      {
        name: "Memory Foam Neck Pillow",
        description: "Orthopedic contour pillow with temperature-sensitive memory foam. Bamboo-charcoal cover that stays cool and resists odors.",
        price: 49.99,
        categoryId: home._id,
        stock: 55,
        imageUrl: "https://picsum.photos/seed/pillow/400/300",
        createdBy: admin._id,
      },
      {
        name: "LED Smart Desk Lamp",
        description: "Wireless Qi charging base, 5 brightness levels, 3 color temperatures, USB-A port, and a touch-sensitive dimmer. Eye-care mode included.",
        price: 79.99,
        categoryId: home._id,
        stock: 35,
        imageUrl: "https://picsum.photos/seed/desk-lamp/400/300",
        createdBy: admin._id,
      },
      {
        name: "Bamboo Cutting Board Set",
        description: "Set of 3 organic bamboo cutting boards with juice grooves and non-slip feet. BPA-free, eco-friendly, and naturally antibacterial.",
        price: 39.99,
        categoryId: home._id,
        stock: 70,
        imageUrl: "https://picsum.photos/seed/cutting-board/400/300",
        createdBy: admin._id,
      },
      {
        name: "Scented Soy Candle Collection",
        description: "Set of 5 hand-poured soy wax candles: Vanilla, Lavender, Cedarwood, Ocean Breeze, and Sandalwood. 40-hour burn time each.",
        price: 44.99,
        categoryId: home._id,
        stock: 60,
        imageUrl: "https://picsum.photos/seed/candles/400/300",
        createdBy: admin._id,
      },
    ]);

    console.log("🛍  Created 20 products across 4 categories");
    console.log("\n🎉 Database seeded successfully!");
    console.log("─────────────────────────────────────────");
    console.log("Admin:  admin@shopzone.com  →  admin123");
    console.log("User:   omar@shopzone.com   →  user123");
    console.log("─────────────────────────────────────────");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
