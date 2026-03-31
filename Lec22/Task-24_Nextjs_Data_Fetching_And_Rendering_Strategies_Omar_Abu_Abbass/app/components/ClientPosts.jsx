"use client";

import { useState, useEffect } from "react";
import { fetchMorePosts } from "../actions/posts";

export default function ClientPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(5);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  async function handleLoadMore() {
    const newPosts = await fetchMorePosts(offset);
    setPosts((prev) => [...prev, ...newPosts]);
    setOffset((prev) => prev + 5);
  }

  if (loading) return <p>Loading posts...</p>;

  return (
    <div>
      <h2>Client Posts (CSR)</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <button onClick={handleLoadMore}>Load More</button>
    </div>
  );
}
