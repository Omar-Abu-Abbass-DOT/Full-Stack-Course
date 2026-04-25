import { useState, useEffect } from "react";
import { useAuth }     from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useToast }    from "../context/ToastContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const EMPTY_PRODUCT  = { name: "", description: "", price: "", categoryId: "", stock: "", imageUrl: "" };
const EMPTY_CATEGORY = { title: "", description: "", imageUrl: "" };

const AdminDashboard = () => {
  const { token }  = useAuth();
  const { t }      = useLanguage();
  const { toast }  = useToast();
  const headers    = { Authorization: `Bearer ${token}` };

  const [activeTab,  setActiveTab]  = useState("overview");
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  const [editingProduct,  setEditingProduct]  = useState(null);
  const [productForm,     setProductForm]     = useState(EMPTY_PRODUCT);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm,    setCategoryForm]    = useState(EMPTY_CATEGORY);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, oRes] = await Promise.all([
        axios.get(`${API}/products?limit=200`),
        axios.get(`${API}/category`),
        axios.get(`${API}/orders`, { headers }),
      ]);
      setProducts(pRes.data.products);
      setCategories(cRes.data);
      setOrders(oRes.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // Derived stats
  const totalRevenue   = orders.reduce((s, o) => s + o.totalPrice, 0);
  const pendingOrders  = orders.filter((o) => o.status === "pending").length;
  const outOfStock     = products.filter((p) => p.stock === 0).length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  // ── Products ─────────────────────────────────────────────────
  const resetProduct = () => { setProductForm(EMPTY_PRODUCT); setEditingProduct(null); setError(""); };
  const submitProduct = async (e) => {
    e.preventDefault(); setError("");
    try {
      editingProduct
        ? await axios.put(`${API}/products/${editingProduct}`, productForm, { headers })
        : await axios.post(`${API}/products`, productForm, { headers });
      resetProduct(); fetchAll();
      toast(editingProduct ? "Product updated ✅" : "Product added ✅", "success");
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to save product";
      setError(msg); toast(msg, "error");
    }
  };
  const startEditProduct = (p) => {
    setEditingProduct(p._id);
    setProductForm({ name: p.name, description: p.description, price: p.price, categoryId: p.categoryId?._id || p.categoryId, stock: p.stock, imageUrl: p.imageUrl || "" });
    setActiveTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try { await axios.delete(`${API}/products/${id}`, { headers }); fetchAll(); toast("Product deleted", "info"); }
    catch (err) { toast(err.response?.data?.error || "Failed to delete", "error"); }
  };

  // ── Categories ────────────────────────────────────────────────
  const resetCategory = () => { setCategoryForm(EMPTY_CATEGORY); setEditingCategory(null); setError(""); };
  const submitCategory = async (e) => {
    e.preventDefault(); setError("");
    try {
      editingCategory
        ? await axios.put(`${API}/category/${editingCategory}`, categoryForm, { headers })
        : await axios.post(`${API}/category`, categoryForm, { headers });
      resetCategory(); fetchAll();
      toast(editingCategory ? "Category updated ✅" : "Category added ✅", "success");
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to save category";
      setError(msg); toast(msg, "error");
    }
  };
  const startEditCategory = (c) => {
    setEditingCategory(c._id);
    setCategoryForm({ title: c.title, description: c.description || "", imageUrl: c.imageUrl || "" });
    setActiveTab("categories");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    try { await axios.delete(`${API}/category/${id}`, { headers }); fetchAll(); toast("Category deleted", "info"); }
    catch (err) { toast(err.response?.data?.error || "Failed to delete", "error"); }
  };

  // ── Orders ─────────────────────────────────────────────────────
  const updateStatus = async (orderId, status) => {
    try { await axios.patch(`${API}/orders/${orderId}/status`, { status }, { headers }); fetchAll(); toast(`Status → ${status} ✅`, "success"); }
    catch (err) { toast(err.response?.data?.error || "Failed to update", "error"); }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-wrap"><div className="spinner" /><span>{t("loading")}</span></div>
      </div>
    );
  }

  const tabs = [
    { key: "overview",   label: "📊 Overview"                             },
    { key: "products",   label: `🛍 ${t("products")} (${products.length})` },
    { key: "categories", label: `📂 ${t("categories")} (${categories.length})` },
    { key: "orders",     label: `📦 ${t("orders")} (${orders.length})`    },
  ];

  return (
    <div className="container">
      <h1 className="page-title">⚙️ {t("adminDashboard")}</h1>

      {/* Tabs */}
      <div className="admin-tabs">
        {tabs.map(({ key, label }) => (
          <button key={key} className={`admin-tab-btn ${activeTab === key ? "active" : ""}`} onClick={() => setActiveTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && (
        <>
          <div className="admin-stats-grid">
            <div className="admin-stat-card purple">
              <div className="asc-icon">💰</div>
              <div className="asc-body">
                <p className="asc-value">${totalRevenue.toFixed(2)}</p>
                <p className="asc-label">Total Revenue</p>
              </div>
            </div>
            <div className="admin-stat-card blue">
              <div className="asc-icon">📦</div>
              <div className="asc-body">
                <p className="asc-value">{orders.length}</p>
                <p className="asc-label">Total Orders</p>
              </div>
            </div>
            <div className="admin-stat-card green">
              <div className="asc-icon">🛍</div>
              <div className="asc-body">
                <p className="asc-value">{products.length}</p>
                <p className="asc-label">Total Products</p>
              </div>
            </div>
            <div className="admin-stat-card amber">
              <div className="asc-icon">⏳</div>
              <div className="asc-body">
                <p className="asc-value">{pendingOrders}</p>
                <p className="asc-label">Pending Orders</p>
              </div>
            </div>
            <div className="admin-stat-card teal">
              <div className="asc-icon">✅</div>
              <div className="asc-body">
                <p className="asc-value">{deliveredOrders}</p>
                <p className="asc-label">Delivered</p>
              </div>
            </div>
            <div className="admin-stat-card red">
              <div className="asc-icon">⚠️</div>
              <div className="asc-body">
                <p className="asc-value">{outOfStock}</p>
                <p className="asc-label">Out of Stock</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ fontWeight: 700, color: "var(--text)", marginBottom: "1rem", fontSize: "1.05rem" }}>
              🕒 Recent Orders
            </h3>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o._id}>
                      <td style={{ fontFamily: "monospace", fontSize: "0.82rem" }}>#{o._id.slice(-8).toUpperCase()}</td>
                      <td style={{ fontWeight: 600 }}>{o.user?.name || "—"}</td>
                      <td style={{ fontWeight: 700, color: "var(--primary)" }}>${o.totalPrice.toFixed(2)}</td>
                      <td><span className={`status-badge status-${o.status}`}>{o.status}</span></td>
                      <td>
                        <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}
                          className="form-control" style={{ padding: "0.35rem 0.6rem", fontSize: "0.82rem", borderRadius: "8px" }}>
                          {["pending","shipped","delivered","cancelled"].map((s) => <option key={s} value={s}>{t(s)}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alert */}
          {products.filter((p) => p.stock <= 5).length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <h3 style={{ fontWeight: 700, color: "var(--danger)", marginBottom: "1rem", fontSize: "1.05rem" }}>
                🔥 Low Stock Alert
              </h3>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Product</th><th>Category</th><th>Stock</th><th>Action</th></tr></thead>
                  <tbody>
                    {products.filter((p) => p.stock <= 5).map((p) => (
                      <tr key={p._id}>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td>{p.categoryId?.title || "—"}</td>
                        <td>
                          <span style={{ padding: "0.2rem 0.6rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 700, background: p.stock === 0 ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)", color: p.stock === 0 ? "var(--danger)" : "var(--warning)" }}>
                            {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                          </span>
                        </td>
                        <td><button className="btn btn-secondary btn-sm" onClick={() => startEditProduct(p)}>✏️ Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── PRODUCTS TAB ── */}
      {activeTab === "products" && (
        <>
          <div className="admin-form-card">
            <h3>{editingProduct ? `✏️ ${t("editProduct")}` : `➕ ${t("addProduct")}`}</h3>
            {error && <div className="alert alert-error">⚠️ {error}</div>}
            <form onSubmit={submitProduct}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t("name")}</label>
                  <input className="form-control" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">{t("price")}</label>
                  <input type="number" step="0.01" min="0" className="form-control" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t("categories")}</label>
                  <select className="form-control" value={productForm.categoryId} onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })} required>
                    <option value="">{t("selectCategory")}</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t("stock")}</label>
                  <input type="number" min="0" className="form-control" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t("imageUrl")}</label>
                <input className="form-control" value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="form-label">{t("description")}</label>
                <textarea className="form-control" rows="3" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required />
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="submit" className="btn btn-primary" style={{ width: "auto" }}>
                  {editingProduct ? "💾 Update" : "➕ Add Product"}
                </button>
                {editingProduct && <button type="button" className="btn btn-secondary" onClick={resetProduct}>{t("cancel")}</button>}
              </div>
            </form>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>{t("name")}</th><th>{t("price")}</th><th>{t("categories")}</th><th>{t("stock")}</th><th>{t("actions")}</th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td style={{ color: "var(--primary)", fontWeight: 700 }}>${p.price.toFixed(2)}</td>
                    <td>{p.categoryId?.title || "—"}</td>
                    <td>
                      <span style={{ padding: "0.2rem 0.6rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 700, background: p.stock > 0 ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", color: p.stock > 0 ? "var(--success)" : "var(--danger)" }}>{p.stock}</span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => startEditProduct(p)}>✏️ {t("edit")}</button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p._id)}>🗑 {t("delete")}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── CATEGORIES TAB ── */}
      {activeTab === "categories" && (
        <>
          <div className="admin-form-card">
            <h3>{editingCategory ? `✏️ ${t("editCategory")}` : `➕ ${t("addCategory")}`}</h3>
            {error && <div className="alert alert-error">⚠️ {error}</div>}
            <form onSubmit={submitCategory}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t("name")}</label>
                  <input className="form-control" value={categoryForm.title} onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">{t("imageUrl")}</label>
                  <input className="form-control" value={categoryForm.imageUrl} onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t("description")}</label>
                <textarea className="form-control" rows="2" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="submit" className="btn btn-primary" style={{ width: "auto" }}>
                  {editingCategory ? "💾 Update" : "➕ Add Category"}
                </button>
                {editingCategory && <button type="button" className="btn btn-secondary" onClick={resetCategory}>{t("cancel")}</button>}
              </div>
            </form>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>{t("name")}</th><th>{t("description")}</th><th>Created By</th><th>{t("actions")}</th></tr></thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 700 }}>📂 {c.title}</td>
                    <td style={{ color: "var(--text-muted)" }}>{c.description || "—"}</td>
                    <td>{c.createdBy?.name || "—"}</td>
                    <td>
                      <div className="admin-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => startEditCategory(c)}>✏️ {t("edit")}</button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteCategory(c._id)}>🗑 {t("delete")}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── ORDERS TAB ── */}
      {activeTab === "orders" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Order ID</th><th>{t("customer")}</th><th>{t("orderTotal")}</th><th>Status</th><th>{t("updateStatus")}</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td style={{ fontFamily: "monospace", fontSize: "0.82rem" }}>#{o._id.slice(-10).toUpperCase()}</td>
                  <td style={{ fontWeight: 600 }}>{o.user?.name || "—"}</td>
                  <td style={{ fontWeight: 700, color: "var(--primary)" }}>${o.totalPrice.toFixed(2)}</td>
                  <td><span className={`status-badge status-${o.status}`}>{o.status}</span></td>
                  <td>
                    <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="form-control" style={{ padding: "0.4rem 0.75rem", fontSize: "0.85rem", borderRadius: "8px" }}>
                      {["pending","shipped","delivered","cancelled"].map((s) => <option key={s} value={s}>{t(s)}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
