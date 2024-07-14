"use client";

import Explore from "../components/Explore/Explore";
import TrendingLatest from "../components/TrendingLatest/TrendingLatestPosts";
import Categories from "../components/Category/Categories";
import { Hero } from "../components/Hero/Hero";

const Home = () => {
  return (
    <div className="bg-gradient-to-r from-orange-500 via-white to-green-500">
      <div className="snap-start">{/* <Hero /> */}</div>
      <div className="snap-start">
        <Explore />
      </div>
      <div className="snap-start">
        <TrendingLatest />
      </div>
      <div className="snap-start">
        <Categories />
      </div>
    </div>
  );
};

export default Home;
