"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useLocale } from "@/contexts/LocaleContext";

function timeAgo(date, locale) {
  const t = (date instanceof Date ? date : new Date(date)).getTime();
  const diff = Math.max(0, Date.now() - t);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return locale === "ar" ? "الآن" : "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return locale === "ar" ? `منذ ${min}د` : `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return locale === "ar" ? `منذ ${hr}س` : `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return locale === "ar" ? `منذ ${day}ي` : `${day}d ago`;
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead, markOneRead, connected } = useSocket();
  const { t, locale } = useLocale();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown",   onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown",   onKey);
    };
  }, [open]);

  return (
    <div className="notif-wrap" ref={wrapRef}>
      <button
        type="button"
        className="icon-btn notif-btn"
        aria-label={t("notif.title")}
        title={t("notif.title")}
        onClick={() => setOpen((o) => !o)}
      >
        <span style={{ fontSize: "1rem", lineHeight: 1 }}>🔔</span>
        {unreadCount > 0 && (
          <span className="notif-badge" aria-label={`${unreadCount} unread`}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        <span className={`notif-status${connected ? " online" : ""}`} aria-hidden />
      </button>

      {open && (
        <div className="notif-panel" role="menu">
          <div className="notif-panel-head">
            <span style={{ fontWeight: 700 }}>{t("notif.title")}</span>
            {unreadCount > 0 && (
              <button type="button" onClick={markAllRead} className="btn btn-ghost btn-sm">
                {t("notif.markAll")}
              </button>
            )}
          </div>

          <div className="notif-panel-body">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.7 }}>🔕</div>
                {t("notif.empty")}
              </div>
            ) : (
              notifications.slice(0, 8).map((n) => (
                <button
                  key={n._id}
                  type="button"
                  onClick={() => markOneRead(n._id)}
                  className={`notif-item${n.isRead ? "" : " unread"}`}
                >
                  <span className="notif-dot" aria-hidden />
                  <span className="notif-content">
                    <span className="notif-message">{n.message}</span>
                    <span className="notif-time">{timeAgo(n.createdAt, locale)}</span>
                  </span>
                </button>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <Link
              href="/notifications"
              className="notif-panel-foot"
              onClick={() => setOpen(false)}
            >
              {t("notif.viewAll")} →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
