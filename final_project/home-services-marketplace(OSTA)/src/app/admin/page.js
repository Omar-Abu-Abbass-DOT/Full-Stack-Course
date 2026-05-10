"use client";

import { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import Spinner from "@/components/Spinner";
import { useLocale } from "@/contexts/LocaleContext";

export default function AdminDashboard() {
  const { t } = useLocale();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/users?limit=1"),
      api.get("/services?limit=1"),
      api.get("/bookings?limit=1"),
      api.get("/categories?limit=1"),
      api.get("/reviews?limit=1"),
    ])
      .then(([users, services, bookings, categories, reviews]) => {
        setStats({
          users: users.total,
          services: services.total,
          bookings: bookings.total,
          categories: categories.total,
          reviews: reviews.total,
          averageRating: reviews.averageRating,
        });
      })
      .catch(() => setStats({ users: 0, services: 0, bookings: 0, categories: 0, reviews: 0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <h2 className="text-xl font-bold mb-4">{t("admin.overview")}</h2>
      <div className="grid grid-3 mb-6">
        <div className="stat-card">
          <div className="label">{t("admin.totalUsers")}</div>
          <div className="value">{stats?.users ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="label">{t("admin.activeServices")}</div>
          <div className="value">{stats?.services ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="label">{t("admin.totalBookings")}</div>
          <div className="value">{stats?.bookings ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="label">{t("admin.categories")}</div>
          <div className="value">{stats?.categories ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="label">{t("admin.totalReviews")}</div>
          <div className="value">{stats?.reviews ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="label">{t("admin.avgRating")}</div>
          <div className="value">
            {stats?.averageRating ? stats.averageRating.toFixed(1) : "—"}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="font-bold mb-2">{t("admin.quickLinks")}</h3>
          <p className="text-muted text-sm">
            {t("admin.quickLinksDesc")}
          </p>
        </div>
      </div>
    </>
  );
}
