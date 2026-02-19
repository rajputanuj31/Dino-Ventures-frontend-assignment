"use client";

import type { CategoryWithVideos } from "@/types/video";
import { CategorySection } from "./CategorySection";

interface VideoFeedProps {
  categoryEntries: CategoryWithVideos[];
}

export function VideoFeed({ categoryEntries }: VideoFeedProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-xl px-4 pb-24 pt-6 space-y-6">
        <header>
          <h1 className="text-xl font-semibold tracking-tight">
            Dino Ventures Videos
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Scrollable feed of videos grouped by category, following the
            assignment spec.
          </p>
        </header>

        <div className="space-y-8">
          {categoryEntries.map((entry) => (
            <CategorySection key={entry.category.slug} entry={entry} />
          ))}
        </div>
      </div>
    </main>
  );
}

