import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata = {
  title: "My Blog",
  description: "A full blog built with Next.js App Router and SSR",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <header className="navbar">
          <h1>
            <Link href="/">My Blog</Link>
          </h1>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/create">New Post</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
