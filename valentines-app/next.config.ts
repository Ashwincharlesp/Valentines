import type { NextConfig } from "next";

// GitHub Pages: repo name becomes base path (e.g. https://username.github.io/Valentines/)
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const basePath = repoName ? `/${repoName}` : "";
const assetPrefix = repoName ? `/${repoName}/` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: assetPrefix || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
