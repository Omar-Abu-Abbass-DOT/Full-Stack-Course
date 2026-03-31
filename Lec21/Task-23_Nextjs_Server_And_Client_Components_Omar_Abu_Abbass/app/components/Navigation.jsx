"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const router = useRouter();

  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/about">About</Link>
      <Link href="/articles">Articles</Link>
      <button onClick={() => router.push("/news")}>News</button>
    </nav>
  );
}
