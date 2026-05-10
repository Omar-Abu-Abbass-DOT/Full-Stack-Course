import connectDB from "@/lib/db";
import User from "@/models/User";
import { requireRole } from "@/lib/authMiddleware";
import {
  ok,
  serverError,
  getPagination,
  buildPagedPayload,
} from "@/lib/apiHelpers";
import { escapeRegex, ROLES } from "@/lib/validators";

export async function GET(request) {
  try {
    const { error } = requireRole(request, "admin");
    if (error) return error;

    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");

    const filter = {};
    if (search) {
      const re = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ name: re }, { email: re }];
    }
    if (role && ROLES.includes(role)) filter.role = role;

    const { page, limit, skip } = getPagination(searchParams, 10, 100);

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return ok(buildPagedPayload(users, total, page, limit, "users"));
  } catch (error) {
    return serverError(error, "Failed to get users");
  }
}
