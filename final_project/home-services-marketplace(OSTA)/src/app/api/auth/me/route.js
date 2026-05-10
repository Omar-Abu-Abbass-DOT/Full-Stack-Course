import connectDB from "@/lib/db";
import User from "@/models/User";
import { requireAuth } from "@/lib/authMiddleware";
import { ok, notFound, serverError } from "@/lib/apiHelpers";

export async function GET(request) {
  try {
    const { user, error } = requireAuth(request);
    if (error) return error;

    await connectDB();

    const profile = await User.findById(user.id);
    if (!profile) return notFound("User not found");

    return ok({ user: profile });
  } catch (error) {
    return serverError(error, "Failed to fetch profile");
  }
}

export async function PUT(request) {
  try {
    const { user, error } = requireAuth(request);
    if (error) return error;

    await connectDB();

    const data = await request.json();
    const allowed = ["name", "phone", "avatar"];
    const update = {};
    for (const key of allowed) {
      if (data[key] !== undefined) update[key] = data[key];
    }

    const updated = await User.findByIdAndUpdate(user.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) return notFound("User not found");

    return ok({ message: "Profile updated", user: updated });
  } catch (error) {
    return serverError(error, "Failed to update profile");
  }
}
