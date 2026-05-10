import connectDB from "@/lib/db";
import User from "@/models/User";
import { requireRole } from "@/lib/authMiddleware";
import {
  ok,
  fail,
  notFound,
  forbidden,
  serverError,
} from "@/lib/apiHelpers";
import { isValidObjectId, ROLES } from "@/lib/validators";

export async function GET(request, { params }) {
  try {
    const { error } = requireRole(request, "admin");
    if (error) return error;

    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail("Invalid user id");

    const user = await User.findById(id);
    if (!user) return notFound("User not found");

    return ok({ user });
  } catch (error) {
    return serverError(error, "Failed to get user");
  }
}

export async function PUT(request, { params }) {
  try {
    const { error } = requireRole(request, "admin");
    if (error) return error;

    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail("Invalid user id");

    const { role, name, phone } = await request.json();

    const update = {};
    if (role !== undefined) {
      if (!ROLES.includes(role)) return fail("Invalid role");
      update.role = role;
    }
    if (name !== undefined) update.name = String(name).trim();
    if (phone !== undefined) update.phone = String(phone).trim();

    const updated = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) return notFound("User not found");

    return ok({ message: "User updated successfully", user: updated });
  } catch (error) {
    return serverError(error, "Failed to update user");
  }
}

export async function DELETE(request, { params }) {
  try {
    const { user, error } = requireRole(request, "admin");
    if (error) return error;

    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail("Invalid user id");

    if (id === user.id) {
      return forbidden("Admins cannot delete their own account");
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return notFound("User not found");

    return ok({ message: "User deleted successfully" });
  } catch (error) {
    return serverError(error, "Failed to delete user");
  }
}
