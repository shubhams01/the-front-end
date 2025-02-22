import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../Story/Card";
import { getAuthToken } from "@/app/hooks/useLocalStorageAuth";
import { set } from "react-hook-form";

interface LikedSavedPostsProps {
  title: string;
  postsType: string;
  closePanel: () => void;
}

const LikedSavedPosts: React.FC<LikedSavedPostsProps> = ({
  title,
  postsType,
  closePanel,
}) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragDirection, setDragDirection] = useState<"x" | "y" | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const token = getAuthToken();
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState(null);

  const panelVariants = {
    open: { y: 0 },
    closed: { y: "100%" },
  };

  const API_URL = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}`;

  const fetchPosts = async () => {
    const endpoint = postsType === "Liked" ? "liked" : "saved";
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      console.log("likedOrSavedData ", data);

      const likedOrSavedPosts = data.map((item: any) => ({
        id: item.article.id,
        title: item.article.Title,
        slug: item.article.Slug,
        categoryTitle: item.article.category.Title,
        categorySlug: item.article.category.Slug,
        imageUrl:
          "https://api.gyaanhub.io" + item.article.Image[0].formats.large.url,
        blurhash: item.article.blurhash,
      }));
      console.log("likedOrSavedPosts ", likedOrSavedPosts);
      setPosts(likedOrSavedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [postsType, token]);

  const handleDragStart = (event, info) => {
    // Determine initial drag direction
    if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
      setDragDirection("x");
    } else {
      setDragDirection("y");
    }
  };

  const handleDragEnd = (event, info) => {
    if (dragDirection === "y" && info.offset.y > 100) {
      // Swiped down, close panel
      closePanel();
    } else if (dragDirection === "x") {
      if (info.offset.x > 100) {
        // Swiped right, go to previous card
        setDirection(-1);
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (info.offset.x < -100) {
        // Swiped left, go to next card
        setDirection(1);
        setCurrentIndex((prevIndex) =>
          Math.min(prevIndex + 1, posts.length - 1)
        );
      }
    }
    setDragDirection(null); // Reset drag direction after swipe
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const handleClick = (card: any) => {
    console.log("cardLikedorSaved ", card);
    setSelectedCard(card);
    setTimeout(() => {
      // @ts-ignore
      router.push(
        `/${card.categorySlug}/${card.slug}-${card.id}?section=explore`
      );
    }, 1000);
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      initial="closed"
      animate="open"
      variants={panelVariants}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.5,
      }}
      className="fixed bottom-0 left-0 right-0 top-0 p-4 z-10 bg-gradient-to-r from-slate-500 to-slate-800"
    >
      <div className="flex justify-center items-center mb-1">
        <h2 className="text-2xl font-bold text-center text-white">
          {title} Posts
        </h2>
      </div>
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {posts.length > 0 && (
            <motion.div
              key={posts[currentIndex]?.id}
              className="absolute top-0 left-0 right-0 bottom-0 flex justify-center"
              custom={direction}
              variants={variants}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              onClick={() => handleClick(posts[currentIndex])}
            >
              <Card
                id={posts[currentIndex]?.id}
                imageUrl={posts[currentIndex]?.imageUrl}
                title={posts[currentIndex]?.title}
                category={posts[currentIndex]?.categoryTitle}
                blurhash={posts[currentIndex]?.blurhash || "LEHV6nWB2yk8pyo0adR*.7kCMdnj"}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {selectedCard && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1}}
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
    </motion.div>
  );
};

export default LikedSavedPosts;
