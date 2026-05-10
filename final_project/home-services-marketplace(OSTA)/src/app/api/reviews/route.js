import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import Booking from "@/models/Booking";
import { requireRole } from "@/lib/authMiddleware";
import {
  ok,
  created,
  fail,
  forbidden,
  serverError,
  getPagination,
  buildPagedPayload,
} from "@/lib/apiHelpers";
import { isValidObjectId, isFiniteNumber } from "@/lib/validators";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get("service");
    const providerId = searchParams.get("provider");

    const filter = {};
    // Must use ObjectId instances in aggregate $match (Mongoose doesn't auto-cast)
    if (serviceId && isValidObjectId(serviceId))
      filter.service = new mongoose.Types.ObjectId(serviceId);
    if (providerId && isValidObjectId(providerId))
      filter.provider = new mongoose.Types.ObjectId(providerId);

    const { page, limit, skip } = getPagination(searchParams, 10, 50);

    const [reviews, total, agg] = await Promise.all([
      Review.find(filter)
        .populate("customer", "name email avatar")
        .populate("provider", "name email")
        .populate("service", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments(filter),
      Review.aggregate([
        { $match: filter },
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]),
    ]);

    const averageRating = agg[0]?.avg || 0;
    const payload = buildPagedPayload(reviews, total, page, limit, "reviews");
    payload.averageRating = Math.round(averageRating * 100) / 100;

    return ok(payload);
  } catch (error) {
    return serverError(error, "Failed to get reviews");
  }
}

export async function POST(request) {
  try {
    const { user, error } = requireRole(request, "customer");
    if (error) return error;

    await connectDB();

    const { service, rating, comment } = await request.json();

    if (!service || rating === undefined) {
      return fail("Service and rating are required");
    }

    if (!isValidObjectId(service)) return fail("Invalid service id");

    if (!isFiniteNumber(rating) || rating < 1 || rating > 5) {
      return fail("Rating must be a number between 1 and 5");
    }

    const booking = await Booking.findOne({
      customer: user.id,
      service,
      status: "completed",
    });

    if (!booking) {
      return forbidden("You can only review services you have completed");
    }

    const existingReview = await Review.findOne({
      customer: user.id,
      service,
    });
    if (existingReview) {
      return fail("You already reviewed this service", 409);
    }

    const review = await Review.create({
      customer: user.id,
      provider: booking.provider,
      service,
      rating: Number(rating),
      comment: comment || "",
    });

    return created({ message: "Review added successfully", review });
  } catch (error) {
    if (error?.code === 11000) {
      return fail("You already reviewed this service", 409);
    }
    return serverError(error, "Failed to add review");
  }
}
