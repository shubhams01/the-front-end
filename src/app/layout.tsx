import type { Metadata } from "next";
import "./globals.css";
import { ModalProvider } from "./context/ModalContext";
import Script from "next/script";
import Navbar from "./components/Navbar/Navbar";
import Head from "next/head";
import { Viewport } from "next"
import { Montserrat } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import AdSense from "./components/Ads/Adsense";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "Gyaanhub",
  description:
    "Gyaanhub is your ultimate platform to explore, share, and grow knowledge. Join a community of learners and thinkers who believe in the power of curiosity.",
  openGraph: {
    title: "Gyaanhub",
    description:
      "Discover, share, and grow with Gyaanhub. Connect with a community that thrives on knowledge and curiosity.",
    url: "https://gyaanhub.io",
    siteName: "Gyaanhub",
    images: [
      {
        url: "https://api.gyaanhub.io/uploads/Logo_black_800_px_f8523a9d1f.png",
        width: 1200,
        height: 630,
        alt: "Gyaanhub Logo",
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gyaanhub",
    description:
      "Join Gyaanhub to discover, share, and grow knowledge with a global community of thinkers and learners.",
    images: [
      "https://api.gyaanhub.io/uploads/Logo_black_800_px_f8523a9d1f.png",
    ],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  keywords: [
    "Gyaanhub",
    "knowledge sharing",
    "learning platform",
    "community of learners",
    "educational content",
    "grow knowledge",
  ],
  alternates: {
    canonical: "https://gyaanhub.io",
    languages: {
      "en-US": "https://gyaanhub.io/en",
      "es-ES": "https://gyaanhub.io/es",
    },
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Head>
        {/* Google Adsense */}
        {/* <AdSense pId="ca-pub-8954233353863168"/> */}

        {/* Google tag (gtag.js)  */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-05GW6CSNL3"
        ></script>
        <script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-05GW6CSNL3');
            `}
        </script>
      </Head>
      <body className={montserrat.className}>
        <ModalProvider>
          <Navbar />
          {children}
        </ModalProvider>
      </body>
      <GoogleAnalytics gaId="G-05GW6CSNL3" />
    </html>
  );
}
