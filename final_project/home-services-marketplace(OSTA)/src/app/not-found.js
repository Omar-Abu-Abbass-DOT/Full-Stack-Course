import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "calc(100dvh - 68px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        textAlign: "center",
        background:
          "radial-gradient(ellipse 60% 50% at 50% -10%, var(--brand-navy-soft), transparent 70%)",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "6rem",
            fontWeight: 900,
            letterSpacing: "-0.06em",
            lineHeight: 1,
            background: "linear-gradient(135deg, var(--brand-navy), var(--brand-orange))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1rem",
          }}
        >
          404
        </div>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "0.5rem",
          }}
        >
          Page Not Found
        </h1>
        <p
          className="text-muted"
          style={{ fontSize: "1rem", marginBottom: "2rem", maxWidth: 380, marginInline: "auto" }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-primary btn-lg">
            🏠 Go Home
          </Link>
          <Link href="/services" className="btn btn-outline btn-lg">
            Browse Services
          </Link>
        </div>
      </div>
    </div>
  );
}
