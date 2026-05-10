"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useLocale } from "@/contexts/LocaleContext";
import Logo from "@/components/Logo";

export default function RegisterPage() {
  const { register, login } = useAuth();
  const { t } = useLocale();
  const ROLES = [
    {
      value: "customer",
      emoji: "🏠",
      label: t("auth.role.book"),
      desc: t("auth.role.bookDesc"),
    },
    {
      value: "provider",
      emoji: "🛠️",
      label: t("auth.role.offer"),
      desc: t("auth.role.offerDesc"),
    },
  ];
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    phone: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      await login(form.email, form.password);
      toast.success(`${t("auth.welcomeNew")} OSTA! 🎉`);
      router.push(form.role === "provider" ? "/provider/services" : "/services");
    } catch (err) {
      setError(err.message || t("auth.creating"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        {/* Logo */}
        <div className="auth-logo-wrap">
          <Logo size={48} />
        </div>

        <h1>{t("auth.createAccount")}</h1>
        <p className="muted">{t("auth.registerSubtitle")}</p>

        {error && (
          <div className="alert alert-error">⚠️ {error}</div>
        )}

        <form onSubmit={onSubmit} noValidate>
          {/* Role selector */}
          <div className="form-group">
            <label className="form-label">{t("auth.iWantTo")}</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.value })}
                  style={{
                    padding: "1rem",
                    borderRadius: "var(--radius-lg)",
                    border: `2px solid ${form.role === r.value ? "var(--color-primary)" : "var(--color-border)"}`,
                    background: form.role === r.value ? "var(--color-primary-soft)" : "var(--color-surface)",
                    color: form.role === r.value ? "var(--color-primary)" : "var(--color-muted)",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all var(--transition)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>{r.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{r.label}</span>
                  <span style={{ fontSize: "0.75rem", lineHeight: 1.4, opacity: 0.8 }}>{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="name">{t("auth.fullName")}</label>
              <input
                id="name"
                name="name"
                className="form-control"
                value={form.name}
                onChange={onChange}
                placeholder="Ahmad Al-Mansour"
                required
                minLength={2}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">{t("auth.phoneOptional")}</label>
              <input
                id="phone"
                name="phone"
                className="form-control"
                value={form.phone}
                onChange={onChange}
                placeholder="07xxxxxxxx"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">{t("auth.email")}</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">{t("auth.password")}</label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                className="form-control"
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
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
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
            <div className="form-hint">
              {t("auth.passwordHint")}
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
                {t("auth.creating")}
              </span>
            ) : (
              `🚀 ${t("auth.createBtn")}`
            )}
          </button>
        </form>

        <div className="footer-link">
          {t("auth.haveAccount")}{" "}
          <Link href="/login" className="text-accent font-semibold">
            {t("nav.login")}
          </Link>
        </div>
      </div>
    </div>
  );
}
