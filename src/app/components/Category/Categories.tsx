"use client";
import React, { useState, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import { useRouter } from "next/navigation";

const Categories = () => {
  const router = useRouter();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        const extractedCategories = data.map((category) => ({
          name: category.Title,
          slug: category.Slug,
          imageUrl: `http://localhost:1337${category.Image}`,
        }));
        console.log("categories ", extractedCategories);
        setCategories(extractedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (category) => {
    console.log("category clicked: ", category);
    setTimeout(() => {
      router.push(`/category/${category.slug}`);
    }, 500);
  };

  return (
    <div className="container mx-auto px-8 py-8 flex flex-col items-center">
      <div className="top-8 mb-2 flex flex-col items-center">
        <span className="text-center text-3xl font-bold z-10">Categories</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <div key={index} onClick={() => handleClick(category)}>
            <CategoryCard
              key={category.id}
              category={category.name}
              imageUrl={category.imageUrl}
              slug={category.slug}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
