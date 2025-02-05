"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Card from "../components/Story/Card";
import LoadingScreen from "@/app/components/Loading/LoadingScreen";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";

const CategoryPage = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <CategoryPageContent />
    </Suspense>
  );
};

const CategoryPageContent = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("type");
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const overlayControls = useAnimation();

  const handleClick = (card) => {
    console.log("card ", card);
    setSelectedCard(card);
    setTimeout(() => {
      router.push(
        `/${card.categorySlug}/${card.slug}-${card.id}?section=${card.categorySlug}`
      );
    }, 500);
  };

  useEffect(() => {
    const fetchData = async () => {
      await overlayControls.start({ y: "0%" });
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/articles/category/${category}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Articles");
        }
        const data = await response.json();
        const extractedArticles = data.map((article) => ({
          id: article.id,
          title: article.title,
          slug: article?.slug,
          categoryTitle: article.categoryTitle,
          categorySlug: article.categorySlug,
          imageUrl: "https://api.gyaanhub.io" + article.imageUrl,
        }));
        console.log("Articles by Category", category, extractedArticles, data);
        setArticles(extractedArticles);
        await overlayControls.start({ y: "-100%" });
      } catch (error) {
        console.error("Error fetching Articles:", error);
      }
    };

    fetchData();
  }, [category]);

  const handleLeftArrowClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < articles.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleRightArrowClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : articles.length - 1
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
    <div className="explore-container flex flex-col items-center justify-center h-dvh snap-y snap-mandatory overflow-y-scroll overflow-x-hidden">
      <div className="text-2xl font-bold mt-6 z-30">
        {category?.toLocaleUpperCase()}
      </div>

      <div className="relative w-96 flex-1 flex items-center justify-center -mt-8">
        <motion.div
          className="absolute cursor-pointer left-2 lg:left-1 top-1/2 transform -translate-y-1/2 h-8 w-8 z-20"
          onClick={handleLeftArrowClick}
          // @ts-ignore
          animate={leftArrowAnimation}
        >
          <ChevronDoubleLeftIcon />
        </motion.div>

        <AnimatePresence initial={false}>
          {articles.length > 0 && (
            <motion.div
              // @ts-ignore
              key={articles[currentIndex].id}
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 10, opacity: 1, scale: 1 }}
              onClick={() => handleClick(articles[currentIndex])}
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
                id={articles[currentIndex].id}
                // @ts-ignore
                imageUrl={articles[currentIndex].imageUrl}
                // @ts-ignore
                title={articles[currentIndex].title}
                // @ts-ignore
                category={articles[currentIndex].categoryTitle}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="absolute cursor-pointer right-1 lg:-right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 z-20"
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

export default CategoryPage;
