import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";

const PLACEHOLDER = "https://placehold.co/400x300/7c3aed/ffffff?text=No+Image";

const Favorites = ({ onAddToCart }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleRemove = (product) => {
    toggleFavorite(product);
    toast(`"${product.name}" ${t("removedFromFav")}`, "info");
  };

  const handleAddToCart = (product) => {
    onAddToCart(product);
    toast(`"${product.name}" ${t("addedToCart")}`, "success");
  };

  return (
    <div className="container">
      <h1 className="page-title">❤️ {t("favorites")}</h1>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🤍</span>
          <h3>{t("noFavorites")}</h3>
          <p>{t("noFavoritesHint")}</p>
          <Link to="/">
            <button className="btn btn-primary" style={{ width: "auto", marginTop: "1.5rem" }}>
              🛍 {t("startShopping")}
            </button>
          </Link>
        </div>
      ) : (
        <>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            {favorites.length} {favorites.length === 1 ? "item" : "items"} saved
          </p>
          <div className="products-grid">
            {favorites.map((product) => (
              <div className="product-card" key={product._id}>
                <div className="product-card-img">
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={product.imageUrl || PLACEHOLDER}
                      alt={product.name}
                      onError={(e) => { e.target.src = PLACEHOLDER; }}
                    />
                  </Link>
                  <button
                    className="heart-btn active"
                    onClick={() => handleRemove(product)}
                    title="Remove from favorites"
                  >
                    ❤️
                  </button>
                  {product.stock === 0 && (
                    <span className="out-of-stock-badge">{t("outOfStock")}</span>
                  )}
                </div>

                <div className="card-body">
                  <span className="card-category">{product.categoryId?.title || "—"}</span>
                  <Link to={`/products/${product._id}`}>
                    <h3 className="card-name">{product.name}</h3>
                  </Link>
                  <p className="card-price">${product.price.toFixed(2)}</p>
                  <p className={`card-stock ${product.stock > 0 ? "in" : "out"}`}>
                    {product.stock > 0 ? `✓ ${t("inStock")}` : `✗ ${t("outOfStock")}`}
                  </p>
                  <button
                    className="card-btn"
                    disabled={product.stock === 0}
                    onClick={() => handleAddToCart(product)}
                  >
                    {product.stock > 0 ? `🛒 ${t("addToCart")}` : t("outOfStock")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;
