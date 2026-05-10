"use client";

import { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useLocale } from "@/contexts/LocaleContext";
import ProtectedRoute from "@/components/ProtectedRoute";

function ProfileContent() {
  const { user, refresh } = useAuth();
  const toast = useToast();
  const { t, tRole } = useLocale();

  const [form, setForm] = useState({ name: "", phone: "", avatar: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/auth/me", form);
      await refresh();
      toast.success(t("profile.saved"));
    } catch (err) {
      toast.error(err.message || t("profile.saveError"));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const data = await api.post("/upload", { image: reader.result });
          setForm((f) => ({ ...f, avatar: data.url }));
          toast.success("✓");
        } catch (err) {
          toast.error(err.message || t("profile.saveError"));
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error(err.message || t("profile.saveError"));
      setUploading(false);
    }
  };

  return (
    <div className="container section" style={{ maxWidth: 720 }}>
      <h1 className="text-2xl font-bold mb-2">{t("profile.title")}</h1>
      <p className="text-muted mb-6">{t("profile.subtitle")}</p>

      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-6" style={{ flexWrap: "wrap" }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "var(--color-primary-soft)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                fontWeight: 700,
                overflow: "hidden",
              }}
            >
              {form.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.avatar}
                  alt="Avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                user?.name?.[0]?.toUpperCase() || "?"
              )}
            </div>
            <div>
              <div className="font-bold">{user?.name}</div>
              <div className="text-muted text-sm">{user?.email}</div>
              <span className="badge mt-2">{tRole(user?.role)}</span>
            </div>
          </div>

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">{t("auth.fullName")}</label>
              <input
                name="name"
                className="form-control"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t("auth.phone")}</label>
              <input
                name="phone"
                className="form-control"
                value={form.phone}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t("profile.avatar")}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
                disabled={uploading}
                className="form-control"
              />
              {uploading && <div className="form-hint">{t("action.uploading")}</div>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t("action.saving") : t("profile.saveChanges")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
