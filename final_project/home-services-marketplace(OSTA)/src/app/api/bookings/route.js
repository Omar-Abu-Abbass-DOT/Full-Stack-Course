import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import Service from "@/models/Service";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { requireAuth, requireRole } from "@/lib/authMiddleware";
import { sendEmail } from "@/lib/sendEmail";
import { emitToUser } from "@/lib/socket";
import {
  ok,
  created,
  fail,
  notFound,
  serverError,
  getPagination,
  buildPagedPayload,
} from "@/lib/apiHelpers";
import {
  isValidObjectId,
  isFutureDate,
  BOOKING_STATUSES,
} from "@/lib/validators";

export async function GET(request) {
  try {
    const { user, error } = requireAuth(request);
    if (error) return error;

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const filter = {};
    if (user.role === "customer") filter.customer = user.id;
    else if (user.role === "provider") filter.provider = user.id;

    if (status && BOOKING_STATUSES.includes(status)) filter.status = status;

    const { page, limit, skip } = getPagination(searchParams, 10, 50);

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate("customer", "name email role phone")
        .populate("provider", "name email role phone")
        .populate("service", "title price category image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(filter),
    ]);

    return ok(buildPagedPayload(bookings, total, page, limit, "bookings"));
  } catch (error) {
    return serverError(error, "Failed to get bookings");
  }
}

export async function POST(request) {
  try {
    const { user, error } = requireRole(request, "customer");
    if (error) return error;

    await connectDB();

    const { service, date, notes } = await request.json();

    if (!service || !date) {
      return fail("Service and date are required");
    }

    if (!isValidObjectId(service)) {
      return fail("Invalid service id");
    }

    if (!isFutureDate(date)) {
      return fail("Date must be a valid date in the future");
    }

    const serviceData = await Service.findById(service);
    if (!serviceData) return notFound("Service not found");

    if (serviceData.provider.toString() === user.id) {
      return fail("You cannot book your own service", 403);
    }

    const booking = await Booking.create({
      customer: user.id,
      provider: serviceData.provider,
      service,
      date,
      notes: notes || "",
    });

    const customerUser = await User.findById(user.id);
    if (customerUser?.email) {
      sendEmail(
        customerUser.email,
        "Booking Confirmed",
        `Your booking for "${serviceData.title}" on ${new Date(
          date
        ).toLocaleString()} has been created successfully.`
      ).catch((e) => console.error("Email send failed:", e?.message));
    }

    // ── Real-time + persistent notification → provider ──────────────
    const message = `New booking request for "${serviceData.title}" from ${customerUser?.name || "a customer"}.`;
    const notification = await Notification.create({
      user: serviceData.provider,
      message,
    });
    emitToUser(serviceData.provider, "notification", {
      _id: notification._id,
      message,
      bookingId: booking._id,
      serviceTitle: serviceData.title,
      kind: "booking.created",
      createdAt: notification.createdAt,
    });

    return created({ message: "Booking created successfully", booking });
  } catch (error) {
    return serverError(error, "Failed to create booking");
  }
}
