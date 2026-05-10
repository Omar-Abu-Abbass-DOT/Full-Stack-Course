import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import { requireAuth } from "@/lib/authMiddleware";
import {
  ok,
  serverError,
  getPagination,
  buildPagedPayload,
} from "@/lib/apiHelpers";

export async function GET(request) {
  try {
    const { user, error } = requireAuth(request);
    if (error) return error;

    await connectDB();

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPagination(searchParams, 20, 100);

    const filter = { user: user.id };
    if (searchParams.get("unread") === "1") filter.isRead = false;

    const [items, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ user: user.id, isRead: false }),
    ]);

    return ok({
      ...buildPagedPayload(items, total, page, limit, "notifications"),
      unreadCount,
    });
  } catch (err) {
    return serverError(err, "Failed to load notifications");
  }
}

export async function PATCH(request) {
  try {
    const { user, error } = requireAuth(request);
    if (error) return error;

    await connectDB();

    const { id } = await request.json().catch(() => ({}));

    if (id) {
      await Notification.updateOne(
        { _id: id, user: user.id },
        { $set: { isRead: true } }
      );
    } else {
      await Notification.updateMany(
        { user: user.id, isRead: false },
        { $set: { isRead: true } }
      );
    }

    const unreadCount = await Notification.countDocuments({
      user: user.id,
      isRead: false,
    });

    return ok({ message: "Marked as read", unreadCount });
  } catch (err) {
    return serverError(err, "Failed to update notifications");
  }
}
