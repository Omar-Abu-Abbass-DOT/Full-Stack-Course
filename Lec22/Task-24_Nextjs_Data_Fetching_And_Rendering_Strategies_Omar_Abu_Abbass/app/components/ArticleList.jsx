"use client";

import { useRouter } from "next/navigation";

export default function ArticleList({ articles }) {
  const router = useRouter();

  return (
    <ul>
      {articles.map((article) => (
        <li
          key={article.id}
          onClick={() => router.push(`/articles/${article.id}`)}
          style={{ cursor: "pointer", marginBottom: "16px" }}
        >
          <h3>{article.title}</h3>
          <p>{article.body}</p>
          <p><strong>User ID:</strong> {article.userId}</p>
        </li>
      ))}
    </ul>
  );
}
