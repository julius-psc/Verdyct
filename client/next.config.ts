import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import path from "path";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    // Enable native browser View Transitions for ultra-smooth page navigation
    viewTransition: true,
    // Optimize icon imports to reduce bundle size
    optimizePackageImports: ['lucide-react', '@tabler/icons-react'],
  },
  compiler: {
    // Remove console.log in production for cleaner output and smaller bundle
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default withNextIntl(nextConfig);
