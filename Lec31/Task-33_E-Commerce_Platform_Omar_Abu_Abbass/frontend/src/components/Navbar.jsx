import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth }      from "../context/AuthContext";
import { useTheme }     from "../context/ThemeContext";
import { useLanguage }  from "../context/LanguageContext";
import { useFavorites } from "../context/FavoritesContext";

const Navbar = ({ cartCount }) => {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme }    = useTheme();
  const { lang, toggleLang, t }   = useLanguage();
  const { favorites }             = useFavorites();
  const navigate  = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo" onClick={close}>🛍 ShopZone</Link>

      {/* Hamburger */}
      <button className="hamburger" onClick={() => setMenuOpen((p) => !p)} aria-label="Menu">
        <span /><span /><span />
      </button>

      {/* Nav Links */}
      <div className={`nav-center ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-link" onClick={close}>{t("home")}</Link>

        {user ? (
          <>
            <Link to="/cart" className="nav-link cart-link" onClick={close}>
              🛒 {t("cart")}
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <Link to="/favorites" className="nav-link" onClick={close}>
              ❤️ {t("favorites")}
              {favorites.length > 0 && (
                <span className="cart-badge" style={{ background: "#ef4444" }}>
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link to="/orders"  className="nav-link" onClick={close}>📦 {t("myOrders")}</Link>
            <Link to="/profile" className="nav-link" onClick={close}>👤 {t("myProfile")}</Link>
            {isAdmin && (
              <Link to="/admin" className="nav-link" onClick={close}>⚙️ {t("admin")}</Link>
            )}
            <button className="btn-logout" onClick={handleLogout}>{t("logout")}</button>
          </>
        ) : (
          <>
            <Link to="/favorites" className="nav-link" onClick={close}>
              ❤️ {t("favorites")}
              {favorites.length > 0 && (
                <span className="cart-badge" style={{ background: "#ef4444" }}>
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link to="/login"    className="nav-link" onClick={close}>{t("login")}</Link>
            <Link to="/register" className="nav-link" onClick={close}>{t("register")}</Link>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="nav-right">
        <button className="nav-icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <button className="nav-icon-btn lang-btn" onClick={toggleLang} title="Switch language">
          {lang === "en" ? "AR" : "EN"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
