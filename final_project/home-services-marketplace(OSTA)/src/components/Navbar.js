"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import LocaleToggle from "./LocaleToggle";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  /* Close mobile menu on route change */
  useEffect(() => { setOpen(false); }, [pathname]);

  /* Scrolled shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  const isActive = (href) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <header className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="container navbar-inner">
        {/* Brand */}
        <Link href="/" className="navbar-brand">
          <Logo size={34} />
          <span className="brand-text">OSTA</span>
        </Link>

        {/* Hamburger */}
        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>
            {open ? "✕" : "☰"}
          </span>
        </button>

        {/* Links */}
        <nav className={`navbar-links${open ? " open" : ""}`}>
          <Link href="/services" className={isActive("/services") ? "active" : ""}>
            {t("nav.services")}
          </Link>
          <Link href="/categories" className={isActive("/categories") ? "active" : ""}>
            {t("nav.categories")}
          </Link>

          {!loading && user && (
            <>
              <Link href="/bookings" className={isActive("/bookings") ? "active" : ""}>
                {user.role === "provider" ? t("nav.requests") : t("nav.bookings")}
              </Link>

              {user.role === "provider" && (
                <Link href="/provider/services" className={isActive("/provider") ? "active" : ""}>
                  {t("nav.myServices")}
                </Link>
              )}

              {user.role === "admin" && (
                <Link href="/admin" className={isActive("/admin") ? "active" : ""}>
                  {t("nav.admin")}
                </Link>
              )}

              <Link href="/profile" className={isActive("/profile") ? "active" : ""}>
                {/* Avatar circle */}
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}>
                  <span style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--brand-navy), var(--brand-navy-light))",
                    color: "white",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}>
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                  {user.name?.split(" ")[0] || t("nav.profile")}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
                style={{ fontWeight: 600 }}
              >
                {t("nav.logout")}
              </button>
            </>
          )}

          {!loading && !user && (
            <>
              <Link href="/login">{t("nav.login")}</Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                {t("nav.signup")}
              </Link>
            </>
          )}

          {/* Toggles */}
          <span className="navbar-actions">
            <LocaleToggle />
            <ThemeToggle />
          </span>
        </nav>
      </div>
    </header>
  );
}
