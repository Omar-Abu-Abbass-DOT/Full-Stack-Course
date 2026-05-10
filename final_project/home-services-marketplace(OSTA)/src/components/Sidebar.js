"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import LocaleToggle from "./LocaleToggle";

const ICONS = {
  home:       "🏠",
  services:   "🧰",
  categories: "🗂️",
  bookings:   "📅",
  requests:   "📥",
  myServices: "🛠️",
  admin:      "⚙️",
  profile:    "👤",
};

function SidebarLink({ href, icon, label, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`sidebar-link${active ? " active" : ""}`}
      aria-current={active ? "page" : undefined}
    >
      <span className="sidebar-icon" aria-hidden>{ICONS[icon] || "•"}</span>
      <span className="sidebar-label">{label}</span>
    </Link>
  );
}

export default function Sidebar({ open, onClose }) {
  const { user, loading, logout } = useAuth();
  const { t } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  const handleNav = () => onClose?.();

  const handleLogout = () => {
    logout();
    onClose?.();
    router.push("/");
  };

  return (
    <>
      <aside className={`sidebar${open ? " open" : ""}`} aria-label="Main navigation">
        <div className="sidebar-brand">
          <Link href="/" onClick={handleNav} className="sidebar-brand-link">
            <Logo size={40} variant="mark" />
            <span className="sidebar-brand-text">
              <span className="sidebar-brand-name">OSTA</span>
              <span className="sidebar-brand-tag">{t("brand.tagline")}</span>
            </span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-title">{t("sidebar.discover")}</div>
            <SidebarLink
              href="/"
              icon="home"
              label={t("sidebar.home")}
              active={isActive("/") && pathname === "/"}
              onClick={handleNav}
            />
            <SidebarLink
              href="/services"
              icon="services"
              label={t("nav.services")}
              active={isActive("/services")}
              onClick={handleNav}
            />
            <SidebarLink
              href="/categories"
              icon="categories"
              label={t("nav.categories")}
              active={isActive("/categories")}
              onClick={handleNav}
            />
          </div>

          {!loading && user && (
            <div className="sidebar-section">
              <div className="sidebar-section-title">{t("sidebar.account")}</div>
              <SidebarLink
                href="/bookings"
                icon={user.role === "provider" ? "requests" : "bookings"}
                label={user.role === "provider" ? t("nav.requests") : t("nav.bookings")}
                active={isActive("/bookings")}
                onClick={handleNav}
              />
              {user.role === "provider" && (
                <SidebarLink
                  href="/provider/services"
                  icon="myServices"
                  label={t("nav.myServices")}
                  active={isActive("/provider")}
                  onClick={handleNav}
                />
              )}
              {user.role === "admin" && (
                <SidebarLink
                  href="/admin"
                  icon="admin"
                  label={t("nav.admin")}
                  active={isActive("/admin")}
                  onClick={handleNav}
                />
              )}
              <SidebarLink
                href="/profile"
                icon="profile"
                label={t("nav.profile")}
                active={isActive("/profile")}
                onClick={handleNav}
              />
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-toggles">
            <LocaleToggle />
            <ThemeToggle />
          </div>

          {!loading && user ? (
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="sidebar-user-meta">
                <div className="sidebar-user-name">{user.name?.split(" ")[0] || "User"}</div>
                <div className="sidebar-user-role">{user.role}</div>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={handleLogout}
                title={t("nav.logout")}
                aria-label={t("nav.logout")}
              >
                ↩
              </button>
            </div>
          ) : (
            !loading && (
              <div className="sidebar-auth">
                <Link href="/login" onClick={handleNav} className="btn btn-outline btn-sm btn-block">
                  {t("nav.login")}
                </Link>
                <Link href="/register" onClick={handleNav} className="btn btn-primary btn-sm btn-block">
                  {t("nav.signup")}
                </Link>
              </div>
            )
          )}
        </div>
      </aside>

      <button
        type="button"
        className={`sidebar-backdrop${open ? " visible" : ""}`}
        aria-label="Close menu"
        onClick={onClose}
      />
    </>
  );
}
