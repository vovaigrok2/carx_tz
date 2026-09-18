import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    turbopack: {
        rules: {
            "*.module.less": {
                loaders: ["less-loader"],
                as: "*.module.css",
            },
            "*.less": {
                loaders: ["less-loader"],
                as: "*.css",
            },
        },
    },
};

export default nextConfig;