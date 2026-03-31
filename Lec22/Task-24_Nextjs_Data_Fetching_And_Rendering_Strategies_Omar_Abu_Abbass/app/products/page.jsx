export default async function ProductsPage() {
  const res = await fetch("https://fakestoreapi.com/products?limit=3", {
    cache: "force-cache",
  });
  const products = await res.json();

  return (
    <div>
      <h2>Products (SSG)</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
    </div>
  );
}
