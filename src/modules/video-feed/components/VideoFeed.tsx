"use client";

import type { CategoryWithVideos } from "@/types/video";
import { CategorySection } from "./CategorySection";

interface VideoFeedProps {
  categoryEntries: CategoryWithVideos[];
}

export function VideoFeed({ categoryEntries }: VideoFeedProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-20 border-b border-zinc-800/60 bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1800px] items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold tracking-tight">
            Dino Videos
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-[1800px] px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {categoryEntries.map((entry) => (
            <CategorySection key={entry.category.slug} entry={entry} />
          ))}
        </div>
      </div>
    </main>
  );
}
