"use client";

export default function GlobalError({ error, reset }) {
  return (
    <div
      style={{
        minHeight: "calc(100dvh - 68px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        textAlign: "center",
      }}
    >
      <div>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>⚠️</div>
        <h1
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "0.5rem",
          }}
        >
          Something went wrong
        </h1>
        <p
          className="text-muted"
          style={{ marginBottom: "2rem", maxWidth: 360, marginInline: "auto" }}
        >
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        <button onClick={() => reset()} className="btn btn-primary btn-lg">
          🔄 Try again
        </button>
      </div>
    </div>
  );
}
