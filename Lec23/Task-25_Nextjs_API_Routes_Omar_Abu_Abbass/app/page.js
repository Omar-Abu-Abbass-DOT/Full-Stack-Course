import Link from "next/link";

// SSR: fetch posts on every request (no caching)
async function getPosts() {
  const res = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

// Home Page - Server Component (NO "use client")
export default async function HomePage() {
  const posts = await getPosts();

  return (
    <main className="container">
      <h1 className="page-title">Latest Blog Posts</h1>

      {posts.length === 0 ? (
        <p>No posts yet. Be the first to create one!</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            <h2>{post.title}</h2>
            <p>{post.content.substring(0, 120)}...</p>
            <Link href={`/posts/${post.id}`} className="read-more">
              Read More →
            </Link>
          </div>
        ))
      )}
    </main>
  );
}
