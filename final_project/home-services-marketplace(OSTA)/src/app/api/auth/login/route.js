import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { ok, fail, serverError } from "@/lib/apiHelpers";
import { signToken } from "@/lib/auth";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return fail("Email and password are required");
    }

    const user = await User.findOne({
      email: String(email).toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return fail("Invalid email or password", 401);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return fail("Invalid email or password", 401);
    }

    const token = signToken({ id: user._id, role: user.role });

    return ok({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return serverError(error, "Login failed");
  }
}
