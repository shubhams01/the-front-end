"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Card from "../Card";

const Explore = () => {
  const router = useRouter();

  const [articles, setArticles] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const overlayControls = useAnimation();

  const handleClick = (card) => {
    console.log("card ", card);
    setSelectedCard(card);
    setTimeout(() => {
      router.push(`/${card.category}/${card.slug}-${card.id}?explore=explore`);
    }, 1000);
  };

  const handleSwipe = (direction) => {
    if (direction === "left" && currentIndex < articles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "right" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await overlayControls.start({ y: "0%" });
      try {
        const response = await fetch("http://localhost:1337/api/articles");
        if (!response.ok) {
          throw new Error("Failed to fetch Articles");
        }
        const data = await response.json();
        const extractedArticles = data.map((article) => ({
          id: article.id,
          title: article.Title,
          slug: article.Slug,
          category: article.category.Title,
          imageUrl:
            "http://localhost:1337" + article.Image[0].formats.large.url,
        }));
        console.log("Articles ", extractedArticles, data);
        setArticles(extractedArticles);
        await overlayControls.start({ y: "-100%" });
      } catch (error) {
        console.error("Error fetching Articles:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="explore-container flex flex-col items-center justify-center min-h-screen snap-y snap-mandatory overflow-y-scroll overflow-x-hidden">
        <span className="text-3xl font-bold mt-4 z-30">Explore</span>
        <div className="card-wrapper flex items-center justify-center w-full h-full relative">
          <AnimatePresence initial={false}>
            {articles.length > 0 && (
              <>
                {currentIndex > 0 && (
                  <motion.div
                    key={articles[currentIndex - 1].id}
                    className="absolute cursor-pointer"
                    style={{ zIndex: 0 }}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <Card
                      id={articles[currentIndex - 1].id}
                      imageUrl={articles[currentIndex - 1].imageUrl}
                      title={articles[currentIndex - 1].title}
                      category={articles[currentIndex - 1].category}
                    />
                  </motion.div>
                )}
                <motion.div
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
                  layoutId={`card-${articles[currentIndex].id}`}
                >
                  <Card
                    id={articles[currentIndex].id}
                    imageUrl={articles[currentIndex].imageUrl}
                    title={articles[currentIndex].title}
                    category={articles[currentIndex].category}
                  />
                </motion.div>
                {currentIndex < articles.length - 1 && (
                  <motion.div
                    key={articles[currentIndex + 1].id}
                    className="absolute cursor-pointer"
                    style={{ zIndex: 0 }}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <Card
                      id={articles[currentIndex + 1].id}
                      imageUrl={articles[currentIndex + 1].imageUrl}
                      title={articles[currentIndex + 1].title}
                      category={articles[currentIndex + 1].category}
                    />
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
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
              src={selectedCard.imageUrl}
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
