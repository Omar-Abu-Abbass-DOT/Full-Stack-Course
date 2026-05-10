import "./globals.css";
import Providers from "@/components/Providers";
import AppShell from "@/components/AppShell";

export const metadata = {
  title: "OSTA — Home Services Marketplace",
  description:
    "Find trusted local professionals for home services in Jordan. Book, review, and manage everything in one place.",
  icons: {
    icon: [
      { url: "/logo-mark.png", type: "image/png" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.png",
  },
  openGraph: {
    title: "OSTA — Home Services Marketplace",
    description: "Find trusted local professionals for home services in Jordan.",
    type: "website",
    images: ["/logo.png"],
  },
};

/* No-flash script: sets theme + locale dir BEFORE React hydrates */
const noFlashScript = `
(function(){
  try {
    var t = localStorage.getItem('osta-theme');
    var theme = (t==='light'||t==='dark') ? t : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;

    var l = localStorage.getItem('osta-locale');
    var lang = (l==='ar'||l==='en') ? l
      : (navigator.language && navigator.language.slice(0,2)==='ar' ? 'ar' : 'en');
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang==='ar' ? 'rtl' : 'ltr');
  } catch(e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
