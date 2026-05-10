"use client";

import { useState } from "react";

export default function RatingStars({
  value = 0,
  size = 16,
  interactive = false,
  onChange,
}) {
  const [hovered, setHovered] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  const display = interactive ? (hovered || value) : value;

  if (!interactive) {
    return (
      <span className="stars" style={{ fontSize: size, gap: 1 }}>
        {stars.map((s) => (
          <span key={s} className={s <= Math.round(display) ? "star-filled" : "star-empty"}>
            ★
          </span>
        ))}
      </span>
    );
  }

  return (
    <span
      className="stars"
      style={{ fontSize: size, gap: 2, cursor: "pointer" }}
      onMouseLeave={() => setHovered(0)}
      role="group"
      aria-label="Rating"
    >
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onClick={() => onChange?.(s)}
          aria-label={`${s} star${s > 1 ? "s" : ""}`}
          style={{
            padding: 0,
            lineHeight: 1,
            fontSize: "inherit",
            transition: "transform 0.1s ease",
            transform: s <= display ? "scale(1.15)" : "scale(1)",
          }}
          className={s <= display ? "star-filled" : "star-empty"}
        >
          ★
        </button>
      ))}
    </span>
  );
}
