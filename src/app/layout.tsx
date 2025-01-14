import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "./context/ModalContext";
import Navbar from "./components/Navbar/Navbar";
import Head from "next/head";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gyaanhub",
  description: "we know nothing",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-05GW6CSNL3"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-05GW6CSNL3');
        `}
      </Script>
      </Head>
      <body className={inter.className}>
        <ModalProvider>
          <Navbar />
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}
