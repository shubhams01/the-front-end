import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/explore?page=1&pageSize=50`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
    }
  ).then((res) => res.json());

  // Static routes
  const staticRoutes = [
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

  // Dynamic routes
  const dynamicRoutes = posts.map((post) => ({
    url: `https://gyaanhub.io/${post.category.Slug}/${post.Slug}-${post.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
