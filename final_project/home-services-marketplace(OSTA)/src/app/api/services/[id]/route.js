import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { requireAuth } from "@/lib/authMiddleware";
import {
  ok,
  fail,
  notFound,
  forbidden,
  serverError,
} from "@/lib/apiHelpers";
import { isValidObjectId, isFiniteNumber } from "@/lib/validators";

const UPDATABLE_FIELDS = [
  "title",
  "description",
  "category",
  "price",
  "location",
  "coordinates",
  "image",
  "isActive",
];

export async function GET(_request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail("Invalid service id");

    const service = await Service.findById(id).populate(
      "provider",
      "name email role phone avatar"
    );

    if (!service) return notFound("Service not found");

    return ok({ service });
  } catch (error) {
    return serverError(error, "Failed to get service");
  }
}

export async function PUT(request, { params }) {
  try {
    const { user, error } = requireAuth(request);
    if (error) return error;

    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail("Invalid service id");

    const service = await Service.findById(id);
    if (!service) return notFound("Service not found");

    if (
      service.provider.toString() !== user.id &&
      user.role !== "admin"
    ) {
      return forbidden("Not allowed to update this service");
    }

    const data = await request.json();

    for (const field of UPDATABLE_FIELDS) {
      if (data[field] !== undefined) {
        if (field === "price") {
          if (!isFiniteNumber(data.price) || Number(data.price) <= 0) {
            return fail("Price must be a number greater than 0");
          }
          service.price = Number(data.price);
        } else {
          service[field] = data[field];
        }
      }
    }

    await service.save();

    return ok({ message: "Service updated successfully", service });
  } catch (error) {
    return serverError(error, "Failed to update service");
  }
}

export async function DELETE(request, { params }) {
  try {
    const { user, error } = requireAuth(request);
    if (error) return error;

    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail("Invalid service id");

    const service = await Service.findById(id);
    if (!service) return notFound("Service not found");

    if (
      service.provider.toString() !== user.id &&
      user.role !== "admin"
    ) {
      return forbidden("Not allowed to delete this service");
    }

    await Service.findByIdAndDelete(id);

    return ok({ message: "Service deleted successfully" });
  } catch (error) {
    return serverError(error, "Failed to delete service");
  }
}
