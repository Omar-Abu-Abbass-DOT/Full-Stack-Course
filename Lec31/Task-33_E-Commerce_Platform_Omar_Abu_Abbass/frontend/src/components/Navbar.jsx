import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ cartCount }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">ShopZone</Link>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>

        {user ? (
          <>
            <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
              Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
            {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
