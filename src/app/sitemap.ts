import type { MetadataRoute } from "next";
import { LESSONS } from "@/lib/lessons";
import { SITE_URL } from "@/lib/site";

/** Static content routes worth indexing (history is a personal dashboard). */
const STATIC_ROUTES = [
  "",
  "/lessons",
  "/free",
  "/guide",
  "/about",
  "/myanmar-unicode",
  "/myanmar-keyboard",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
  const lessons = LESSONS.map((lesson) => ({
    url: `${SITE_URL}/practice/${lesson.id}`,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));
  return [...pages, ...lessons];
}
