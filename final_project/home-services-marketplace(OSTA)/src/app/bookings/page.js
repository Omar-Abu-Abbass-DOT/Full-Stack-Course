"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import api, { buildQuery } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useLocale } from "@/contexts/LocaleContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatusBadge from "@/components/StatusBadge";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";

const STATUSES = ["pending", "accepted", "completed", "cancelled"];

function BookingsContent() {
  const { user } = useAuth();
  const toast = useToast();
  const { t, tStatus, tServiceTitle } = useLocale();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildQuery({ page, limit: 10, status: statusFilter });
      const data = await api.get(`/bookings${qs}`);
      setBookings(data.bookings || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      toast.success(`Booking ${status}`);
      await load();
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  const removeBooking = async (id) => {
    if (!confirm("Delete this booking?")) return;
    try {
      await api.del(`/bookings/${id}`);
      toast.success("Booking deleted");
      await load();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  const isProvider = user?.role === "provider";
  const isAdmin = user?.role === "admin";

  return (
    <div className="container section">
      <div className="flex justify-between items-center mb-6" style={{ flexWrap: "wrap", gap: 8 }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ marginBottom: 0 }}>
            {isProvider ? t("bookings.titleProvider") : isAdmin ? t("bookings.titleAdmin") : t("bookings.titleCustomer")}
          </h1>
          <p className="text-muted text-sm">
            {isProvider
              ? t("bookings.subtitleProvider")
              : isAdmin
              ? t("bookings.subtitleAdmin")
              : t("bookings.subtitleCustomer")}
          </p>
        </div>

        <select
          className="form-control"
          style={{ maxWidth: 200 }}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">{t("bookings.allStatus")}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {tStatus(s)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner label={t("action.loading")} />
      ) : bookings.length === 0 ? (
        <EmptyState
          title={t("bookings.empty")}
          message={
            isProvider
              ? t("bookings.emptyProvider")
              : t("bookings.emptyCustomer")
          }
          action={!isProvider && <Link href="/services" className="btn btn-primary">{t("home.hero.browse")}</Link>}
        />
      ) : (
        <>
          {bookings.map((b) => (
            <div key={b._id} className="list-item">
              <div className="flex justify-between items-center" style={{ flexWrap: "wrap", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div className="flex items-center gap-2 mb-2" style={{ flexWrap: "wrap" }}>
                    <Link
                      href={`/services/${b.service?._id}`}
                      className="font-bold text-lg"
                    >
                      {b.service?.title ? tServiceTitle(b.service.title) : t("nav.services")}
                    </Link>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="text-sm text-muted">
                    📅 {new Date(b.date).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted">
                    {isProvider || isAdmin ? (
                      <>👤 {t("bookings.customer")}: {b.customer?.name} ({b.customer?.email})</>
                    ) : (
                      <>🛠 {t("bookings.providerLabel")}: {b.provider?.name}</>
                    )}
                  </div>
                  {b.service?.price !== undefined && (
                    <div className="text-sm font-semibold mt-2">
                      ${b.service.price}
                    </div>
                  )}
                </div>

                <div className="actions" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(isProvider || isAdmin) && b.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(b._id, "accepted")}
                        className="btn btn-primary btn-sm"
                      >
                        {t("bookings.accept")}
                      </button>
                      <button
                        onClick={() => updateStatus(b._id, "cancelled")}
                        className="btn btn-outline btn-sm"
                      >
                        {t("bookings.decline")}
                      </button>
                    </>
                  )}
                  {(isProvider || isAdmin) && b.status === "accepted" && (
                    <button
                      onClick={() => updateStatus(b._id, "completed")}
                      className="btn btn-success btn-sm"
                    >
                      {t("bookings.markCompleted")}
                    </button>
                  )}
                  {!isProvider && !isAdmin && (b.status === "pending" || b.status === "accepted") && (
                    <button
                      onClick={() => updateStatus(b._id, "cancelled")}
                      className="btn btn-outline btn-sm"
                    >
                      {t("bookings.cancel")}
                    </button>
                  )}
                  <button
                    onClick={() => removeBooking(b._id)}
                    className="btn btn-ghost btn-sm"
                    title={t("action.delete")}
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <BookingsContent />
    </ProtectedRoute>
  );
}
