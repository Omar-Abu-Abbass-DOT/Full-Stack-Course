import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Product form state
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "", description: "", price: "", categoryId: "", stock: "", imageUrl: "",
  });

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, ordRes] = await Promise.all([
        axios.get(`${API}/products?limit=100`),
        axios.get(`${API}/category`),
        axios.get(`${API}/orders`, { headers }),
      ]);
      setProducts(prodRes.data.products);
      setCategories(catRes.data);
      setOrders(ordRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setProductForm({ name: "", description: "", price: "", categoryId: "", stock: "", imageUrl: "" });
    setEditingProduct(null);
    setError("");
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct}`, productForm, { headers });
      } else {
        await axios.post(`${API}/products`, productForm, { headers });
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save product");
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product._id);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId?._id || product.categoryId,
      stock: product.stock,
      imageUrl: product.imageUrl || "",
    });
  };

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`, { headers });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete product");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(`${API}/orders/${orderId}/status`, { status }, { headers });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="container">
      <h2 style={{ marginBottom: "1.5rem", color: "#1a1a2e" }}>Admin Dashboard</h2>

      <div className="admin-tabs">
        <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>
          Products
        </button>
        <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
          Orders
        </button>
      </div>

      {activeTab === "products" && (
        <>
          <div className="admin-form">
            <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={handleProductSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="submit" className="btn btn-primary" style={{ width: "auto" }}>
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                {editingProduct && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.categoryId?.title || "N/A"}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => editProduct(product)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(product._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activeTab === "orders" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id.slice(-8)}</td>
                <td>{order.user?.name || "N/A"}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    style={{ padding: "0.4rem", borderRadius: "6px", border: "1px solid #ddd" }}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
