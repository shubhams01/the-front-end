import React, { useState, useEffect } from "react";
import Card from "../Story/Card";
import ContentSwitch from "./ContentSwitch";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ChevronDoubleLeftIcon from "@heroicons/react/24/solid/ChevronDoubleLeftIcon";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

const TrendingLatestPosts = () => {
  const router = useRouter();
  const [isTrending, setIsTrending] = useState(true);
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);

  const fetchTrendingPosts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/articles/trending`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      const trendingArticles = data.map((article) => ({
        id: article.id,
        title: article.Title,
        slug: article.Slug,
        categoryTitle: article.category.Title,
        categorySlug: article.category.Slug,
        imageUrl:
          "https://api.gyaanhub.io" + article?.Image[0]?.formats?.large?.url,
        blurhash: article.blurhash,
      }));
      console.log("treningArticles", trendingArticles);
      setPosts(trendingArticles);
    } catch (error) {
      console.error("Error fetching trending posts:", error);
    }
  };

  const fetchLatestPosts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/articles/latest`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      const latestArticles = data.map((article) => ({
        id: article.id,
        title: article.Title,
        slug: article.Slug,
        categoryTitle: article.category.Title,
        categorySlug: article.category.Slug,
        imageUrl:
          "https://api.gyaanhub.io" + article?.Image[0]?.formats?.large?.url,
        blurhash: article.blurhash,
      }));
      console.log("latestArticles", latestArticles);
      setPosts(latestArticles);
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
    sessionStorage.setItem("jumpToTrendingLatest", "true");
    setSelectedCard(card);
    setTimeout(() => {
      router.push(
        `/${card.categorySlug}/${card.slug}-${card.id}?section=${
          isTrending ? "trending" : "latest"
        }`
      );
    }, 500);
  };

  const handleLeftArrowClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < posts.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleRightArrowClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : posts.length - 1
    );
  };

  const rightArrowAnimation = {
    x: [-5, 0, -5],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  };

  const leftArrowAnimation = {
    x: [0, -5, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-dvh">
      <div className="w-dvw">
        <ContentSwitch onSwitch={handleSwitch} />
      </div>
      <div className="relative w-96 flex-1 flex items-center justify-center">
        <motion.div
          className="absolute cursor-pointer left-2 lg:left-1 top-1/2 transform -translate-y-1/2 h-8 w-8 z-20"
          onClick={() => handleLeftArrowClick()}
          // @ts-ignore
          animate={leftArrowAnimation}
        >
          <ChevronDoubleLeftIcon />
        </motion.div>
        <AnimatePresence initial={false}>
          {posts.length > 0 && (
            <motion.div
              // @ts-ignore
              key={posts[currentIndex].id}
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 10, opacity: 1, scale: 1 }}
              onClick={() => handleClick(posts[currentIndex])}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(event, info) => {
                if (info.offset.x < -100) {
                  handleLeftArrowClick();
                } else if (info.offset.x > 100) {
                  handleRightArrowClick();
                }
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                // @ts-ignore
                id={posts[currentIndex].id}
                // @ts-ignore
                imageUrl={posts[currentIndex].imageUrl}
                // @ts-ignore
                title={posts[currentIndex].title}
                // @ts-ignore
                category={posts[currentIndex].categoryTitle}
                // @ts-ignore
                blurhash={posts[currentIndex].blurhash}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="absolute cursor-pointer right-1 lg:-right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 z-10"
          onClick={handleRightArrowClick}
          // @ts-ignore
          animate={rightArrowAnimation}
        >
          <ChevronDoubleRightIcon />
        </motion.div>
      </div>
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
            >
              <img
                className="h-20 md:h-24 lg:h-28"
                src="/logo-white.svg"
                alt="Logo"
              />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrendingLatestPosts;
