"use client";

import { useLocale } from "@/contexts/LocaleContext";

const MAP = {
  pending:   { cls: "badge-warning", icon: "⏳" },
  accepted:  { cls: "badge-info",    icon: "✅" },
  completed: { cls: "badge-success", icon: "🎉" },
  cancelled: { cls: "badge-danger",  icon: "❌" },
};

export default function StatusBadge({ status }) {
  const { t } = useLocale();
  const cfg = MAP[status] || { cls: "badge-muted", icon: "•" };
  const label = t(`status.${status}`);
  return (
    <span className={`badge ${cfg.cls}`} style={{ fontSize: "0.75rem" }}>
      {cfg.icon} {label}
    </span>
  );
}
