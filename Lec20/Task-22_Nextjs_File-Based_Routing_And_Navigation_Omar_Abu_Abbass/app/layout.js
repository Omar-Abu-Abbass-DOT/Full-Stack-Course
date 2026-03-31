import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "My Website",
  description: "Next.js File-Based Routing Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Activity 3: Navigation menu using Link */}
        <nav>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <main>{children}</main>

        <footer>
          <p>&copy; 2026 My Website. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
