import Link from "next/link";

// Fetch a single post by ID
async function getPost(id) {
  const res = await fetch(`http://localhost:3000/api/posts`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  const posts = await res.json();
  return posts.find((post) => post.id === Number(id));
}

// Dynamic Metadata for SEO
export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160),
  };
}

// Dynamic Post Page - Server Component with SSR
export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return (
      <main className="container">
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>
        <div className="error-container">
          <h2>Post Not Found</h2>
          <p>The post you are looking for does not exist.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <Link href="/" className="back-link">
        ← Back to Home
      </Link>
      <article className="post-detail">
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    </main>
  );
}
