import React, { useState, useEffect } from "react";
import Card from "../Story/Card";
import ContentSwitch from "./ContentSwitch";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const TrendingLatestPosts = () => {
  const router = useRouter();
  const [isTrending, setIsTrending] = useState(true);
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stackDepth, setStackDepth] = useState(0);

  const fetchTrendingPosts = async () => {
    try {
      const response = await fetch(
        "https://api.gyaanhub.io/api/articles/trending"
      );
      const data = await response.json();
      const trendingArticles = data.map((article) => ({
        id: article.id,
        title: article.Title,
        slug: article.Slug,
        category: article.category?.Title,
        imageUrl: 'https://api.gyaanhub.io' + article.Image[0].formats.small.url,
      }));
      setPosts(trendingArticles);
      console.log("trending ", data);
    } catch (error) {
      console.error("Error fetching trending posts:", error);
    }
  };

  const fetchLatestPosts = async () => {
    try {
      const response = await fetch("https://api.gyaanhub.io/api/articles/latest");
      const data = await response.json();
      const latestArticles = data.map((article) => ({
        id: article.id,
        title: article.Title,
        slug: article.Slug,
        category: article.category.Title,
        imageUrl: 'https://api.gyaanhub.io' + article.Image[0].formats.small?.url,
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
    // setStackDepth(0); // Reset stack depth when switching content
  };

  const handleClick = (card) => {
    console.log("trending/latest card ", card);
    setTimeout(() => {
      router.push(
        `/${card.category}/${card.slug}-${card.id}?explore=${
          isTrending ? "trending" : "latest"
        }`
      );
    }, 500);
  };

  const handleSwipe = (direction) => {
    if (direction === "left") {
      if (currentIndex < posts.length - 1) {
        setCurrentIndex(currentIndex + 1);
        // setStackDepth(stackDepth + 1);
      } else {
        setCurrentIndex(0);
        // setStackDepth(0); // Reset stack depth when looping to the first card
      }
    } else if (direction === "right") {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        // setStackDepth(stackDepth > 0 ? stackDepth - 1 : 0);
      } else {
        setCurrentIndex(posts.length - 1);
        // setStackDepth(posts.length - 1); // Set stack depth when looping to the last card
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <div className="w-full">
        <ContentSwitch onSwitch={handleSwitch} />
      </div>
      <div className="relative w-full flex-1 flex items-center justify-center">
        <AnimatePresence initial={false}>
          {posts.length > 0 && (
            <>
              {currentIndex > 0 && (
                <motion.div
                  // @ts-ignore
                  key={posts[currentIndex - 1].id}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.95, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: "-1deg" }}
                  exit={{ opacity: 0, scale: 0.95, rotate: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ zIndex: stackDepth }}
                >
                  <Card
                    // @ts-ignore
                    id={posts[currentIndex - 1].id}
                    // @ts-ignore
                    imageUrl={posts[currentIndex - 1].imageUrl}
                    // @ts-ignore
                    title={posts[currentIndex - 1].title}
                    // @ts-ignore
                    category={posts[currentIndex - 1].category}
                  />
                </motion.div>
              )}
              <motion.div
                // @ts-ignore
                key={posts[currentIndex].id}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  zIndex: stackDepth + 1,
                  opacity: 1,
                  scale: 1,
                  rotate: "1deg", // Tilt right for current card
                }}
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
                initial={{ opacity: 0, scale: 0.95, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: "1deg" }}
                exit={{ opacity: 0, scale: 0.95, rotate: 0 }}
                transition={{ duration: 0.5 }}
                dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
              >
                <Card
                  // @ts-ignore
                  id={posts[currentIndex].id}
                  // @ts-ignore
                  imageUrl={posts[currentIndex].imageUrl}
                  // @ts-ignore
                  title={posts[currentIndex].title}
                  // @ts-ignore
                  category={posts[currentIndex].category}
                />
              </motion.div>
              {currentIndex < posts.length - 1 && (
                <motion.div
                  // @ts-ignore
                  key={posts[currentIndex + 1].id}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.95, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: "1deg" }}
                  exit={{ opacity: 0, scale: 0.95, rotate: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ zIndex: stackDepth }}
                >
                  <Card
                    // @ts-ignore
                    id={posts[currentIndex + 1].id}
                    // @ts-ignore
                    imageUrl={posts[currentIndex + 1].imageUrl}
                    // @ts-ignore
                    title={posts[currentIndex + 1].title}
                    // @ts-ignore
                    category={posts[currentIndex + 1].category}
                  />
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrendingLatestPosts;
