import type { Metadata } from "next";
import "./globals.css";
import { ModalProvider } from "./context/ModalContext";
import Script from "next/script";
import Navbar from "./components/Navbar/Navbar";
import Head from "next/head";
import { Montserrat } from "next/font/google";
import AdSense from "./components/Ads/Adsense";

const montserrat = Montserrat({subsets: ["latin"]});

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
        {/* Google Adsense */}
        <AdSense pId="ca-pub-8954233353863168"/>
        
        {/* Google tag (gtag.js)  */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-T9B3Y1JYSE"
        ></script>
        <script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-T9B3Y1JYSE');
            `}
        </script>
      </Head>
      <body className={montserrat.className}>
        <ModalProvider>
          <Navbar />
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}
