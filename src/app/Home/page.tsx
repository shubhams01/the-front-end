"use client";

import { useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Card from "../components/Card";
import Carousal from "../components/Carousal";
import Categories from "../components/Category/Categories";
import ContentSwitch from "../components/TrendingLatest/ContentSwitch";
import CoverScreen from "../components/CoverScreen";
import SwitchPosts from "../components/TrendingLatest/TrendingLatestPosts";
import { useRouter } from "next/navigation";
import Explore from "../components/Explore/Explore";
import { Hero } from "../components/Hero/Hero";

const Home = () => {
  return (
    <div>
      <div className="snap-start">
        {/* <Hero /> */}
      </div>
      <div className="snap-start">
        <Explore />
      </div>
      <div className="snap-start">
        <SwitchPosts />
      </div>
      <div className="snap-start">
        <Categories />
      </div>
    </div>
  );
};

export default Home;
