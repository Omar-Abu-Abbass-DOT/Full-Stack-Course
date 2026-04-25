/* Reusable skeleton cards — drop-in replacement while loading */

export const ProductCardSkeleton = () => (
  <div className="product-card" style={{ pointerEvents: "none" }}>
    <div className="skeleton-img" />
    <div className="card-body" style={{ gap: "0.6rem" }}>
      <div className="skeleton-line" style={{ width: "45%", height: "10px" }} />
      <div className="skeleton-line" style={{ width: "80%", height: "14px" }} />
      <div className="skeleton-line" style={{ width: "35%", height: "18px" }} />
      <div className="skeleton-line" style={{ width: "55%", height: "10px" }} />
      <div className="skeleton-line" style={{ width: "100%", height: "40px", borderRadius: "10px", marginTop: "0.4rem" }} />
    </div>
  </div>
);

export const ProductsGridSkeleton = ({ count = 8 }) => (
  <div className="products-grid">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="product-detail" style={{ pointerEvents: "none" }}>
    <div className="skeleton-img" style={{ height: "420px", borderRadius: "18px" }} />
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="skeleton-line" style={{ width: "30%", height: "10px" }} />
      <div className="skeleton-line" style={{ width: "75%", height: "28px" }} />
      <div className="skeleton-line" style={{ width: "25%", height: "28px" }} />
      <div className="skeleton-line" style={{ width: "50%", height: "12px" }} />
      <div className="skeleton-line" style={{ width: "100%", height: "80px", borderRadius: "12px" }} />
      <div className="skeleton-line" style={{ width: "100%", height: "50px", borderRadius: "14px" }} />
    </div>
  </div>
);

export const OrderCardSkeleton = () => (
  <div className="order-card" style={{ pointerEvents: "none" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
      <div className="skeleton-line" style={{ width: "30%", height: "14px" }} />
      <div className="skeleton-line" style={{ width: "20%", height: "14px" }} />
      <div className="skeleton-line" style={{ width: "18%", height: "24px", borderRadius: "20px" }} />
    </div>
    <div className="skeleton-line" style={{ width: "65%", height: "11px", marginBottom: "0.5rem" }} />
    <div className="skeleton-line" style={{ width: "50%", height: "11px", marginBottom: "1rem" }} />
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div className="skeleton-line" style={{ width: "20%", height: "11px" }} />
      <div className="skeleton-line" style={{ width: "20%", height: "20px" }} />
    </div>
  </div>
);
