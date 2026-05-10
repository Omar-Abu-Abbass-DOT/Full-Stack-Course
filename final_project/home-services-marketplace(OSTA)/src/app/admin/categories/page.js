"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";

export default function AdminCategoriesPage() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", image: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get("/categories?limit=100");
      setCategories(data.categories || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (cat) => {
    setEditing(cat._id);
    setForm({
      name: cat.name,
      description: cat.description || "",
      image: cat.image || "",
    });
  };

  const startCreate = () => {
    setEditing("new");
    setForm({ name: "", description: "", image: "" });
  };

  const cancel = () => {
    setEditing(null);
    setForm({ name: "", description: "", image: "" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing === "new") {
        await api.post("/categories", form);
        toast.success("Category created");
      } else {
        await api.put(`/categories/${editing}`, form);
        toast.success("Category updated");
      }
      cancel();
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.del(`/categories/${id}`);
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
          Categories ({categories.length})
        </h2>
        {!editing && (
          <button onClick={startCreate} className="btn btn-primary btn-sm">
            + New Category
          </button>
        )}
      </div>

      {editing && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="font-bold mb-3">
              {editing === "new" ? "New Category" : "Edit Category"}
            </h3>
            <form onSubmit={onSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    className="form-control"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editing === "new" ? "Create" : "Save"}
                </button>
                <button type="button" onClick={cancel} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : categories.length === 0 ? (
        <EmptyState title="No categories" />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td className="font-semibold">{c.name}</td>
                  <td className="text-muted">{c.description || "—"}</td>
                  <td className="text-muted text-sm">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        onClick={() => startEdit(c)}
                        className="btn btn-outline btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(c._id)}
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
      )}
    </>
  );
}
