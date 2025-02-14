"use client";
import React, { useState, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Categories = () => {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/categories`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
            },
          });
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        const extractedCategories = data.map((category) => ({
          name: category.Title,
          slug: category.Slug,
          imageUrl: 'https://api.gyaanhub.io' + category.Image,
          blurhash: category.blurhash,
        }));
        console.log("categories ", extractedCategories);
        setLoading(false);
        setCategories(extractedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (category) => {
    console.log("category clicked: ", category);
    sessionStorage.setItem("jumpToCategories", "true");
    setTimeout(() => {
      router.push(`/category?type=${category.slug}`);
    }, 500);
  };

  return (
    <div className="container mx-auto px-8 py-8 flex flex-col items-center">
      <div className="top-8 mb-4 flex flex-col items-center">
        <span className="text-center text-3xl font-bold z-10">Categories</span>
      </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 cursor-pointer">
        {categories.map((category, index) => (
          <div key={index} onClick={() => handleClick(category)}>
            <CategoryCard
              // @ts-ignore
              key={category.id}
              // @ts-ignore
              category={category.name}
              // @ts-ignore
              imageUrl={category.imageUrl}
              // @ts-ignore
              slug={category.slug}
              // @ts-ignore
              blurhash={category.blurhash}
            />
          </div>
        ))}
      </div>)}
    </div>
  );
};

export default Categories;
