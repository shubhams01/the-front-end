"use client";

import React, { useEffect, useRef } from "react";
import Hero from "../components/Hero/Hero";
import Explore from "../components/Explore/Explore";
import TrendingLatest from "../components/TrendingLatest/TrendingLatestPosts";
import Categories from "../components/Category/Categories";
import { useModal } from "../context/ModalContext";

const Home = () => {
  const exploreRef = useRef<HTMLDivElement | null>(null);
  const trendingRef = useRef<HTMLDivElement | null>(null);
  const categoriesRef = useRef<HTMLDivElement | null>(null);
  const { setIsLoginOpen } = useModal();

  useEffect(() => {
    setIsLoginOpen(false);

    const shouldJumpToExplore = sessionStorage.getItem("jumpToExplore");
    const shouldJumpToTrendingLatest = sessionStorage.getItem("jumpToTrendingLatest");
    const shouldJumpToCategories = sessionStorage.getItem("jumpToCategories");

    if (shouldJumpToExplore && exploreRef.current) {
      exploreRef.current.scrollIntoView({ behavior: "auto" });
      sessionStorage.removeItem("jumpToExplore"); 
    }

    if (shouldJumpToTrendingLatest && trendingRef.current) {
      trendingRef.current.scrollIntoView({ behavior: "auto" });
      sessionStorage.removeItem("jumpToTrendingLatest"); 
    }

    if (shouldJumpToCategories && categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: "auto" });
      sessionStorage.removeItem("jumpToCategories"); 
    }
  }, []);

  const scrollToExplore = () => {
    if (exploreRef.current) {
      exploreRef.current.scrollIntoView({ behavior: "smooth" });
      sessionStorage.setItem("jumpToExplore", "true"); 
    }
  };

  return (
    <div className="bg-black h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      <div className="snap-end h-screen">
        <Hero scrollToExplore={scrollToExplore} />
      </div>
      <div ref={exploreRef} className="snap-end h-screen">
        <Explore />
      </div>
      <div ref={trendingRef} className="snap-end h-screen">
        <TrendingLatest />
      </div>
      <div ref={categoriesRef} className="snap-end">
        <Categories />
      </div>
    </div>
  );
};

export default Home;
