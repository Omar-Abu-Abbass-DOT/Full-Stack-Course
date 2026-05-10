"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  translate,
  translateContent,
  translateLocation,
  SUPPORTED_LOCALES,
} from "@/lib/translations";

const LocaleContext = createContext(null);

const STORAGE_KEY = "osta-locale";

function getInitialLocale() {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && SUPPORTED_LOCALES.includes(saved)) return saved;
  const browser = navigator.language?.slice(0, 2);
  if (browser && SUPPORTED_LOCALES.includes(browser)) return browser;
  return "en";
}

function applyLocale(locale) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("lang", locale);
  document.documentElement.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState("en");

  useEffect(() => {
    const initial = getInitialLocale();
    setLocaleState(initial);
    applyLocale(initial);
  }, []);

  const setLocale = useCallback((next) => {
    if (!SUPPORTED_LOCALES.includes(next)) return;
    setLocaleState(next);
    applyLocale(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch {}
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "ar" : "en");
  }, [locale, setLocale]);

  const t = useCallback((key, vars) => translate(locale, key, vars), [locale]);
  const tCategory   = useCallback((value) => translateContent(locale, "category", value), [locale]);
  const tCatDesc    = useCallback((value) => translateContent(locale, "catDesc", value), [locale]);
  const tServiceTitle = useCallback((value) => translateContent(locale, "serviceTitle", value), [locale]);
  const tServiceDesc  = useCallback((value) => translateContent(locale, "serviceDesc", value), [locale]);
  const tStatus     = useCallback((value) => translateContent(locale, "status", value), [locale]);
  const tRole       = useCallback((value) => translateContent(locale, "role", value), [locale]);
  const tLocation   = useCallback((value) => translateLocation(locale, value), [locale]);

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        t,
        tCategory,
        tCatDesc,
        tServiceTitle,
        tServiceDesc,
        tStatus,
        tRole,
        tLocation,
        isRTL: locale === "ar",
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
