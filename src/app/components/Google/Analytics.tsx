"use client"; 

import { useEffect } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function Analytics() {
  useEffect(() => {
    console.log("Google Analytics loaded"); 
  }, []);

  return <GoogleAnalytics gaId="G-05GW6CSNL3" />;
}
