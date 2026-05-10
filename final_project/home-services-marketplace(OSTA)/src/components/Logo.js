import Image from "next/image";

export default function Logo({ size = 40, showText = false, variant = "mark" }) {
  // variant: "mark" — gear+house only (square), "full" — includes the OSTA wordmark.
  const src = variant === "full" ? "/logo.png" : "/logo-mark.png";

  return (
    <span className="osta-logo" aria-label="OSTA">
      <Image
        src={src}
        alt="OSTA"
        width={size}
        height={size}
        priority
        style={{ width: size, height: size, objectFit: "contain" }}
      />
      {showText && (
        <span
          className="osta-logo-text"
          style={{ marginInlineStart: 8, fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          OSTA
        </span>
      )}
    </span>
  );
}
