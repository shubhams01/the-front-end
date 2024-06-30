"use client";

import { useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Card from "../components/Card";
import Carousal from "../components/Carousal";
import Categories from "../components/Categories";
import ContentSwitch from "../components/ContentSwitch";
import CoverScreen from "../components/CoverScreen";
import SwitchPosts from "../components/SwitchPosts";
import { useRouter } from "next/navigation";
import Explore from "../components/Explore/Explore";
import { Hero } from "../components/Hero/Hero";

const Home = () => {
  return (
    // <div className="scroll-smooth snap-y snap-mandatory overflow-y-scroll overflow-x-hidden h-screen">
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
