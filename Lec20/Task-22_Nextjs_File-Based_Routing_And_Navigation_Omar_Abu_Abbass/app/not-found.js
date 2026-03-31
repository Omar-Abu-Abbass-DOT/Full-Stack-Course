import Link from "next/link";

// Activity 5: Custom not-found page
export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link href="/">Go Back Home</Link>
    </div>
  );
}
