const express = require("express");
const router = express.Router();
const { register, login, getProfile, updateProfile, getAllUsers, deleteUser } = require("../controllers/userController");
const auth = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

// Auth routes
router.post("/register", register);
router.post("/login", login);

// Profile routes
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

// Admin routes
router.get("/", auth, authorizeRole("admin"), getAllUsers);
router.delete("/:id", auth, authorizeRole("admin"), deleteUser);

module.exports = router;
