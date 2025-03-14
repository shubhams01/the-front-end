"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useAnimation, animate } from "framer-motion";
import Card from "../Story/Card";
import { useModal } from "@/app/context/ModalContext";
import {
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import LoginRegisterModal from "../Modal/LoginRegisterModal";
import { useAuthStore } from "@/app/store/authStore";
import { getAuthToken } from "@/app/hooks/useLocalStorageAuth";
import LoadingScreen from "../Loading/LoadingScreen";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  slug: string;
  categoryTitle: string;
  categorySlug: string;
  imageUrl: string;
  blurhash: string;
}

const Explore = () => {
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { setIsLoginOpen } = useModal();
  const { isLoggedIn } = useAuthStore();
  const token = getAuthToken();

  const overlayControls = useAnimation();

  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  const handleClick = (card: any, index: number) => {
    console.log("card ", card);
    sessionStorage.setItem("entryCardIndex", index.toString()); // Save index
    sessionStorage.setItem("jumpToExplore", "true");

    setSelectedCard(card);
    setTimeout(() => {
      router.push(
        `/${card.categorySlug}/${card.slug}-${card.id}?section=explore`
      );
    }, 1000);
  };

  // console.log("apiUrl ", apiUrl, process.env.NEXT_PUBLIC_STRAPI_API_URL);
  const fetchData = async (newPage) => {
    await overlayControls.start({ y: "0%" });
    try {
      // const endpoint = isLoggedIn
      //   ? `https://api.gyaanhub.io/api/recommendations`
      //   : `https://api.gyaanhub.io/api/explore`;

      // const headers = isLoggedIn ? { Authorization: `Bearer ${token}` } : {};
      // // @ts-ignore
      // const response = await fetch(endpoint, { headers });

      const response = await fetch(
        // `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/explore`,
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/explore?page=${newPage}&pageSize=25`,
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
      if (data.length === 0) {
        setHasMore(false);
        return;
      }
      const { data: articlesData } = data;
      console.log("ExploreData ", articlesData);
      const extractedArticles = articlesData.map((article: any) => ({
        id: article.id,
        title: article.Title,
        slug: article.Slug,
        categoryTitle: article.category.Title,
        categorySlug: article.category.Slug,
        imageUrl:
          "https://api.gyaanhub.io" + article?.Image[0]?.formats?.large?.url,
        blurhash: article?.blurhash,
      }));
      console.log(
        `Articles ${isLoggedIn ? "recommended" : "explore"}`,
        extractedArticles
      );
      setLoading(false);
      // setArticles(extractedArticles);
      setArticles((prev) => [...prev, ...extractedArticles]);
      await overlayControls.start({ y: "-100%" });
    } catch (error) {
      console.error("Error fetching Articles:", error);
    }
  };
  useEffect(() => {
    fetchData(page);
  }, [isLoggedIn, page]);

  const handleSwipe = (direction) => {
    if (direction === "left") {
      console.log("currentIndex", currentIndex, articles.length);
      if (currentIndex < articles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      if (currentIndex >= articles.length - 2 && hasMore) {
        setPage(page + 1);
      }
      // else if (currentIndex <= articles.length - 2) {
      //   setCurrentIndex(0);
      // }
    } else {
      setCurrentIndex(
        currentIndex > 0 ? currentIndex - 1 : articles.length - 1
      );
    }
  };

  // const handleSwipe = (direction: string) => {
  //   if (direction === "left") {
  //     if (currentIndex < articles.length - 1) {
  //       setCurrentIndex(currentIndex + 1);
  //     } else {
  //       setCurrentIndex(0); // Loop to first card
  //     }
  //     setIsLoginOpen(false);
  //   } else if (direction === "right") {
  //     if (currentIndex > 0) {
  //       setCurrentIndex(currentIndex - 1);
  //     } else {
  //       setCurrentIndex(articles.length - 1); // Loop to last card
  //     }
  //     setIsLoginOpen(false);
  //   }
  // };

  // const handleLeftArrowClick = () => {
  //   if (currentIndex > 0) {
  //     setCurrentIndex(currentIndex - 1);
  //   } else {
  //     setCurrentIndex(articles.length - 1); // Loop to last card
  //   }
  // };

  // const handleRightArrowClick = () => {
  //   if (currentIndex < articles.length - 1) {
  //     setCurrentIndex(currentIndex + 1);
  //   } else {
  //     setCurrentIndex(0); // Loop to first card
  //   }
  // };

  useEffect(() => {
    const storedIndex = sessionStorage.getItem("entryCardIndex");
    if (storedIndex !== null) {
      setCurrentIndex(parseInt(storedIndex, 10));
      sessionStorage.removeItem("entryCardIndex");
    }
  }, []);

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
    <>
      <div className="flex flex-col justify-center items-center w-full h-dvh">
        <span className="text-3xl font-bold mt-8 z-30">Explore</span>
        <div className="relative flex-1 flex items-center justify-center mt-6">
          <motion.div
            className="absolute cursor-pointer -left-1 lg:-left-3 top-1/2 transform -translate-y-1/2 h-8 w-8 z-20"
            onClick={() => handleSwipe("right")} // @ts-ignore
            animate={leftArrowAnimation}
          >
            <ChevronDoubleLeftIcon />
          </motion.div>
          {loading ? (
            <div className="flex items-center justify-center bg-black bg-opacity-75 z-50">
              <motion.img
                src="/logo-white.svg"
                alt="Loading"
                className="h-20 md:h-24 lg:h-28"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : (
            <AnimatePresence>
              {articles.length > 0 && (
                <>
                  <motion.div
                    key={
                      articles[
                        (currentIndex - 1 + articles.length) % articles.length
                        // @ts-ignore
                      ]?.id
                    }
                    className="absolute cursor-pointer"
                    style={{ zIndex: 0 }}
                    initial={{ x: -50, y: -25, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, y: 25, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <Card
                      id={
                        articles[
                          (currentIndex - 1 + articles.length) % articles.length
                          // @ts-ignore
                        ]?.id
                      }
                      imageUrl={
                        articles[
                          (currentIndex - 1 + articles.length) % articles.length
                          // @ts-ignore
                        ]?.imageUrl
                      }
                      title={
                        articles[
                          (currentIndex - 1 + articles.length) % articles.length
                          // @ts-ignore
                        ]?.title
                      }
                      category={
                        articles[
                          (currentIndex - 1 + articles.length) % articles.length
                          // @ts-ignore
                        ]?.categoryTitle
                      }
                      blurhash={
                        articles[
                          (currentIndex - 1 + articles.length) % articles.length
                          // @ts-ignore
                        ]?.blurhash
                      }
                    />
                  </motion.div>

                  <motion.div
                    // @ts-ignore

                    key={articles[currentIndex]?.id}
                    className="relative z-10 cursor-pointer"
                    onClick={() =>
                      handleClick(articles[currentIndex], currentIndex)
                    }
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(event, info) => {
                      if (info.offset.x < -100) {
                        handleSwipe("left");
                      } else if (info.offset.x > 100) {
                        handleSwipe("right");
                      }
                    }}
                    initial={{ x: 0, y: -15, opacity: 0 }}
                    animate={{ x: 0, y: -15, opacity: 1 }}
                    exit={{ x: 0, y: 15, opacity: 0 }}
                    dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
                    transition={{ duration: 0.5 }}
                    // @ts-ignore
                    layoutId={`card-${articles[currentIndex]?.id}`}
                  >
                    <Card
                      // @ts-ignore
                      id={articles[currentIndex]?.id}
                      // @ts-ignore
                      imageUrl={articles[currentIndex]?.imageUrl}
                      // @ts-ignore
                      title={articles[currentIndex]?.title}
                      // @ts-ignore
                      category={articles[currentIndex]?.categoryTitle}
                      // @ts-ignore
                      blurhash={articles[currentIndex]?.blurhash}
                    />
                  </motion.div>

                  <motion.div
                    // @ts-ignore
                    key={articles[(currentIndex + 1) % articles.length]?.id}
                    className="absolute cursor-pointer"
                    style={{ zIndex: 0 }}
                    initial={{ x: 50, y: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, y: 20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <Card
                      id={
                        // @ts-ignore
                        articles[(currentIndex + 1) % articles.length]?.id
                      }
                      imageUrl={
                        // @ts-ignore
                        articles[(currentIndex + 1) % articles.length]?.imageUrl
                      }
                      title={
                        // @ts-ignore
                        articles[(currentIndex + 1) % articles.length]?.title
                      }
                      category={
                        // @ts-ignore
                        articles[(currentIndex + 1) % articles.length]
                          ?.categoryTitle
                      }
                      blurhash={
                        // @ts-ignore
                        articles[(currentIndex + 1) % articles.length]?.blurhash
                      }
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          )}
          <motion.div
            className="absolute cursor-pointer -right-2 lg:-right-4 top-1/2 transform -translate-y-1/2 h-8 w-8 z-10"
            // onClick={() => handleRightArrowClick()}
            onClick={() => handleSwipe("left")}
            // @ts-ignore
            animate={rightArrowAnimation}
          >
            <ChevronDoubleRightIcon />
          </motion.div>
          <LoginRegisterModal />
        </div>
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
              <Image
                width={100}
                height={100}
                className="h-20 md:h-24 lg:h-28"
                src="/logo-white.svg"
                alt="Logo"
              />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <LoadingScreen />
    </>
  );
};

export default Explore;
