import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguage }   from "../context/LanguageContext";
import { useFavorites }  from "../context/FavoritesContext";
import { useToast }      from "../context/ToastContext";
import { ProductsGridSkeleton } from "./Skeleton";

const API = import.meta.env.VITE_API_URL;
const PLACEHOLDER = "https://placehold.co/400x300/7c3aed/ffffff?text=No+Image";

const CAT_ICONS = {
  Electronics: "💻", Clothing: "👗", Books: "📚",
  "Home & Garden": "🏡", default: "📦",
};

const Home = ({ onAddToCart }) => {
  const { t }                          = useLanguage();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast }                      = useToast();

  const [products,         setProducts]         = useState([]);
  const [categories,       setCategories]       = useState([]);
  const [search,           setSearch]           = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page,             setPage]             = useState(1);
  const [totalPages,       setTotalPages]       = useState(1);
  const [total,            setTotal]            = useState(0);
  const [loading,          setLoading]          = useState(true);
  const [loadingCats,      setLoadingCats]      = useState(true);

  useEffect(() => {
    axios.get(`${API}/category`)
      .then((r) => setCategories(r.data))
      .catch(() => {})
      .finally(() => setLoadingCats(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (search)           params.search     = search;
    if (selectedCategory) params.categoryId = selectedCategory;
    axios.get(`${API}/products`, { params })
      .then((r) => {
        setProducts(r.data.products);
        setTotalPages(r.data.totalPages);
        setTotal(r.data.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, selectedCategory, page]);

  const handleFavorite = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const was = isFavorite(product._id);
    toggleFavorite(product);
    toast(
      was ? `"${product.name}" ${t("removedFromFav")}` : `"${product.name}" ${t("addedToFav")}`,
      was ? "info" : "success"
    );
  };

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="container hero-body">
          <div className="hero-text">
            <div className="hero-badge">✨ New Arrivals Every Week</div>
            <h1>{t("heroTitle")}</h1>
            <p>{t("heroSubtitle")}</p>
            <div className="hero-cta">
              <button
                className="btn-hero-primary"
                onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                🛍 {t("allCategories")}
              </button>
              <Link to="/register">
                <button className="btn-hero-secondary">
                  {t("signUp")} →
                </button>
              </Link>
            </div>
          </div>
          <div className="hero-badges-row">
            {[["🚀", "Fast Delivery", "24–48 hrs"], ["🔒", "Secure", "SSL Encrypted"], ["↩", "Easy Returns", "30-day policy"], ["⭐", "Top Rated", "50k+ reviews"]].map(([icon, label, sub]) => (
              <div key={label} className="hero-badge-card">
                <span className="hbc-icon">{icon}</span>
                <span className="hbc-label">{label}</span>
                <span className="hbc-sub">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">

        {/* ── CATEGORIES SHOWCASE ── */}
        {!loadingCats && categories.length > 0 && (
          <section className="cats-section">
            <div className="section-header">
              <h2 className="section-title">
                {t("allCategories")}
              </h2>
            </div>
            <div className="cats-grid">
              <button
                className={`cat-card ${selectedCategory === "" ? "active" : ""}`}
                onClick={() => { setSelectedCategory(""); setPage(1); }}
              >
                <span className="cat-icon">🛍</span>
                <span className="cat-name">All</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`cat-card ${selectedCategory === cat._id ? "active" : ""}`}
                  onClick={() => { setSelectedCategory(cat._id); setPage(1); }}
                >
                  <span className="cat-icon">{CAT_ICONS[cat.title] || CAT_ICONS.default}</span>
                  <span className="cat-name">{cat.title}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── SEARCH & FILTER ── */}
        <div className="search-filter" id="products-section">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
          >
            <option value="">{t("allCategories")}</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* ── HEADER ── */}
        <div className="section-header">
          <h2 className="section-title">
            {selectedCategory
              ? categories.find((c) => c._id === selectedCategory)?.title
              : t("allCategories")}
          </h2>
          {!loading && (
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
              {total} {total === 1 ? "product" : "products"}
            </span>
          )}
        </div>

        {/* ── PRODUCTS ── */}
        {loading ? (
          <ProductsGridSkeleton count={8} />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🔎</span>
            <h3>{t("noProducts")}</h3>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.map((product) => (
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
                      className={`heart-btn ${isFavorite(product._id) ? "active" : ""}`}
                      onClick={(e) => handleFavorite(e, product)}
                    >
                      {isFavorite(product._id) ? "❤️" : "🤍"}
                    </button>
                    {product.stock === 0 && (
                      <span className="out-of-stock-badge">{t("outOfStock")}</span>
                    )}
                    {product.stock > 0 && product.stock <= 5 && (
                      <span className="low-stock-badge">🔥 Only {product.stock} left!</span>
                    )}
                  </div>
                  <div className="card-body">
                    <span className="card-category">{product.categoryId?.title || "—"}</span>
                    <Link to={`/products/${product._id}`}>
                      <h3 className="card-name">{product.name}</h3>
                    </Link>
                    <p className="card-price">${product.price.toFixed(2)}</p>
                    <p className={`card-stock ${product.stock > 0 ? "in" : "out"}`}>
                      {product.stock > 0 ? `✓ ${t("inStock")} (${product.stock})` : `✗ ${t("outOfStock")}`}
                    </p>
                    <button
                      className="card-btn"
                      disabled={product.stock === 0}
                      onClick={() => onAddToCart(product)}
                    >
                      {product.stock > 0 ? `🛒 ${t("addToCart")}` : t("outOfStock")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
