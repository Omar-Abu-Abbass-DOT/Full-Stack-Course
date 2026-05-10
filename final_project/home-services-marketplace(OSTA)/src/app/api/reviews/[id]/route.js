import connectDB from "@/lib/db";
import Review from "@/models/Review";
import { requireAuth } from "@/lib/authMiddleware";
import {
  ok,
  fail,
  notFound,
  forbidden,
  serverError,
} from "@/lib/apiHelpers";
import { isValidObjectId, isFiniteNumber } from "@/lib/validators";

export async function GET(_request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail("Invalid review id");

    const review = await Review.findById(id)
      .populate("customer", "name email avatar")
      .populate("provider", "name email")
      .populate("service", "title");

    if (!review) return notFound("Review not found");

    return ok({ review });
  } catch (error) {
    return serverError(error, "Failed to get review");
  }
}

export async function PUT(request, { params }) {
  try {
    const { user, error } = requireAuth(request);
    if (error) return error;

    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail("Invalid review id");

    const review = await Review.findById(id);
    if (!review) return notFound("Review not found");

    if (review.customer.toString() !== user.id && user.role !== "admin") {
      return forbidden("Not allowed to update this review");
    }

    const { rating, comment } = await request.json();

    if (rating !== undefined) {
      if (!isFiniteNumber(rating) || rating < 1 || rating > 5) {
        return fail("Rating must be a number between 1 and 5");
      }
      review.rating = Number(rating);
    }
    if (comment !== undefined) review.comment = String(comment);

    await review.save();

    return ok({ message: "Review updated successfully", review });
  } catch (error) {
    return serverError(error, "Failed to update review");
  }
}

export async function DELETE(request, { params }) {
  try {
    const { user, error } = requireAuth(request);
    if (error) return error;

    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail("Invalid review id");

    const review = await Review.findById(id);
    if (!review) return notFound("Review not found");

    if (review.customer.toString() !== user.id && user.role !== "admin") {
      return forbidden("Not allowed to delete this review");
    }

    await Review.findByIdAndDelete(id);

    return ok({ message: "Review deleted successfully" });
  } catch (error) {
    return serverError(error, "Failed to delete review");
  }
}
