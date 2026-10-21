import type { Metadata, Viewport } from "next";
import "./neptun.css";

const description =
  "Nowa Szkoła Tańca Neptun w Koszalinie. Wielkie otwarcie 10 listopada 2026. Taniec użytkowy, tango argentyńskie, flamenco, Latino Solo TUMBAO, lekcje indywidualne i pierwszy taniec. Zapisy online.";

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Szkoła Tańca Neptun — wielkie otwarcie 10 listopada",
    template: "%s · Szkoła Tańca Neptun",
  },
  description,
  applicationName: "Szkoła Tańca Neptun",
  openGraph: {
    title: "Szkoła Tańca Neptun — nowa szkoła, nowa energia",
    description,
    locale: "pl_PL",
    type: "website",
    images: [{ url: "/images/latin-kopniecie.webp", width: 1330, height: 2000 }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050f1c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          rel="stylesheet"
          href="https://fonts.bunny.net/css?family=unbounded:500,600,700|manrope:400,500,600,700,800&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
