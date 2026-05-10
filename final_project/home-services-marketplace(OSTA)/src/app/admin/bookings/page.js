"use client";

import { useCallback, useEffect, useState } from "react";
import api, { buildQuery } from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";

const STATUSES = ["pending", "accepted", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildQuery({ status: statusFilter, page, limit: 10 });
      const data = await api.get(`/bookings${qs}`);
      setBookings(data.bookings || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const onDelete = async (id) => {
    if (!confirm("Delete this booking?")) return;
    try {
      await api.del(`/bookings/${id}`);
      toast.success("Deleted");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4" style={{ flexWrap: "wrap", gap: 8 }}>
        <h2 className="text-xl font-bold" style={{ marginBottom: 0 }}>
          Bookings ({total})
        </h2>
        <select
          className="form-control"
          style={{ maxWidth: 200 }}
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings" />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Provider</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td className="font-semibold">{b.service?.title}</td>
                    <td>{b.customer?.name}</td>
                    <td>{b.provider?.name}</td>
                    <td className="text-sm">
                      {new Date(b.date).toLocaleDateString()}
                    </td>
                    <td><StatusBadge status={b.status} /></td>
                    <td>
                      <button
                        onClick={() => onDelete(b._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
}
