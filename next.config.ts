import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const pagesBasePath = isGithubPages && repositoryName ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  experimental: {
    devtoolSegmentExplorer: false
  },
  ...(isGithubPages
    ? {
        output: "export",
        trailingSlash: true,
        basePath: pagesBasePath,
        assetPrefix: pagesBasePath ? `${pagesBasePath}/` : undefined,
        images: {
          unoptimized: true
        }
      }
    : {})
};

export default nextConfig;
