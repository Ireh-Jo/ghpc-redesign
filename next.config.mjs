/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // 결정 안 됨(context/02-architecture.md): Supabase Storage 도메인 등록 예정.
    // 현재는 시안 placeholder(unsplash) + 유튜브 썸네일만.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
};

export default nextConfig;
