"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useLocale } from "@/contexts/LocaleContext";
import Logo from "@/components/Logo";

function LoginForm() {
  const { login } = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      toast.success(`${t("auth.welcomeBack")} 👋`);
      const next = params.get("next") || "/";
      router.push(next);
    } catch (err) {
      setError(err.message || t("auth.signingIn"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo-wrap">
          <Logo size={48} />
        </div>

        <h1>{t("auth.welcomeBack")}</h1>
        <p className="muted">{t("auth.loginSubtitle")}</p>

        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              {t("auth.email")}
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              {t("auth.password")}
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPass ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                minLength={6}
                style={{ paddingInlineEnd: "2.75rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                style={{
                  position: "absolute",
                  insetInlineEnd: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-muted)",
                  fontSize: "1.1rem",
                  lineHeight: 1,
                }}
                tabIndex={-1}
                aria-label={t("auth.password")}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            style={{ marginTop: "0.5rem" }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                {t("auth.signingIn")}
              </span>
            ) : (
              `🔑 ${t("auth.signIn")}`
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBlock: "1.25rem",
          color: "var(--color-subtle)",
          fontSize: "0.8rem",
        }}>
          <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
          {t("auth.noAccount")}
          <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
        </div>

        <Link href="/register" className="btn btn-outline btn-block">
          🚀 {t("auth.createAccount")}
        </Link>

        <div className="footer-link">
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="text-accent font-semibold">
            {t("nav.signup")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="auth-shell">
        <div className="auth-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 320 }}>
          <div className="spinner" />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
