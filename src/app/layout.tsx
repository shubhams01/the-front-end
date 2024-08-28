import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "./context/ModalContext";
import Script from "next/script";
import Navbar from "./components/Navbar/Navbar";
import { useEffect } from "react";
import Head from "next/head";

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
        {/* Google tag (gtag.js)  */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-C7Q378R3R9"
        ></Script>
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-C7Q378R3R9');
            `}
        </Script>
      </Head>
      <body className={inter.className}>
        <Navbar />
        <ModalProvider>{children}</ModalProvider>
      </body>
    </html>
  );
}
