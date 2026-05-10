"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useSocket } from "@/contexts/SocketContext";
import { useLocale } from "@/contexts/LocaleContext";
import EmptyState from "@/components/EmptyState";

function timeFmt(date, locale) {
  const d = new Date(date);
  try {
    return d.toLocaleString(locale === "ar" ? "ar-JO" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return d.toLocaleString();
  }
}

function NotificationsContent() {
  const { notifications, unreadCount, markAllRead, markOneRead, connected } = useSocket();
  const { t, locale } = useLocale();

  return (
    <div className="container section" style={{ maxWidth: 720 }}>
      <div className="flex justify-between items-center mb-6" style={{ flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ marginBottom: "0.25rem" }}>
            🔔 {t("notif.pageTitle")}
          </h1>
          <p className="text-muted text-sm" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {t("notif.pageSubtitle")}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.15rem 0.55rem",
                borderRadius: "var(--radius-full)",
                background: connected ? "var(--color-success-soft)" : "var(--color-bg-muted)",
                color: connected ? "var(--color-success)" : "var(--color-muted)",
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "currentColor",
                }}
              />
              {connected ? t("notif.live") : t("notif.offline")}
            </span>
          </p>
        </div>

        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn btn-outline btn-sm">
            ✓ {t("notif.markAll")}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon="🔕" title={t("notif.empty")} />
      ) : (
        <div>
          {notifications.map((n) => (
            <div
              key={n._id}
              className="list-item"
              style={{
                background: n.isRead
                  ? "var(--color-surface)"
                  : "color-mix(in srgb, var(--brand-orange) 6%, var(--color-surface))",
                borderColor: n.isRead
                  ? "var(--color-border)"
                  : "color-mix(in srgb, var(--brand-orange) 25%, var(--color-border))",
              }}
            >
              <div className="flex items-center" style={{ gap: "0.75rem", flexWrap: "wrap" }}>
                <span
                  aria-hidden
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: n.isRead
                      ? "var(--color-bg-muted)"
                      : "linear-gradient(135deg, var(--brand-navy), var(--brand-orange))",
                    color: n.isRead ? "var(--color-muted)" : "white",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    flexShrink: 0,
                  }}
                >
                  🔔
                </span>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: n.isRead ? 500 : 700, color: "var(--color-fg)" }}>
                    {n.message}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {timeFmt(n.createdAt, locale)}
                  </div>
                </div>
                {!n.isRead && (
                  <button
                    onClick={() => markOneRead(n._id)}
                    className="btn btn-ghost btn-sm"
                    title={t("notif.markAll")}
                  >
                    ✓
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  );
}
