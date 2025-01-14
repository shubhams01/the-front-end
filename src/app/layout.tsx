import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "./context/ModalContext";
import Navbar from "./components/Navbar/Navbar";
import { GoogleAnalytics } from '@next/third-parties/google'

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
      <body className={inter.className}>
        <ModalProvider>
          <Navbar />
          {children}
        </ModalProvider>
        <GoogleAnalytics gaId="G-05GW6CSNL3" />
      </body>
    </html>
  );
}
