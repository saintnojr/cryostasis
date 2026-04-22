import { imageHosts } from './image-hosts.config.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Убираем distDir, если в этом нет жесткой необходимости. 
  // Vercel сам знает, куда собирать проект, а кастомный путь может сбить его с толку.
  
  typescript: { 
    ignoreBuildErrors: true 
  },
  // eslint: { 
  //   ignoreDuringBuilds: true 
  // },
  images: {
    remotePatterns: imageHosts,
    minimumCacheTTL: 60,
    // Добавим это для стабильности, если используешь много картинок
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Включаем поддержку серверных компонентов и динамики для Stripe
  experimental: {
    // Если используешь специфические фишки Next 15
  }
};

export default nextConfig;