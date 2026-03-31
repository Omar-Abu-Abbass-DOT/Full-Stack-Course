"use server";

export async function fetchMorePosts(start) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=5`
  );
  const posts = await res.json();
  return posts;
}
