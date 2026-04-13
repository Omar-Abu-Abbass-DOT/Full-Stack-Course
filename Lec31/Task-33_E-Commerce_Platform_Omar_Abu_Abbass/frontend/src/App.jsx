import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navbar cartCount={cartCount} />
      <Routes>
        <Route path="/" element={<Home onAddToCart={addToCart} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:id" element={<ProductDetail onAddToCart={addToCart} />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart cart={cart} setCart={setCart} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
