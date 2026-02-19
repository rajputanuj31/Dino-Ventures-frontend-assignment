export type MediaType = "YOUTUBE" | "MP4";

export interface Category {
  slug: string;
  name: string;
  iconUrl: string;
}

export interface Video {
  title: string;
  mediaUrl: string;
  mediaType: MediaType;
  thumbnailUrl: string;
  slug: string;
}

export interface CategoryWithVideos {
  category: Category;
  contents: Video[];
}

