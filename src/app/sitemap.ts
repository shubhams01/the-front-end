import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/explore?page=1&pageSize=50`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap data: ${response.statusText}`);
    }

    const jsonData = await response.json();

    const posts = Array.isArray(jsonData?.data) ? jsonData.data : [];

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: "https://gyaanhub.io",
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 1,
      },
      {
        url: "https://gyaanhub.io/profile",
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: "https://gyaanhub.io/categories",
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: "https://gyaanhub.io/about",
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },
    ];

    if (posts.length === 0) {
      console.warn("No posts found for sitemap.");
      return staticRoutes;
    }

    // Dynamic routes for posts
    const dynamicRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `https://gyaanhub.io/${post.category?.Slug}/${post.Slug}-${post.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return []; 
  }
}
