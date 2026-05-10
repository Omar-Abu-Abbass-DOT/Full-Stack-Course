import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { requireRole } from "@/lib/authMiddleware";
import {
  ok,
  fail,
  notFound,
  serverError,
} from "@/lib/apiHelpers";
import { isValidObjectId } from "@/lib/validators";

export async function GET(_request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail("Invalid category id");

    const category = await Category.findById(id);
    if (!category) return notFound("Category not found");

    return ok({ category });
  } catch (error) {
    return serverError(error, "Failed to get category");
  }
}

export async function PUT(request, { params }) {
  try {
    const { error } = requireRole(request, "admin");
    if (error) return error;

    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail("Invalid category id");

    const data = await request.json();
    const update = {};
    if (data.name !== undefined) update.name = String(data.name).trim();
    if (data.description !== undefined) update.description = data.description;
    if (data.image !== undefined) update.image = data.image;

    const category = await Category.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!category) return notFound("Category not found");

    return ok({ message: "Category updated successfully", category });
  } catch (error) {
    if (error?.code === 11000) return fail("Category name already exists", 409);
    return serverError(error, "Failed to update category");
  }
}

export async function DELETE(request, { params }) {
  try {
    const { error } = requireRole(request, "admin");
    if (error) return error;

    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail("Invalid category id");

    const category = await Category.findByIdAndDelete(id);
    if (!category) return notFound("Category not found");

    return ok({ message: "Category deleted successfully" });
  } catch (error) {
    return serverError(error, "Failed to delete category");
  }
}
