import Link from "next/link";

// Activity 2: Dynamic route /blog/[id]
export default async function BlogPost({ params }) {
  const { id } = await params;

  const posts = {
    1: {
      title: "Getting Started with Next.js",
      content: "Next.js is a React framework that enables server-side rendering and static site generation. It uses file-based routing which makes creating pages simple and intuitive. You just create files in the app directory and Next.js automatically creates routes for them.",
    },
    2: {
      title: "React Hooks Explained",
      content: "React Hooks allow you to use state and other React features in functional components. The most common hooks are useState for managing state, useEffect for side effects, and useContext for accessing context values.",
    },
    3: {
      title: "CSS Grid vs Flexbox",
      content: "CSS Grid is best for two-dimensional layouts where you need control over rows and columns. Flexbox is ideal for one-dimensional layouts, either in a row or column. Both can work together in modern web design.",
    },
  };

  const post = posts[id];

  if (!post) {
    return (
      <div>
        <h1>Post Not Found</h1>
        <p>The blog post with ID "{id}" does not exist.</p>
        <Link href="/blog">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <br />
      <Link href="/blog">← Back to Blog</Link>
    </div>
  );
}
