"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useLocale } from "@/contexts/LocaleContext";

export default function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-brand-col">
            <div className="footer-brand">
              <Logo size={28} variant="mark" />
              OSTA
            </div>
            <p className="footer-tagline">{t("footer.about")}</p>
            <div className="flex gap-2" style={{ marginTop: "1rem", flexWrap: "wrap" }}>
              <span style={{
                background: "var(--color-success-soft)",
                color: "var(--color-success)",
                padding: "0.2rem 0.65rem",
                borderRadius: "var(--radius-full)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}>
                ✓ {t("footer.verified")}
              </span>
              <span style={{
                background: "var(--color-primary-soft)",
                color: "var(--color-primary)",
                padding: "0.2rem 0.65rem",
                borderRadius: "var(--radius-full)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}>
                🔒 {t("footer.secure")}
              </span>
            </div>
          </div>

          {/* Services column */}
          <div>
            <div className="footer-heading">{t("footer.servicesTitle")}</div>
            <div className="footer-links">
              <Link href="/services">{t("footer.browseAll")}</Link>
              <Link href="/services?category=Cleaning">{t("nav.services")}</Link>
              <Link href="/categories">{t("footer.allCategories")}</Link>
            </div>
          </div>

          {/* Account column */}
          <div>
            <div className="footer-heading">{t("footer.accountTitle")}</div>
            <div className="footer-links">
              <Link href="/login">{t("nav.login")}</Link>
              <Link href="/register">{t("nav.signup")}</Link>
              <Link href="/bookings">{t("nav.bookings")}</Link>
              <Link href="/profile">{t("nav.profile")}</Link>
              <Link href="/provider/services">{t("footer.providerPortal")}</Link>
            </div>
          </div>

          {/* Company column */}
          <div>
            <div className="footer-heading">{t("footer.companyTitle")}</div>
            <div className="footer-links">
              <Link href="/">{t("footer.aboutOsta")}</Link>
              <Link href="/">{t("footer.howItWorks")}</Link>
              <Link href="/">{t("footer.privacy")}</Link>
              <Link href="/">{t("footer.terms")}</Link>
              <Link href="/team">{t("team.title")}</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© {year} OSTA · {t("footer.copyright")}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-subtle)", fontSize: "0.8rem" }}>
            {t("footer.builtBy")}
          </span>
        </div>
      </div>
    </footer>
  );
}
