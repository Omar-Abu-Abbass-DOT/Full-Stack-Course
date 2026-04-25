import { useNavigate, Link } from "react-router-dom";
import { useAuth }     from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useToast }    from "../context/ToastContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const PLACEHOLDER = "https://placehold.co/100x100/7c3aed/ffffff?text=?";

const Cart = ({ cart, setCart }) => {
  const { token }    = useAuth();
  const { t }        = useLanguage();
  const { toast }    = useToast();
  const navigate     = useNavigate();

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity: qty } : item))
    );
  };

  const remove = (id, name) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
    toast(`"${name}" removed from cart`, "info");
  };

  const subtotal = cart.reduce((s, item) => s + item.price * item.quantity, 0);
  const shipping  = subtotal > 0 ? 5.99 : 0;
  const total     = subtotal + shipping;

  const placeOrder = async () => {
    try {
      const items = cart.map(({ _id, quantity }) => ({ product: _id, quantity }));
      await axios.post(`${API}/orders`, { items }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([]);
      toast("Order placed successfully! 🎉", "success");
      navigate("/orders");
    } catch (err) {
      toast(err.response?.data?.error || "Failed to place order. Please try again.", "error");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="empty-state" style={{ marginTop: "3rem" }}>
          <span className="empty-state-icon">🛒</span>
          <h3>{t("emptyCart")}</h3>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/">
            <button className="btn btn-primary" style={{ width: "auto", marginTop: "1.5rem" }}>
              🛍 Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">🛒 {t("shoppingCart")}</h1>

      <div className="cart-wrapper">
        {/* Items */}
        <div className="cart-card">
          <h2>{cart.length} {cart.length === 1 ? "item" : "items"}</h2>

          {cart.map((item) => (
            <div className="cart-item" key={item._id}>
              <img
                src={item.imageUrl || PLACEHOLDER}
                alt={item.name}
                onError={(e) => { e.target.src = PLACEHOLDER; }}
              />
              <div className="cart-item-info">
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-price">${item.price.toFixed(2)} each</p>
              </div>
              <div className="cart-item-actions">
                <p className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</p>
                <div className="cart-qty-row">
                  <button className="cart-qty-btn" onClick={() => updateQty(item._id, item.quantity - 1)}>−</button>
                  <span className="cart-qty-num">{item.quantity}</span>
                  <button className="cart-qty-btn" onClick={() => updateQty(item._id, item.quantity + 1)}>+</button>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => remove(item._id, item.name)}>
                  🗑 {t("remove")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>{t("subtotal")}</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
          <div className="summary-row total">
            <span>{t("total")}</span>
            <span className="summary-total-value">${total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary" onClick={placeOrder} style={{ marginTop: "1.5rem" }}>
            ✅ {t("placeOrder")}
          </button>
          <Link to="/">
            <button className="btn btn-secondary" style={{ marginTop: "0.75rem", width: "100%" }}>
              ← Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
