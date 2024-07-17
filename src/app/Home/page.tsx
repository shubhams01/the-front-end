"use client";

import React, { useRef } from "react";
import Hero from "../components/Hero/Hero";
import Explore from "../components/Explore/Explore";
import TrendingLatest from "../components/TrendingLatest/TrendingLatestPosts";
import Categories from "../components/Category/Categories";

const Home = () => {
  const exploreRef = useRef(null);

  const scrollToExplore = () => {
    if (exploreRef.current) {
      exploreRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-black h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      <div className="snap-start h-screen">
        <Hero scrollToExplore={scrollToExplore} />
      </div>
      <div ref={exploreRef} className="snap-start h-screen">
        <Explore />
      </div>
      <div className="snap-start h-screen">
        <TrendingLatest />
      </div>
      <div className="snap-start h-screen">
        <Categories />
      </div>
    </div>
  );
};

export default Home;
