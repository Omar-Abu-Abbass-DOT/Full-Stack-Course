import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar         from "./components/Navbar";
import Footer         from "./components/Footer";
import Home           from "./components/Home";
import Login          from "./components/Login";
import Register       from "./components/Register";
import ProductDetail  from "./components/ProductDetail";
import Cart           from "./components/Cart";
import Orders         from "./components/Orders";
import Favorites      from "./components/Favorites";
import Profile        from "./components/Profile";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound       from "./components/NotFound";
import { useToast }    from "./context/ToastContext";
import { useLanguage } from "./context/LanguageContext";

function App() {
  const [cart, setCart] = useState([]);
  const { toast }  = useToast();
  const { t }      = useLanguage();

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
    toast(`"${product.name}" ${t("addedToCart")}`, "success");
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-wrapper">
      <Navbar cartCount={cartCount} />

      <main className="app-main">
        <Routes>
          <Route path="/"             element={<Home onAddToCart={addToCart} />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />
          <Route path="/products/:id" element={<ProductDetail onAddToCart={addToCart} />} />
          <Route path="/favorites"    element={<Favorites onAddToCart={addToCart} />} />

          <Route path="/cart" element={
            <ProtectedRoute><Cart cart={cart} setCart={setCart} /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><Orders /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
