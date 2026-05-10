import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { requireRole } from "@/lib/authMiddleware";
import {
  ok,
  created,
  fail,
  serverError,
  getPagination,
  buildPagedPayload,
} from "@/lib/apiHelpers";
import { escapeRegex } from "@/lib/validators";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const filter = {};
    if (search) {
      const re = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ name: re }, { description: re }];
    }

    const { page, limit, skip } = getPagination(searchParams, 20, 100);

    const [categories, total] = await Promise.all([
      Category.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
      Category.countDocuments(filter),
    ]);

    return ok(buildPagedPayload(categories, total, page, limit, "categories"));
  } catch (error) {
    return serverError(error, "Failed to get categories");
  }
}

export async function POST(request) {
  try {
    const { error } = requireRole(request, "admin");
    if (error) return error;

    await connectDB();

    const { name, description, image } = await request.json();

    if (!name || !String(name).trim()) {
      return fail("Category name is required");
    }

    const existing = await Category.findOne({ name: String(name).trim() });
    if (existing) return fail("Category already exists", 409);

    const category = await Category.create({
      name: String(name).trim(),
      description: description || "",
      image: image || "",
    });

    return created({ message: "Category created successfully", category });
  } catch (error) {
    if (error?.code === 11000) return fail("Category already exists", 409);
    return serverError(error, "Failed to create category");
  }
}
