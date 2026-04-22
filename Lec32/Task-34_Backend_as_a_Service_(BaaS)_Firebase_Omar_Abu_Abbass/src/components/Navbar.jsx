import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="flame">🔥</span> File Vault
      </Link>

      {user && (
        <div className="navbar-links">
          <NavLink to="/upload" className="nav-link">
            Upload
          </NavLink>
          <NavLink to="/files" className="nav-link">
            My Files
          </NavLink>
          <span className="nav-user">
            {user.displayName || user.email}
          </span>
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
