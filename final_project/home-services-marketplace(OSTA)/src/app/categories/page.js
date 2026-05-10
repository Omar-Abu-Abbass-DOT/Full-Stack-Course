"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/apiClient";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import { useLocale } from "@/contexts/LocaleContext";

const CATEGORY_ICONS = {
  cleaning:   "🧹", plumbing:   "🔧", electrical: "⚡",
  painting:   "🎨", gardening:  "🌿", moving:     "📦",
  "ac repair":"❄️", carpentry:  "🪵",
};
const CATEGORY_COLORS = [
  ["#e8f4ff", "#1e3a5f"], ["#fff4e8", "#ea580c"], ["#e8fff4", "#059669"],
  ["#f4e8ff", "#7c3aed"], ["#fff8e8", "#d97706"], ["#e8f8ff", "#0284c7"],
  ["#ffe8e8", "#dc2626"], ["#f0ffe8", "#16a34a"],
];

function getCategoryIcon(name = "") {
  return CATEGORY_ICONS[name.toLowerCase()] || "🛠️";
}

export default function CategoriesPage() {
  const { t, tCategory, tCatDesc } = useLocale();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories?limit=100")
      .then((d) => setCategories(d.categories || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container section">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "0.5rem" }}>
          {t("categories.title")}
        </h1>
        <p className="text-muted" style={{ fontSize: "1.05rem" }}>
          {t("categories.subtitle")}
        </p>
      </div>

      {loading ? (
        <Spinner label={t("categories.loadingCats")} />
      ) : categories.length === 0 ? (
        <EmptyState icon="📂" title={t("categories.empty")} />
      ) : (
        <div className="grid grid-4">
          {categories.map((c, i) => {
            const [bg, color] = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
            const icon = getCategoryIcon(c.name);
            return (
              <Link
                key={c._id}
                href={`/services?category=${encodeURIComponent(c.name)}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="category-card"
                  style={{ background: "var(--color-surface)" }}
                >
                  {/* Colored icon circle */}
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: bg,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.85rem",
                    marginBottom: "0.85rem",
                    transition: "transform var(--transition)",
                    boxShadow: `0 4px 12px ${bg}88`,
                  }}>
                    {icon}
                  </div>
                  <h3 style={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "var(--color-fg)",
                    marginBottom: "0.3rem",
                  }}>
                    {tCategory(c.name)}
                  </h3>
                  {c.description && (
                    <p className="text-xs text-muted" style={{ marginBottom: "0.75rem", lineHeight: 1.55 }}>
                      {tCatDesc(c.description)}
                    </p>
                  )}
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color,
                    background: bg,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                  }}>
                    {t("categories.browse")}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
