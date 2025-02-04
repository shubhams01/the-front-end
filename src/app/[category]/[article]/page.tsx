import React from "react";
import { Metadata } from "next";
import Details from "@/app/components/Story/CardDetails";

export async function generateMetadata({
  params,
}): Promise<Metadata> {
  const { category, article } = await params;
  const segments = article.split("-");
  const articleId = segments[segments.length - 1];
  // console.log("articleId", params, articleId);

  const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/article/${articleId}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch article metadata");
    }

    const article = await response.json();
    // console.log("metadata response", article);

    // Extract key fields for metadata
    const title = article?.Title || "Gyaanhub";
    const description =
      article?.Title ||
      "Explore this article on Gyaanhub for insightful content.";
    const imageUrl = article.sections[0]?.SectionImage?.formats?.large?.url
      ? "https://api.gyaanhub.io" +
        article.sections[0]?.SectionImage?.formats?.large?.url
      : "/default-og-image.jpg"; // Fallback image if none exists

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://gyaanhub.io/${category}/${article.Slug}-${articleId}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${title} Cover Image`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Gyaanhub",
      description: "Explore insightful articles on Gyaanhub.",
    };
  }
}

const DetailsPage = () => {
  return (
    <>
      <Details />
    </>
  );
};

export default DetailsPage;
