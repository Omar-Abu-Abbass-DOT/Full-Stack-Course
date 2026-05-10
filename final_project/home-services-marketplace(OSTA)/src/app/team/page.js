"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import Logo from "@/components/Logo";

function MemberCard({ initial, name, role, accent }) {
  return (
    <div
      className="card team-card"
      style={{
        textAlign: "center",
        padding: "2rem 1.5rem",
        position: "relative",
        overflow: "hidden",
        transition: "transform var(--transition-md), box-shadow var(--transition-md)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${accent}1f, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${accent}, var(--brand-navy))`,
            color: "white",
            margin: "0 auto 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.6rem",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            boxShadow: `0 12px 28px -8px ${accent}66`,
            border: `3px solid var(--color-surface)`,
          }}
        >
          {initial}
        </div>

        <h3
          style={{
            fontSize: "1.35rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: "0.35rem",
            color: "var(--color-fg)",
          }}
        >
          {name}
        </h3>
        <p
          className="text-sm"
          style={{
            color: "var(--color-muted)",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontSize: "0.78rem",
            marginBottom: "1rem",
          }}
        >
          {role}
        </p>

        <div
          style={{
            display: "inline-flex",
            gap: "0.4rem",
            padding: "0.35rem 0.85rem",
            borderRadius: "var(--radius-full)",
            background: `${accent}1a`,
            color: accent,
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          ✦ Full-Stack
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const { t } = useLocale();

  return (
    <div className="container section" style={{ maxWidth: 960 }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div className="auth-logo-wrap" style={{ marginBottom: "1.25rem" }}>
          <Logo size={72} variant="mark" />
        </div>
        <h1
          style={{
            fontSize: "clamp(1.85rem, 4vw, 2.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, var(--brand-navy), var(--brand-orange))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("team.title")}
        </h1>
        <p className="text-muted" style={{ fontSize: "1.05rem" }}>
          {t("team.subtitle")}
        </p>
      </div>

      {/* Supervisor strip */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-navy-light) 100%)",
          borderRadius: "var(--radius-2xl)",
          padding: "1.75rem 2rem",
          textAlign: "center",
          color: "white",
          marginBottom: "2.5rem",
          boxShadow: "var(--shadow-glow-navy)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: -40,
            background:
              "radial-gradient(circle at 90% 0%, rgba(249,115,22,0.25), transparent 50%)," +
              "radial-gradient(circle at 0% 100%, rgba(249,115,22,0.18), transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "0.5rem",
            }}
          >
            🎓 {t("team.supervisor")}
          </div>
          <h2
            style={{
              fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "0.35rem",
              color: "white",
            }}
          >
            {t("team.supervisorName")}
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            {t("team.supervisorRole")}
          </p>
        </div>
      </div>

      {/* Built-by section heading */}
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "var(--color-accent-soft)",
            color: "var(--color-accent)",
            border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
            padding: "0.4rem 1rem",
            borderRadius: "var(--radius-full)",
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          ✨ {t("team.builtBy")}
        </span>
      </div>

      {/* Member cards — side by side */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        <MemberCard
          initial="A"
          name={t("team.member1.name")}
          role={t("team.member1.role")}
          accent="#f97316"
        />
        <MemberCard
          initial="O"
          name={t("team.member2.name")}
          role={t("team.member2.role")}
          accent="#1e3a5f"
        />
      </div>

      {/* Bootcamp note */}
      <div
        style={{
          textAlign: "center",
          padding: "1.5rem",
          borderTop: "1px solid var(--color-border)",
          color: "var(--color-muted)",
          fontSize: "0.875rem",
        }}
      >
        🎯 {t("team.bootcampNote")}
      </div>

      {/* Back link */}
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <Link href="/" className="btn btn-outline btn-sm">
          ← {t("sidebar.home")}
        </Link>
      </div>
    </div>
  );
}
