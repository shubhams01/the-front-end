import React, { useState, useEffect } from "react";
import Card from "../Card";
import ContentSwitch from "./ContentSwitch";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const TrendingLatestPosts = () => {
  const router = useRouter();

  const [isTrending, setIsTrending] = useState(true);
  const [posts, setPosts] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchTrendingPosts = async () => {
    try {
      const response = await fetch(
        "http://localhost:1337/api/articles/trending"
      );
      const data = await response.json();
      const trendingArticles = data.map((article) => ({
        id: article.id,
        title: article.Title,
        slug: article.Slug,
        category: article.category.Slug,
        imageUrl: "http://localhost:1337" + article.Image[0].formats.large.url,
      }));
      setPosts(trendingArticles);
      console.log("trending ", data);
    } catch (error) {
      console.error("Error fetching trending posts:", error);
    }
  };

  const fetchLatestPosts = async () => {
    try {
      const response = await fetch("http://localhost:1337/api/articles/latest");
      const data = await response.json();
      const latestArticles = data.map((article) => ({
        id: article.id,
        title: article.Title,
        slug: article.Slug,
        category: article.category.Slug,
        imageUrl: "http://localhost:1337" + article.Image[0].formats.large.url,
      }));
      setPosts(latestArticles);
      console.log("latest ", data);
    } catch (error) {
      console.error("Error fetching latest posts:", error);
    }
  };

  useEffect(() => {
    if (isTrending) {
      fetchTrendingPosts();
    } else {
      fetchLatestPosts();
    }
  }, [isTrending]);

  const handleSwitch = (value) => {
    setIsTrending(value);
    setCurrentIndex(0);
  };

  const handleClick = (card) => {
    console.log("trending/latest card ", card);
    // setSelectedCard(card);
    setTimeout(() => {
      router.push(`/${card.category}/${card.slug}-${card.id}`);
    }, 500);
  };

  const handleSwipe = (direction) => {
    if (direction === "left" && currentIndex < posts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "right" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <ContentSwitch onSwitch={handleSwitch} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <AnimatePresence mode='wait'>
          {posts.length > 0 && (
            <motion.div
              key={posts[currentIndex].id}
              // initial={{ opacity: 0, x: isTrending ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              // exit={{ opacity: 0, x: isTrending ? -100 : 100 }}
              // transition={{ duration: 0.5 }}
              onClick={() => handleClick(posts[currentIndex])}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(event, info) => {
                if (info.offset.x < -100) {
                  handleSwipe("left");
                } else if (info.offset.x > 100) {
                  handleSwipe("right");
                }
              }}
              dragTransition={{ bounceStiffness: 500, bounceDamping: 20 }}
            >
              <Card
                key={posts[currentIndex].id}
                imageUrl={posts[currentIndex].imageUrl}
                title={posts[currentIndex].title}
                category={posts[currentIndex].category}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrendingLatestPosts;
