// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      BASE_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
    },
  };
  
export default nextConfig;