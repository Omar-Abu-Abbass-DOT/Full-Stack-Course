import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const Cart = ({ cart, setCart }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;
    setCart(cart.map((item) =>
      item._id === productId ? { ...item, quantity: newQty } : item
    ));
  };

  const removeItem = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
    try {
      const items = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      await axios.post(`${API}/orders`, { items }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart([]);
      navigate("/orders");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to place order");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="cart-container">
          <h2>Shopping Cart</h2>
          <div className="empty-state">Your cart is empty</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-container">
        <h2>Shopping Cart</h2>

        {cart.map((item) => (
          <div className="cart-item" key={item._id}>
            <img
              src={item.imageUrl || "https://via.placeholder.com/80?text=No+Image"}
              alt={item.name}
            />
            <div className="item-info">
              <h4>{item.name}</h4>
              <p className="item-price">${item.price.toFixed(2)}</p>
            </div>
            <div className="item-actions">
              <div className="quantity-selector">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
              </div>
              <p style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</p>
              <button className="btn btn-danger btn-sm" onClick={() => removeItem(item._id)}>
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="cart-total">
          <p className="total-price">Total: ${totalPrice.toFixed(2)}</p>
          <button className="btn btn-secondary" onClick={placeOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
