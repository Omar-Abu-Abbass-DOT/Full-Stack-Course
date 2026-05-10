import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { created, fail, serverError } from "@/lib/apiHelpers";
import { isValidEmail, PUBLIC_ROLES } from "@/lib/validators";

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password, role, phone } = await request.json();

    if (!name || !email || !password) {
      return fail("Name, email and password are required");
    }

    if (!isValidEmail(email)) {
      return fail("Invalid email format");
    }

    if (typeof password !== "string" || password.length < 6) {
      return fail("Password must be at least 6 characters");
    }

    if (role && !PUBLIC_ROLES.includes(role)) {
      return fail("Invalid role");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return fail("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "customer",
      phone: phone || "",
    });

    return created({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return serverError(error, "Register failed");
  }
}
