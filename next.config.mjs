/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  },
};

export default withPWA(nextConfig);

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
//     env: {
//       BASE_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
//     },
//   };

// export default nextConfig;
