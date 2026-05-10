"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";

const CATEGORY_ICONS = {
  cleaning:   "🧹", plumbing:   "🔧", electrical: "⚡",
  painting:   "🎨", gardening:  "🌿", moving:     "📦",
  "ac repair":"❄️", carpentry:  "🪵", default:    "🛠️",
};

function getCategoryIcon(category = "") {
  const key = category.toLowerCase();
  return CATEGORY_ICONS[key] || CATEGORY_ICONS.default;
}

export default function ServiceCard({ service }) {
  const { t, tCategory, tServiceTitle, tServiceDesc, tLocation } = useLocale();
  const icon = getCategoryIcon(service.category);

  const title = tServiceTitle(service.title);
  const description = tServiceDesc(service.description);
  const category = tCategory(service.category);
  const location = tLocation(service.location);

  return (
    <Link href={`/services/${service._id}`} className="card card-hover" style={{ display: "block" }}>
      {/* Image / Placeholder */}
      {service.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={service.image}
          alt={title}
          className="card-image"
          style={{ objectFit: "cover", width: "100%", height: 200, display: "block" }}
        />
      ) : (
        <div className="card-img-placeholder">
          <span style={{ fontSize: "3rem" }}>{icon}</span>
          <span>{category}</span>
        </div>
      )}

      {/* Body */}
      <div className="card-body">
        {/* Category + Location row */}
        <div className="flex justify-between items-center mb-2" style={{ gap: 6 }}>
          <span className="badge">{icon} {category}</span>
          <span className="text-xs text-muted" style={{ display: "flex", alignItems: "center", gap: 3 }}>
            📍 {location}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-bold text-lg"
          style={{
            marginBottom: "0.5rem",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.6em",
            color: "var(--color-fg)",
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="text-sm text-muted"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.6em",
            marginBottom: "1rem",
            lineHeight: 1.55,
          }}
        >
          {description}
        </p>

        {/* Divider */}
        <div className="divider" style={{ marginBlock: "0.75rem" }} />

        {/* Price + Provider */}
        <div className="flex justify-between items-center">
          <div>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, var(--brand-orange), #fb923c)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1,
              }}
            >
              ${service.price}
            </div>
            <div className="text-xs text-muted" style={{ marginTop: 2 }}>{t("services.perSession")}</div>
          </div>

          {service.provider?.name && (
            <div style={{ textAlign: "end" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--brand-navy), var(--brand-navy-light))",
                  color: "white",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  marginBottom: 2,
                }}
              >
                {service.provider.name[0].toUpperCase()}
              </div>
              <div className="text-xs text-muted" style={{ maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {service.provider.name}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
