"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import LocaleToggle from "./LocaleToggle";
import NotificationBell from "./NotificationBell";

export default function TopBar({ onToggleSidebar }) {
  const { t } = useLocale();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const term = q.trim();
    const url = term ? `/services?search=${encodeURIComponent(term)}` : "/services";
    router.push(url);
  };

  return (
    <header className={`topbar${scrolled ? " scrolled" : ""}`}>
      <div className="topbar-inner">
        <div className="topbar-start">
          <button
            type="button"
            className="icon-btn topbar-menu-btn"
            aria-label={t("sidebar.toggle")}
            onClick={onToggleSidebar}
          >
            ☰
          </button>
          <Link href="/" className="topbar-brand">
            <Logo size={32} variant="mark" />
            <span className="topbar-brand-text">OSTA</span>
          </Link>
        </div>

        <form className="topbar-search" onSubmit={onSubmit} role="search">
          <span className="topbar-search-icon" aria-hidden>🔍</span>
          <input
            type="search"
            className="topbar-search-input"
            placeholder={t("search.placeholder")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={t("action.search")}
          />
          <button type="submit" className="topbar-search-btn">
            {t("action.search")}
          </button>
        </form>

        <div className="topbar-end">
          <span className="topbar-toggles">
            <LocaleToggle />
            <ThemeToggle />
          </span>
          {!loading && user && <NotificationBell />}
          {!loading && (
            user ? (
              <Link href="/profile" className="topbar-user" aria-label={t("nav.profile")}>
                <span className="topbar-user-avatar">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="topbar-user-name">
                  {user.name?.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <span className="topbar-auth">
                <Link href="/login" className="btn btn-ghost btn-sm">
                  {t("nav.login")}
                </Link>
                <Link href="/register" className="btn btn-accent btn-sm">
                  {t("nav.signup")}
                </Link>
              </span>
            )
          )}
        </div>
      </div>
    </header>
  );
}
