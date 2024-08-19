"use client";

import React, { useEffect, useRef } from "react";
import Hero from "../components/Hero/Hero";
import Explore from "../components/Explore/Explore";
import TrendingLatest from "../components/TrendingLatest/TrendingLatestPosts";
import Categories from "../components/Category/Categories";
import { useModal } from "../context/ModalContext";

const Home = () => {
  const exploreRef = useRef(null);
  const { setIsLoginOpen } = useModal();

  useEffect(() => {
    setIsLoginOpen(false);
  }, [])

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
      <div className="snap-start">
        <Categories />
      </div>
    </div>
  );
};

export default Home;
