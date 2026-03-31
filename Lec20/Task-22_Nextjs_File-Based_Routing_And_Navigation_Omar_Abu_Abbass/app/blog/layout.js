// Activity 4: Shared layout for blog section
export default function BlogLayout({ children }) {
  return (
    <div className="blog-layout">
      <h2>Blog Section</h2>
      {children}
    </div>
  );
}
