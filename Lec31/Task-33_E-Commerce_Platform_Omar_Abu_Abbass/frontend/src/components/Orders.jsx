import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API}/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [token]);

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="container">
      <h2 style={{ marginBottom: "1.5rem", color: "#1a1a2e" }}>My Orders</h2>

      {orders.length === 0 ? (
        <div className="empty-state">No orders yet</div>
      ) : (
        <div className="orders-container">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <span className="order-id">Order #{order._id.slice(-8)}</span>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className={`status-badge status-${order.status}`}>
                  {order.status}
                </span>
              </div>
              <ul className="order-items">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} x {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="order-total">Total: ${order.totalPrice.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
