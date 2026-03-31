// In-memory posts array (no database required)
let posts = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    content:
      "Next.js is a powerful React framework that enables server-side rendering, static site generation, and much more. It provides an excellent developer experience with features like file-based routing, API routes, and built-in CSS support.",
  },
  {
    id: 2,
    title: "Understanding Server-Side Rendering",
    content:
      "Server-Side Rendering (SSR) is a technique where the server generates the full HTML for a page on each request. This improves performance and SEO because the browser receives a fully rendered page instead of an empty shell that needs JavaScript to populate.",
  },
  {
    id: 3,
    title: "Dynamic Routing in App Router",
    content:
      "The App Router in Next.js uses folder-based routing. Dynamic segments are created using square brackets like [id]. This allows you to create pages that match dynamic URLs, such as /posts/1 or /posts/2, using a single page component.",
  },
  {
    id: 4,
    title: "Building REST APIs with Route Handlers",
    content:
      "Next.js Route Handlers allow you to create API endpoints inside the app directory. You export async functions named after HTTP methods (GET, POST, PUT, DELETE) from a route.js file. This makes it easy to build a full-stack application.",
  },
];

// GET /api/posts - Return all posts
export async function GET() {
  return Response.json(posts);
}

// POST /api/posts - Create a new post
export async function POST(request) {
  const body = await request.json();
  const { title, content } = body;

  if (!title || !content) {
    return Response.json(
      { error: "Title and content are required" },
      { status: 400 }
    );
  }

  const newPost = {
    id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1,
    title,
    content,
  };

  posts.push(newPost);
  return Response.json(newPost, { status: 201 });
}

// DELETE /api/posts?id=1 - Delete a post
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  posts.splice(index, 1);
  return Response.json({ message: "Post deleted successfully" });
}
