import { useState, useEffect } from "react";
import { useAuth }     from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { OrderCardSkeleton } from "./Skeleton";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const STATUS_MAP = {
  pending:   { icon: "🕐", label: "pending"   },
  shipped:   { icon: "🚚", label: "shipped"   },
  delivered: { icon: "✅", label: "delivered" },
  cancelled: { icon: "❌", label: "cancelled" },
};

const Orders = () => {
  const { token }    = useAuth();
  const { t }        = useLanguage();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/orders/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="container">
      <h1 className="page-title">📦 {t("myOrdersTitle")}</h1>

      {loading ? (
        <div className="orders-grid">
          {Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">📭</span>
          <h3>{t("noOrders")}</h3>
          <p>Your completed orders will appear here.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => {
            const s = STATUS_MAP[order.status] || STATUS_MAP.pending;
            return (
              <div className="order-card" key={order._id}>
                <div className="order-header">
                  <span className="order-id">#{order._id.slice(-10).toUpperCase()}</span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </span>
                  <span className={`status-badge status-${order.status}`}>
                    {s.icon} {t(s.label)}
                  </span>
                </div>

                <ul className="order-items-list">
                  {order.items.map((item, i) => (
                    <li key={i} className="order-item-row">
                      <span>{item.name} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>

                <div className="order-total-row">
                  <span className="order-total-label">{t("orderTotal")}</span>
                  <span className="order-total-value">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
