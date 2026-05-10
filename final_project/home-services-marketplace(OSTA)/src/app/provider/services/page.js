"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import api, { buildQuery } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";

function ProviderServicesContent() {
  const { user } = useAuth();
  const toast = useToast();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const qs = buildQuery({ provider: user.id, page, limit: 10 });
      const data = await api.get(`/services${qs}`);
      setServices(data.services || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, page, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const onDelete = async (id) => {
    if (!confirm("Delete this service?")) return;
    try {
      await api.del(`/services/${id}`);
      toast.success("Service deleted");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container section">
      <div className="flex justify-between items-center mb-6" style={{ flexWrap: "wrap", gap: 8 }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ marginBottom: 0 }}>My Services</h1>
          <p className="text-muted text-sm">Manage the services you offer.</p>
        </div>
        <Link href="/provider/services/new" className="btn btn-primary">
          + Add Service
        </Link>
      </div>

      {loading ? (
        <Spinner />
      ) : services.length === 0 ? (
        <EmptyState
          title="No services yet"
          message="Create your first listing to get bookings."
          action={
            <Link href="/provider/services/new" className="btn btn-primary">
              Create Service
            </Link>
          }
        />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <Link href={`/services/${s._id}`} className="font-semibold">
                        {s.title}
                      </Link>
                    </td>
                    <td><span className="badge">{s.category}</span></td>
                    <td>{s.location}</td>
                    <td>${s.price}</td>
                    <td className="text-muted text-sm">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="actions">
                        <Link
                          href={`/provider/services/${s._id}/edit`}
                          className="btn btn-outline btn-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => onDelete(s._id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}

export default function ProviderServicesPage() {
  return (
    <ProtectedRoute roles={["provider", "admin"]}>
      <ProviderServicesContent />
    </ProtectedRoute>
  );
}
