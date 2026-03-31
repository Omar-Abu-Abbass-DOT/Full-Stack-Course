export const revalidate = 60;

export default async function BlogPage() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=3"
  );
  const posts = await res.json();

  return (
    <div>
      <h2>Blog (ISR)</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
