"use client";

import { useLocale } from "@/contexts/LocaleContext";

export default function LocaleToggle() {
  const { locale, toggleLocale, t } = useLocale();
  const isAr = locale === "ar";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className="icon-btn"
      aria-label={t("lang.toggle")}
      title={isAr ? t("lang.english") : t("lang.arabic")}
      style={{
        width: "auto",
        padding: "0 0.65rem",
        fontWeight: 700,
        fontSize: "0.78rem",
        letterSpacing: "0.04em",
        gap: 0,
      }}
    >
      {isAr ? "EN" : "ع"}
    </button>
  );
}
