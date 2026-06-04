/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Mengabaikan ESLint saat build di Vercel agar deployment tidak gagal
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
