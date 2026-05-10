"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocale } from "@/contexts/LocaleContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLocale();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="icon-btn"
      aria-label={t("theme.toggle")}
      title={isDark ? t("theme.light") : t("theme.dark")}
      style={{ fontSize: "1.1rem" }}
    >
      <span
        style={{
          display: "inline-block",
          transition: "transform 0.35s ease, opacity 0.2s",
          transform: isDark ? "rotate(0deg)" : "rotate(-20deg)",
        }}
      >
        {isDark ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
