import Link from "next/link";

export default function BlogPage() {
  const posts = [
    { id: 1, title: "Getting Started with Next.js", summary: "Learn the basics of Next.js and file-based routing." },
    { id: 2, title: "React Hooks Explained", summary: "A deep dive into useState, useEffect, and custom hooks." },
    { id: 3, title: "CSS Grid vs Flexbox", summary: "When to use Grid and when to use Flexbox in your layouts." },
  ];

  return (
    <div>
      <h1>Blog</h1>
      <p>Read our latest articles and tutorials.</p>
      <ul className="blog-list">
        {posts.map((post) => (
          <li key={post.id} className="blog-card">
            <Link href={`/blog/${post.id}`}>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
