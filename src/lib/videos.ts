import data from "@/data/videos.json";
import type {
  Category,
  CategoryWithVideos,
  Video,
} from "@/types/video";

type RawData = {
  categories: CategoryWithVideos[];
};

const raw = data as RawData;
const categoryEntries: CategoryWithVideos[] = raw.categories;

export function getAllCategoryEntries(): CategoryWithVideos[] {
  return categoryEntries;
}

export function getAllCategories(): Category[] {
  return categoryEntries.map((entry) => entry.category);
}

export function getVideosByCategorySlug(slug: string): Video[] {
  const entry = categoryEntries.find(
    (c) => c.category.slug === slug,
  );
  return entry ? entry.contents : [];
}

export function getVideoBySlug(
  slug: string,
): { category: Category; video: Video } | null {
  for (const entry of categoryEntries) {
    const video = entry.contents.find((v) => v.slug === slug);
    if (video) {
      return { category: entry.category, video };
    }
  }
  return null;
}

