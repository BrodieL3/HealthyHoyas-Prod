let userConfig = undefined;
try {
  userConfig = await import("./v0-user-next.config");
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Turbopack optimizations
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    // Comprehensive package import optimizations
    optimizePackageImports: [
      "lucide-react",
      "@supabase/supabase-js",
      "date-fns",
      "recharts",
      "sonner",
      "@radix-ui/react-toast",
      "@radix-ui/react-slider",
      "@radix-ui/react-select",
      "@radix-ui/react-popover",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-menubar",
      "@radix-ui/react-label",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-avatar",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-accordion",
      "@radix-ui/react-tabs",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-radio-group",
      "react-hook-form",
      "class-variance-authority",
      // Internal barrel file optimization
      "@/lib/supabase",
      "@/lib/supabase/auth",
      "@/lib/supabase/nutrition",
      "@/lib/supabase/health",
      "@/lib/supabase/types",
    ],
  },
  // Proper Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    resolveAlias: {
      "@": ".",
    },
  },
  // Development performance debugging (only in dev)
  webpack:
    process.env.NODE_ENV === "development"
      ? (config, { dev, isServer }) => {
          if (dev) {
            // Add progress plugin to see what's taking time
            config.plugins = config.plugins || [];
            const webpack = require("webpack");
            config.plugins.push(
              new webpack.ProgressPlugin((percentage, message, ...args) => {
                if (percentage === 0) {
                  console.time(`Webpack build`);
                }
                if (percentage === 1) {
                  console.timeEnd(`Webpack build`);
                }
                // Log slow operations
                if (
                  message.includes("building") ||
                  message.includes("optimization")
                ) {
                  console.log(
                    `${(percentage * 100).toFixed(1)}% ${message}`,
                    args[0] || ""
                  );
                }
              })
            );
          }
          return config;
        }
      : undefined,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

mergeConfig(nextConfig, userConfig);

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return;
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === "object" &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

export default nextConfig;
