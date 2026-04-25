import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const NotFound = () => {
  const { lang } = useLanguage();

  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-number">404</div>
        <div className="notfound-emoji">🛍️</div>
        <h1>{lang === "ar" ? "عذراً، الصفحة غير موجودة" : "Oops! Page Not Found"}</h1>
        <p>
          {lang === "ar"
            ? "الصفحة التي تبحث عنها لا وجود لها أو تم نقلها."
            : "The page you're looking for doesn't exist or has been moved."}
        </p>
        <div className="notfound-actions">
          <Link to="/">
            <button className="btn btn-primary" style={{ width: "auto" }}>
              🏠 {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </button>
          </Link>
          <Link to="/cart">
            <button className="btn btn-secondary" style={{ width: "auto" }}>
              🛒 {lang === "ar" ? "السلة" : "My Cart"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
