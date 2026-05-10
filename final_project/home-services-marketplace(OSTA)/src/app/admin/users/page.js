"use client";

import { useCallback, useEffect, useState } from "react";
import api, { buildQuery } from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";

const ROLES = ["customer", "provider", "admin"];

export default function AdminUsersPage() {
  const toast = useToast();
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildQuery({ search, role: roleFilter, page, limit: 10 });
      const data = await api.get(`/admin/users${qs}`);
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, page, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const updateRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}`, { role });
      toast.success("Role updated");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      await api.del(`/admin/users/${id}`);
      toast.success("User deleted");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4" style={{ flexWrap: "wrap", gap: 8 }}>
        <h2 className="text-xl font-bold" style={{ marginBottom: 0 }}>
          Users ({total})
        </h2>
      </div>

      <div className="filters" style={{ gridTemplateColumns: "2fr 1fr auto" }}>
        <input
          className="form-control"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <select
          className="form-control"
          value={roleFilter}
          onChange={(e) => {
            setPage(1);
            setRoleFilter(e.target.value);
          }}
        >
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="font-semibold">{u.name}</td>
                    <td className="text-muted">{u.email}</td>
                    <td>
                      <select
                        className="form-control"
                        style={{ padding: "0.3rem 0.5rem", fontSize: "0.85rem", maxWidth: 130 }}
                        value={u.role}
                        onChange={(e) => updateRole(u._id, e.target.value)}
                        disabled={u._id === me?.id}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-muted text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          onClick={() => onDelete(u._id)}
                          className="btn btn-danger btn-sm"
                          disabled={u._id === me?.id}
                          title={u._id === me?.id ? "Cannot delete self" : "Delete"}
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
    </>
  );
}
