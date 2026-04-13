import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const Home = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (selectedCategory) params.categoryId = selectedCategory;

      const res = await axios.get(`${API}/products`, { params });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/category`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, page]);

  return (
    <div className="container">
      <div className="home-header">
        <h1>Welcome to ShopZone</h1>
        <p>Discover the best products at amazing prices</p>
      </div>

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.title}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products found</div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <div className="product-card" key={product._id}>
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={product.name}
                  />
                </Link>
                <div className="card-body">
                  <Link to={`/products/${product._id}`}>
                    <h3>{product.name}</h3>
                  </Link>
                  <p className="category-tag">
                    {product.categoryId?.title || "Uncategorized"}
                  </p>
                  <p className="price">${product.price.toFixed(2)}</p>
                  <p className={`stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                  </p>
                  <button
                    className="btn btn-primary"
                    disabled={product.stock === 0}
                    onClick={() => onAddToCart(product)}
                  >
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={p === page ? "active" : ""}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
