import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useLanguage }  from "../context/LanguageContext";
import { useFavorites } from "../context/FavoritesContext";
import { useToast }     from "../context/ToastContext";
import { ProductDetailSkeleton } from "./Skeleton";

const API = import.meta.env.VITE_API_URL;
const PLACEHOLDER = "https://placehold.co/600x500/7c3aed/ffffff?text=No+Image";

const ProductDetail = ({ onAddToCart }) => {
  const { id }                       = useParams();
  const { t }                        = useLanguage();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast }                    = useToast();

  const [product,  setProduct]  = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleFavorite = () => {
    const alreadyFav = isFavorite(product._id);
    toggleFavorite(product);
    toast(
      alreadyFav
        ? `"${product.name}" ${t("removedFromFav")}`
        : `"${product.name}" ${t("addedToFav")}`,
      alreadyFav ? "info" : "success"
    );
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="skeleton-line" style={{ width: "120px", height: "12px", marginBottom: "1.5rem" }} />
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="empty-state">
          <span className="empty-state-icon">😕</span>
          <h3>Product not found</h3>
          <Link to="/"><button className="btn btn-primary" style={{ width: "auto", marginTop: "1rem" }}>← {t("home")}</button></Link>
        </div>
      </div>
    );
  }

  const fav = isFavorite(product._id);

  return (
    <div className="container">
      <Link to="/" className="back-link">{t("backToHome")}</Link>

      <div className="product-detail">
        {/* Image */}
        <div className="product-detail-img">
          <img
            src={product.imageUrl || PLACEHOLDER}
            alt={product.name}
            onError={(e) => { e.target.src = PLACEHOLDER; }}
          />
        </div>

        {/* Info */}
        <div>
          <p className="detail-category">📦 {product.categoryId?.title || "Uncategorized"}</p>
          <h1 className="detail-name">{product.name}</h1>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <p className="detail-price" style={{ margin: 0 }}>${product.price.toFixed(2)}</p>
            <button
              onClick={handleFavorite}
              style={{
                background: fav ? "rgba(239,68,68,0.1)" : "var(--bg)",
                border: `1.5px solid ${fav ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
                borderRadius: "10px",
                padding: "0.45rem 0.9rem",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: fav ? "#ef4444" : "var(--text-muted)",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              {fav ? "❤️" : "🤍"} {fav ? t("savedToFav") : t("addToFav")}
            </button>
          </div>

          <span className={`detail-stock ${product.stock > 0 ? "in" : "out"}`}>
            {product.stock > 0
              ? `✓ ${t("inStock")} — ${product.stock} ${t("available")}`
              : `✗ ${t("outOfStock")}`}
          </span>

          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", margin: "1.5rem 0 0.5rem" }}>
            {t("description")}
          </p>
          <div className="detail-desc">{product.description}</div>

          {product.stock > 0 && (
            <>
              <p className="quantity-label">{t("quantity")}</p>
              <div className="quantity-selector">
                <button className="qty-btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                <span className="qty-count">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <button className="btn-add-to-cart" onClick={handleAddToCart}>
                🛒 {t("addToCart")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
