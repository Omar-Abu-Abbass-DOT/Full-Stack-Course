import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">🛍 ShopZone</Link>
          <p className="footer-tagline">
            {lang === "ar"
              ? "متجرك الأول للتسوق الإلكتروني — جودة عالية، أسعار لا تُقارن."
              : "Your premier destination for online shopping — top quality, unbeatable prices."}
          </p>
          <div className="footer-socials">
            <a href="#" className="social-link" title="Twitter / X" aria-label="Twitter">𝕏</a>
            <a href="#" className="social-link" title="Instagram" aria-label="Instagram">📸</a>
            <a href="#" className="social-link" title="Facebook" aria-label="Facebook">f</a>
            <a href="#" className="social-link" title="WhatsApp" aria-label="WhatsApp">💬</a>
          </div>
        </div>

        {/* Shop */}
        <div className="footer-col">
          <h4>{lang === "ar" ? "التسوق" : "Shop"}</h4>
          <ul>
            <li><Link to="/">{t("home")}</Link></li>
            <li><Link to="/favorites">❤️ {t("favorites")}</Link></li>
            <li><Link to="/cart">🛒 {t("cart")}</Link></li>
            <li><Link to="/orders">📦 {t("myOrders")}</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div className="footer-col">
          <h4>{lang === "ar" ? "الحساب" : "Account"}</h4>
          <ul>
            <li><Link to="/login">{t("login")}</Link></li>
            <li><Link to="/register">{t("register")}</Link></li>
            <li><Link to="/profile">👤 {t("myProfile")}</Link></li>
          </ul>
        </div>

        {/* Info */}
        <div className="footer-col">
          <h4>{lang === "ar" ? "معلومات" : "Info"}</h4>
          <ul>
            <li><a href="#">{lang === "ar" ? "من نحن" : "About Us"}</a></li>
            <li><a href="#">{lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}</a></li>
            <li><a href="#">{lang === "ar" ? "الشروط والأحكام" : "Terms of Service"}</a></li>
            <li><a href="#">{lang === "ar" ? "تواصل معنا" : "Contact Us"}</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>© {year} ShopZone. {lang === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
        <div className="footer-badges">
          <span>🔒 SSL Secured</span>
          <span>💳 Visa / Mastercard</span>
          <span>🚀 Fast Delivery</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
