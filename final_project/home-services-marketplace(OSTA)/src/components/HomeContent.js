"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import ServiceCard from "./ServiceCard";

const CATEGORY_ICONS = {
  cleaning: "🧹", plumbing: "🔧", electrical: "⚡",
  painting: "🎨", gardening: "🌿", moving: "📦",
  "ac repair": "❄️", carpentry: "🪵",
};

function getCategoryIcon(name = "") {
  return CATEGORY_ICONS[name.toLowerCase()] || "🛠️";
}

export default function HomeContent({ services, categories }) {
  const { t, tCategory, tCatDesc } = useLocale();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-eyebrow">
            ⭐ {t("home.hero.eyebrow") || "Trusted by 10,000+ customers in Jordan"}
          </div>

          <h1>
            {t("home.hero.title")}{" "}
            <span className="accent">{t("home.hero.titleAccent")}</span>
          </h1>

          <p>{t("home.hero.subtitle")}</p>

          <div className="hero-actions">
            <Link href="/services" className="btn btn-primary btn-lg">
              🔍 {t("home.hero.browse")}
            </Link>
            <Link href="/register" className="btn btn-accent btn-lg">
              🚀 {t("home.hero.becomeProvider")}
            </Link>
          </div>

          {/* Trust row */}
          <div className="hero-trust">
            <div className="hero-trust-item">✅ <strong>{t("home.hero.trust.verified")}</strong></div>
            <div className="hero-trust-item">🔒 <strong>{t("home.hero.trust.secure")}</strong></div>
            <div className="hero-trust-item">⚡ <strong>{t("home.hero.trust.fast")}</strong></div>
            <div className="hero-trust-item">⭐ <strong>{t("home.hero.trust.rating")}</strong></div>
          </div>

          {/* Stats strip */}
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">500<span>+</span></div>
              <div className="hero-stat-label">{t("home.stats.providers")}</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">8<span>K+</span></div>
              <div className="hero-stat-label">{t("home.stats.completed")}</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">98<span>%</span></div>
              <div className="hero-stat-label">{t("home.stats.satisfaction")}</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">24<span>/7</span></div>
              <div className="hero-stat-label">{t("home.stats.support")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it Works ─────────────────────────────────── */}
      <section className="how-strip">
        <div className="container section">
          <h2 className="section-title text-center mb-8" style={{ marginBottom: "2.5rem" }}>
            {t("home.howTitle")}
          </h2>
          <div className="grid grid-3">
            <div className="how-card">
              <div className="how-icon">🔍</div>
              <div className="how-num">1</div>
              <div className="how-title">{t("home.feature.search.title")}</div>
              <div className="how-desc">{t("home.feature.search.desc")}</div>
            </div>
            <div className="how-card">
              <div className="how-icon">📅</div>
              <div className="how-num">2</div>
              <div className="how-title">{t("home.feature.book.title")}</div>
              <div className="how-desc">{t("home.feature.book.desc")}</div>
            </div>
            <div className="how-card">
              <div className="how-icon">⭐</div>
              <div className="how-num">3</div>
              <div className="how-title">{t("home.feature.reviews.title")}</div>
              <div className="how-desc">{t("home.feature.reviews.desc")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="section" style={{ background: "var(--color-bg)" }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                {t("home.popularCategories")}
              </h2>
              <Link href="/categories" className="btn btn-ghost btn-sm">
                {t("action.viewAll")} →
              </Link>
            </div>

            <div className="grid grid-4">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/services?category=${encodeURIComponent(cat.name)}`}
                  className="category-card"
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div className="category-icon">{getCategoryIcon(cat.name)}</div>
                  <h3
                    className="font-bold"
                    style={{ fontSize: "0.975rem", marginBottom: "0.3rem", color: "var(--color-fg)" }}
                  >
                    {tCategory(cat.name)}
                  </h3>
                  {cat.description && (
                    <p
                      className="text-xs text-muted"
                      style={{ marginBottom: 0, lineHeight: 1.5 }}
                    >
                      {tCatDesc(cat.description)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Services ──────────────────────────────── */}
      <section className="section" style={{ background: "var(--color-bg-muted)" }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {t("home.latestServices")}
            </h2>
            <Link href="/services" className="btn btn-outline btn-sm">
              {t("action.viewAll")} →
            </Link>
          </div>

          {services.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🛠️</div>
              <h3>{t("home.empty")}</h3>
              <p>{t("home.empty.cta")}</p>
              <Link href="/register" className="btn btn-primary" style={{ marginTop: "1.25rem" }}>
                {t("nav.signup")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-services">
              {services.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div
            style={{
              background: "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-navy-light) 60%, var(--brand-navy) 100%)",
              borderRadius: "var(--radius-2xl)",
              padding: "3rem 2.5rem",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative orbs */}
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: 200, height: 200, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(249,115,22,0.25), transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: "-60px", left: "-60px",
              width: 240, height: 240, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(249,115,22,0.15), transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{
                color: "white",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                marginBottom: "0.75rem",
              }}>
                {t("home.cta.title")}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "1.75rem", fontSize: "1.05rem" }}>
                {t("home.cta.subtitle")}
              </p>
              <div className="flex justify-center gap-3" style={{ flexWrap: "wrap" }}>
                <Link href="/register?role=provider" className="btn btn-accent btn-lg">
                  {t("home.hero.becomeProvider")}
                </Link>
                <Link
                  href="/services"
                  className="btn btn-lg"
                  style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1.5px solid rgba(255,255,255,0.25)" }}
                >
                  {t("home.hero.browse")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
