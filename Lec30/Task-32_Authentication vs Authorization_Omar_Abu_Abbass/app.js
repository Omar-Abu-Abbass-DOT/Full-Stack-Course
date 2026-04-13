require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const app = express();
app.use(express.json());

// ---------- Task 1: /register endpoint ----------
// Password is hashed automatically via the pre("save") hook in the User model
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const user = new User({ username, password });
    await user.save(); // pre hook hashes the password before saving

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// ---------- Task 2: Test bcrypt - same password, different hashes ----------
app.get("/test-hash", async (req, res) => {
  const password = "mypassword123";
  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;

  const hash1 = await bcrypt.hash(password, saltRounds);
  const hash2 = await bcrypt.hash(password, saltRounds);

  res.json({
    password,
    hash1,
    hash2,
    areHashesDifferent: hash1 !== hash2,
    message: "Same password produces different hashes because of the random salt!",
  });
});

// ---------- Connect to DB and start server ----------
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/auth-practice";

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
  });
