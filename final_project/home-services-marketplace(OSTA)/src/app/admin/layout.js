"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useLocale } from "@/contexts/LocaleContext";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { t } = useLocale();

  const NAV = [
    { href: "/admin",            label: t("admin.dashboard"), exact: true },
    { href: "/admin/users",      label: t("admin.users") },
    { href: "/admin/categories", label: t("admin.categories") },
    { href: "/admin/services",   label: t("admin.services") },
    { href: "/admin/bookings",   label: t("admin.bookings") },
  ];

  return (
    <ProtectedRoute roles={["admin"]}>
      <div className="container section">
        <h1 className="text-2xl font-bold mb-6">{t("admin.title")}</h1>
        <div className="dashboard-grid">
          <aside className="dashboard-side">
            {NAV.map((n) => {
              const active = n.exact
                ? pathname === n.href
                : pathname?.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={active ? "active" : ""}
                >
                  {n.label}
                </Link>
              );
            })}
          </aside>
          <div>{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
