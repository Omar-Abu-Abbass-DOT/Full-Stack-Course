import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { requireRole } from "@/lib/authMiddleware";
import {
  ok,
  created,
  fail,
  serverError,
  getPagination,
  buildPagedPayload,
} from "@/lib/apiHelpers";
import { isFiniteNumber, escapeRegex } from "@/lib/validators";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || searchParams.get("title");
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const provider = searchParams.get("provider");

    const filter = {};

    if (search) {
      const re = new RegExp(escapeRegex(search), "i");
      filter.$or = [
        { title: re },
        { description: re },
        { category: re },
      ];
    }
    if (category) filter.category = new RegExp(`^${escapeRegex(category)}$`, "i");
    if (location) filter.location = new RegExp(escapeRegex(location), "i");
    if (provider) filter.provider = provider;

    if (isFiniteNumber(minPrice) || isFiniteNumber(maxPrice)) {
      filter.price = {};
      if (isFiniteNumber(minPrice)) filter.price.$gte = Number(minPrice);
      if (isFiniteNumber(maxPrice)) filter.price.$lte = Number(maxPrice);
    }

    const { page, limit, skip } = getPagination(searchParams, 6, 50);

    const [services, total] = await Promise.all([
      Service.find(filter)
        .populate("provider", "name email role phone avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Service.countDocuments(filter),
    ]);

    return ok(buildPagedPayload(services, total, page, limit, "services"));
  } catch (error) {
    return serverError(error, "Failed to get services");
  }
}

export async function POST(request) {
  try {
    const { user, error } = requireRole(request, "provider");
    if (error) return error;

    await connectDB();

    const {
      title,
      description,
      category,
      price,
      location,
      coordinates,
      image,
    } = await request.json();

    if (!title || !description || !category || !location) {
      return fail("Title, description, category and location are required");
    }

    if (!isFiniteNumber(price) || Number(price) <= 0) {
      return fail("Price must be a number greater than 0");
    }

    const service = await Service.create({
      title: String(title).trim(),
      description: String(description).trim(),
      category: String(category).trim(),
      price: Number(price),
      location: String(location).trim(),
      coordinates,
      image: image || "",
      provider: user.id,
    });

    return created({ message: "Service created successfully", service });
  } catch (error) {
    return serverError(error, "Failed to create service");
  }
}
