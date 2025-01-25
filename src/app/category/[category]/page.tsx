"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Card from "../../components/Story/Card";
import LoadingScreen from "@/app/components/Loading/LoadingScreen";

const CategoryPage = ({ params }: { params: { category: string } }) => {
  const { category } = params;

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
        `/${card.category}/${card.slug}-${card.id}?explore=${card.category}`
      );
    }, 500);
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
          category: article.category,
          imageUrl:
            "https://api.gyaanhub.io" + article.imageUrl,
        }));
        console.log("Articles by Category", extractedArticles, data);
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
      <div className="explore-container flex flex-col items-center justify-center h-screen snap-y snap-mandatory overflow-y-scroll overflow-x-hidden">
        <span className="text-2xl font-bold mt-6 -mb-8">
          {category.toLocaleUpperCase()}
        </span>
        <div className="card-wrapper flex items-center justify-center w-full h-dvh">
          <AnimatePresence mode="wait">
            {articles.length > 0 && (
              <motion.div
                // @ts-ignore
                key={articles[currentIndex].id}
                className="snap-center cursor-pointer"
                onClick={() => handleClick(articles[currentIndex])}
                whileTap={{ scale: 0.95 }}
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
                dragTransition={{ bounceStiffness: 100, bounceDamping: 20 }}
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
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 0.95 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <img
              // @ts-ignore
              src={selectedCard.imageUrl}
              // @ts-ignore
              alt={selectedCard.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <LoadingScreen />
    </>
  );
};

export default CategoryPage;
