import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import Service from "@/models/Service";
import Notification from "@/models/Notification";
import { requireAuth } from "@/lib/authMiddleware";
import {
  ok,
  fail,
  notFound,
  forbidden,
  serverError,
} from "@/lib/apiHelpers";
import { isValidObjectId, BOOKING_STATUSES } from "@/lib/validators";
import { emitToUser } from "@/lib/socket";

export async function GET(request, { params }) {
  try {
    const { user, error } = requireAuth(request);
    if (error) return error;

    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail("Invalid booking id");

    const booking = await Booking.findById(id)
      .populate("customer", "name email role phone")
      .populate("provider", "name email role phone")
      .populate("service", "title price category image");

    if (!booking) return notFound("Booking not found");

    const isOwner =
      booking.customer._id.toString() === user.id ||
      booking.provider._id.toString() === user.id;

    if (!isOwner && user.role !== "admin") {
      return forbidden("Not allowed to view this booking");
    }

    return ok({ booking });
  } catch (error) {
    return serverError(error, "Failed to get booking");
  }
}

export async function PUT(request, { params }) {
  try {
    const { user, error } = requireAuth(request);
    if (error) return error;

    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail("Invalid booking id");

    const { status } = await request.json();

    if (!status || !BOOKING_STATUSES.includes(status)) {
      return fail(
        `Status must be one of: ${BOOKING_STATUSES.join(", ")}`
      );
    }

    const booking = await Booking.findById(id);
    if (!booking) return notFound("Booking not found");

    const isProvider = booking.provider.toString() === user.id;
    const isCustomer = booking.customer.toString() === user.id;

    if (status === "cancelled") {
      if (!isProvider && !isCustomer && user.role !== "admin") {
        return forbidden("Not allowed to cancel this booking");
      }
    } else if (!isProvider && user.role !== "admin") {
      return forbidden("Only the provider can change this booking status");
    }

    booking.status = status;
    await booking.save();

    // ── Real-time + persistent notification → other party ───────────
    const recipient = isProvider ? booking.customer : booking.provider;
    const svc = await Service.findById(booking.service).select("title").lean();
    const title = svc?.title || "service";
    const message = `Your booking for "${title}" was marked as ${status}.`;
    const notification = await Notification.create({
      user: recipient,
      message,
    });
    emitToUser(recipient, "notification", {
      _id: notification._id,
      message,
      bookingId: booking._id,
      serviceTitle: title,
      kind: `booking.${status}`,
      createdAt: notification.createdAt,
    });

    return ok({ message: "Booking updated successfully", booking });
  } catch (error) {
    return serverError(error, "Failed to update booking");
  }
}

export async function DELETE(request, { params }) {
  try {
    const { user, error } = requireAuth(request);
    if (error) return error;

    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) return fail("Invalid booking id");

    const booking = await Booking.findById(id);
    if (!booking) return notFound("Booking not found");

    const isOwner =
      booking.customer.toString() === user.id ||
      booking.provider.toString() === user.id;

    if (!isOwner && user.role !== "admin") {
      return forbidden("Not allowed to delete this booking");
    }

    await Booking.findByIdAndDelete(id);

    return ok({ message: "Booking deleted successfully" });
  } catch (error) {
    return serverError(error, "Failed to delete booking");
  }
}
