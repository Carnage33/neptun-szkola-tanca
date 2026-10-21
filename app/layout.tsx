import type { Metadata, Viewport } from "next";
import { Enhance } from "@/components/Enhance";

const description =
  "Nowa Szkoła Tańca Neptun w Koszalinie. Wielkie otwarcie 10 listopada 2026. Nowa energia, kursy dla dorosłych, tango, flamenco, Latino Solo TUMBAO, lekcje indywidualne i pierwszy taniec. ul. Piastowska 21. Zapisy online.";

export const metadata: Metadata = {
  title: {
    default: "Szkoła Tańca Neptun — otwarcie 10 listopada",
    template: "%s · Szkoła Tańca Neptun",
  },
  description,
  applicationName: "Szkoła Tańca Neptun",
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "Szkoła Tańca Neptun — otwarcie 10 listopada",
    description,
    locale: "pl_PL",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#071422",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          rel="stylesheet"
          href="https://fonts.bunny.net/css2?family=Outfit:wght@500;600;700;800&family=Source+Sans+3:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        />
        <link rel="stylesheet" href="/styles/tailwind.css" />
        <link rel="stylesheet" href="/styles/witryna.css" />
        <link rel="stylesheet" href="/styles/astra.css" />
        <link rel="stylesheet" href="/styles/extra.css" />
      </head>
      <body>
        {children}
        <Enhance />
      </body>
    </html>
  );
}
