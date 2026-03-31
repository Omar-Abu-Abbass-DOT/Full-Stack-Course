export default async function NewsPage() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=3",
    { cache: "no-store" }
  );
  const posts = await res.json();

  return (
    <div>
      <h2>News (SSR)</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
