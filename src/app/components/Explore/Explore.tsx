"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Card from "../Card";
// import cardsData from "../../../app/CardData.json";

const Explore = () => {
  const router = useRouter();

  const [articles, setArticles] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const overlayControls = useAnimation();

  const handleClick = (card) => {
    console.log("card ", card);
    setSelectedCard(card);
    setTimeout(() => {
      router.push(`/${card.category}/${card.slug}-${card.id}`);
    }, 500);
  };

  useEffect(() => {
    const fetchData = async () => {
      await overlayControls.start({ y: "0%" });
      try {
        const response = await fetch(
          "http://localhost:1337/api/articles"
          // {
          //   headers: {
          //     Authorization: `Bearer f4da5bebc8dd837c1df99461784738662f5d9ee1505673fb922b0f547870eb17ba70cddfdb07033e591c38f02019ec1bf4468f8c036ab1a3936e26ecf55f896af48f83aac5dd25403f479576733b0aee60fdeff94806dfb4401d0ebc480cf7594d56aa82ad1e1e2690201bec49a2a0d3430125130bea3dc587cfff137de5d454`,
          //   },
          // }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Articles");
        }
        const data = await response.json();
        const extractedArticles = data.map((article: any) => ({
          id: article.id,
          title: article.Title,
          slug: article.Slug,
          category: article.category.Slug,
          imageUrl:
            "http://localhost:1337" +
            article.Image[0].formats.large.url,
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
        <span className="text-4xl font-bold mt-10">Explore</span>
        <div className="card-wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {articles.map((card, index) => (
            <motion.div
              key={index}
              className="snap-center cursor-pointer"
              onClick={() => handleClick(card)}
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              layoutId={`card-${card.id}`}
            >
              <Card
                key={index}
                id={card.id}
                imageUrl={card.imageUrl}
                title={card.title}
                category={card.category}
              />
            </motion.div>
          ))}
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
              src={selectedCard.imageUrl}
              alt={selectedCard.title}
              className="w-full h-full object-cover rounded-lg"
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
