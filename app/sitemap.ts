import type { MetadataRoute } from "next";

const baseUrl = "https://sunnyvibz.fr";

const routes = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/a-propos", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/agenda", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/galerie", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/talents", priority: 0.88, changeFrequency: "weekly" as const },
  { path: "/partenaires", priority: 0.78, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
