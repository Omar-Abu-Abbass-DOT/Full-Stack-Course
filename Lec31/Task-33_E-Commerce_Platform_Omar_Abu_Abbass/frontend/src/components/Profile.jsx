import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import { useFavorites } from "../context/FavoritesContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { user, token, login } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { favorites } = useFavorites();

  const [ordersCount, setOrdersCount] = useState(0);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API}/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrdersCount(res.data.length);
      } catch { /* ignore */ }
      setLoadingStats(false);
    };
    fetchOrders();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      toast(t("passwordMismatch"), "error");
      return;
    }
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;

      const res = await axios.put(`${API}/users/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      login(token, { ...user, name: res.data.user.name, email: res.data.user.email });
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      toast(t("profileUpdated"), "success");
    } catch (err) {
      toast(err.response?.data?.error || t("updateFailed"), "error");
    }
    setLoading(false);
  };

  // Initials avatar
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : "—";

  return (
    <div className="container">
      <h1 className="page-title">👤 {t("myProfile")}</h1>

      <div className="profile-layout">
        {/* Left: Avatar + Stats */}
        <div className="profile-sidebar">
          <div className="profile-avatar-card">
            <div className="profile-avatar">{initials}</div>
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
            {user?.role === "admin" && (
              <span className="profile-role-badge">⚙️ Admin</span>
            )}
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <span className="stat-icon">📦</span>
              <span className="stat-value">
                {loadingStats ? "—" : ordersCount}
              </span>
              <span className="stat-label">{t("totalOrders")}</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">❤️</span>
              <span className="stat-value">{favorites.length}</span>
              <span className="stat-label">{t("favorites")}</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📅</span>
              <span className="stat-value stat-value-sm">{memberSince}</span>
              <span className="stat-label">{t("memberSince")}</span>
            </div>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="profile-form-card">
          <h3 style={{ marginBottom: "1.5rem", color: "var(--text)", fontWeight: 700, fontSize: "1.1rem" }}>
            ✏️ {t("editProfile")}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t("fullName")}</label>
              <input
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t("email")}</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="profile-divider">
              <span>{t("changePassword")}</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t("newPassword")}</label>
                <input
                  type="password"
                  className="form-control"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={t("leaveBlank")}
                  minLength={form.password ? 6 : undefined}
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t("confirmPassword")}</label>
                <input
                  type="password"
                  className="form-control"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder={t("leaveBlank")}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ marginTop: "0.5rem" }}
            >
              {loading ? "⏳ Saving..." : `💾 ${t("saveChanges")}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
