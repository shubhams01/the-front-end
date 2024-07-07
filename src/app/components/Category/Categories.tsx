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
        const response = await fetch(
          "http://localhost:1337/api/categories?populate=*",
          {
            headers: {
              Authorization: `Bearer f4da5bebc8dd837c1df99461784738662f5d9ee1505673fb922b0f547870eb17ba70cddfdb07033e591c38f02019ec1bf4468f8c036ab1a3936e26ecf55f896af48f83aac5dd25403f479576733b0aee60fdeff94806dfb4401d0ebc480cf7594d56aa82ad1e1e2690201bec49a2a0d3430125130bea3dc587cfff137de5d454`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        const extractedCategories = data.data.map((category) => ({
          name: category.attributes.Title,
          slug: category.attributes.Slug,
          imageUrl:
            "http://localhost:1337" +
              category.attributes.image.data.attributes.formats.large.url ||
            category.attributes.image.data.attributes.url,
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
      <div className="top-8 z-10 flex flex-col items-center">
        <span className="text-center text-3xl font-bold">Categories</span>
        <div className="flex justify-center w-full">
          <hr className="w-full my-2" />
        </div>
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