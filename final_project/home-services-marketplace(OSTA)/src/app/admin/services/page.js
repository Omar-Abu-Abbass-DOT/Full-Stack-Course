"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import api, { buildQuery } from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";

export default function AdminServicesPage() {
  const toast = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildQuery({ search, page, limit: 10 });
      const data = await api.get(`/services${qs}`);
      setServices(data.services || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, page, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const onDelete = async (id) => {
    if (!confirm("Delete this service?")) return;
    try {
      await api.del(`/services/${id}`);
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
          Services ({total})
        </h2>
      </div>

      <div className="filters" style={{ gridTemplateColumns: "1fr" }}>
        <input
          className="form-control"
          placeholder="Search services…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {loading ? (
        <Spinner />
      ) : services.length === 0 ? (
        <EmptyState title="No services" />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Provider</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <Link
                        href={`/services/${s._id}`}
                        className="font-semibold"
                      >
                        {s.title}
                      </Link>
                      <div className="text-muted text-xs">{s.location}</div>
                    </td>
                    <td>{s.provider?.name || "—"}</td>
                    <td><span className="badge">{s.category}</span></td>
                    <td>${s.price}</td>
                    <td>
                      <button
                        onClick={() => onDelete(s._id)}
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
