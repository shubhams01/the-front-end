"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useAnimation, animate } from "framer-motion";
import Card from "../Story/Card";
import { useModal } from "@/app/context/ModalContext";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import LoginRegisterModal from "../Modal/LoginRegisterModal";
import { useAuthStore } from "@/app/store/authStore";
import { getAuthToken } from "@/app/hooks/useLocalStorageAuth";

const Explore = () => {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { setIsLoginOpen } = useModal();
  const { isLoggedIn } = useAuthStore();
  const token = getAuthToken();

  const overlayControls = useAnimation();

  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  const handleClick = (card: never) => {
    console.log("card ", card);
    setSelectedCard(card);
    setTimeout(() => {
      // @ts-ignore
      router.push(`/${card.category}/${card.slug}-${card.id}?explore=explore`);
    }, 1000);
  };

  const handleSwipe = (direction: string) => {
    if (direction === "left") {
      if (currentIndex < articles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0); // Loop to first card
      }
      setIsLoginOpen(false);
    } else if (direction === "right") {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else {
        setCurrentIndex(articles.length - 1); // Loop to last card
      }
      setIsLoginOpen(false);
    }
  };

  const handleLeftArrowClick = () => {
    if (currentIndex < articles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop to first card
    }
  };

  const handleRighttArrowClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(articles.length - 1); // Loop to last card
    }
  };

  useEffect(() => {
    console.log("apiUrl ", apiUrl);
    const fetchData = async () => {
      await overlayControls.start({ y: "0%" });
      try {
        const endpoint = isLoggedIn
          ? `https://striking-basketball-1ff3829bbe.strapiapp.com/api/recommendations`
          : `https://striking-basketball-1ff3829bbe.strapiapp.com/api/explore`;

        const headers = isLoggedIn ? { Authorization: `Bearer ${token}` } : {};
        // @ts-ignore
        const response = await fetch(endpoint, { headers });
        if (!response.ok) {
          throw new Error("Failed to fetch Articles");
        }
        const data = await response.json();
        console.log("data ", data);
        const extractedArticles = data.map((article: any) => ({
          id: article?.id,
          title: article?.Title,
          slug: article?.Slug,
          category: article?.category.Title,
          imageUrl: article.Image[0]?.formats.large.url,
        }));
        console.log(
          `Articles ${isLoggedIn ? "recommended" : "explore"}`,
          extractedArticles
        );
        setArticles(extractedArticles);
        await overlayControls.start({ y: "-100%" });
      } catch (error) {
        console.error("Error fetching Articles:", error);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const rotateLeftAnimation = {
    rotate: [0, -20, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    },
  };

  const rotateRightAnimation = {
    rotate: [0, 20, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    },
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-screen">
        <span className="text-3xl font-bold mt-6 z-30">Explore</span>
        <div className="relative flex-1 flex items-center justify-center">
          <motion.img
            src="/left-swipe.png"
            alt="left-swipe"
            className="absolute cursor-pointer left-0 top-1/2 transform -translate-y-1/2 h-8 w-8 z-20"
            onClick={() => handleLeftArrowClick()}
            // @ts-ignore
            animate={rotateLeftAnimation}
          />
          <AnimatePresence>
            {articles.length > 0 && (
              <>
                <motion.div
                  key={
                    articles[
                      (currentIndex - 1 + articles.length) % articles.length
                      // @ts-ignore
                    ].id
                  }
                  className="absolute cursor-pointer"
                  style={{ zIndex: 0 }}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Card
                    id={
                      articles[
                        (currentIndex - 1 + articles.length) % articles.length
                        // @ts-ignore
                      ].id
                    }
                    imageUrl={
                      articles[
                        (currentIndex - 1 + articles.length) % articles.length
                        // @ts-ignore
                      ].imageUrl
                    }
                    title={
                      articles[
                        (currentIndex - 1 + articles.length) % articles.length
                        // @ts-ignore
                      ].title
                    }
                    category={
                      articles[
                        (currentIndex - 1 + articles.length) % articles.length
                        // @ts-ignore
                      ].category
                    }
                  />
                </motion.div>

                <motion.div
                  // @ts-ignore

                  key={articles[currentIndex].id}
                  className="relative z-10 cursor-pointer"
                  onClick={() => handleClick(articles[currentIndex])}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(event, info) => {
                    if (info.offset.x < -100) {
                      handleSwipe("left");
                    } else if (info.offset.x > 100) {
                      handleSwipe("right");
                    }
                  }}
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
                  transition={{ duration: 0.5 }}
                  // @ts-ignore
                  layoutId={`card-${articles[currentIndex].id}`}
                >
                  <Card
                    // @ts-ignore
                    id={articles[currentIndex].id}
                    // @ts-ignore
                    imageUrl={articles[currentIndex].imageUrl}
                    // @ts-ignore
                    title={articles[currentIndex].title}
                    // @ts-ignore
                    category={articles[currentIndex].category}
                  />
                </motion.div>

                <motion.div
                  // @ts-ignore
                  key={articles[(currentIndex + 1) % articles.length].id}
                  className="absolute cursor-pointer"
                  style={{ zIndex: 0 }}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Card
                    id={
                      // @ts-ignore
                      articles[(currentIndex + 1) % articles.length].id
                    }
                    imageUrl={
                      // @ts-ignore
                      articles[(currentIndex + 1) % articles.length].imageUrl
                    }
                    title={
                      // @ts-ignore
                      articles[(currentIndex + 1) % articles.length].title
                    }
                    category={
                      // @ts-ignore
                      articles[(currentIndex + 1) % articles.length].category
                    }
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <motion.img
            src="/right-swipe.png"
            alt="right-swipe"
            className="absolute cursor-pointer -right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 z-10"
            onClick={() => handleRighttArrowClick()}
            // @ts-ignore
            animate={rotateRightAnimation}
          />
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
            transition={{ duration: 0.75, ease: "easeInOut" }}
          >
            <img
              // @ts-ignore
              src={selectedCard.imageUrl}
              // @ts-ignore
              alt={selectedCard.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed top-0 left-0 w-full h-screen bg-slate-900 z-50 flex items-center justify-center"
        initial={{ y: "0%" }}
        animate={overlayControls}
        transition={{ duration: 1 }}
      >
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        >
          <img className="h-20 md:h-24 lg:h-28" src="/logo.png" alt="Logo" />
        </motion.span>
      </motion.div>
    </>
  );
};

export default Explore;
