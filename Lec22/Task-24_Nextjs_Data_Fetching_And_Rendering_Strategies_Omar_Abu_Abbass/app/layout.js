import "./globals.css";
import Navigation from "./components/Navigation";

export const metadata = {
  title: "Knowledge Portal",
  description: "Knowledge Portal App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Knowledge Portal</h1>
        </header>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
