import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API}/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="empty-state">Product not found</div>;

  return (
    <div className="container">
      <div className="product-detail">
        <img
          src={product.imageUrl || "https://via.placeholder.com/500x400?text=No+Image"}
          alt={product.name}
        />
        <div className="info">
          <h1>{product.name}</h1>
          <p className="category-tag">{product.categoryId?.title || "Uncategorized"}</p>
          <p className="price">${product.price.toFixed(2)}</p>
          <p className="description">{product.description}</p>
          <p className={`stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
          </p>

          {product.stock > 0 && (
            <>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: "auto" }}
                onClick={() => onAddToCart(product, quantity)}
              >
                Add to Cart
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
