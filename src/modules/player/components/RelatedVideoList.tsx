"use client";

import Image from "next/image";
import { usePlayerStore } from "@/modules/player/state/playerStore";
import { getVideosByCategorySlug } from "@/lib/videos";
import type { Video, Category } from "@/types/video";

interface RelatedItemProps {
  video: Video;
  category: Category;
}

function RelatedItem({ video, category }: RelatedItemProps) {
  const openVideo = usePlayerStore((s) => s.openVideo);

  return (
    <button
      type="button"
      onClick={() => openVideo(video, category)}
      className="flex w-full gap-3 rounded-lg p-2 text-left transition-colors hover:bg-zinc-800/60 active:bg-zinc-800"
    >
      <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-md bg-zinc-800">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h4 className="line-clamp-2 text-xs font-medium leading-snug text-white">
          {video.title}
        </h4>
        <span className="mt-1 text-[10px] text-zinc-500">
          {category.name}
        </span>
      </div>
    </button>
  );
}

export function RelatedVideoList() {
  const currentVideo = usePlayerStore((s) => s.currentVideo);
  const currentCategory = usePlayerStore((s) => s.currentCategory);

  if (!currentCategory || !currentVideo) return null;

  const videos = getVideosByCategorySlug(currentCategory.slug).filter(
    (v) => v.slug !== currentVideo.slug,
  );

  if (videos.length === 0) return null;

  return (
    <div className="mt-4 space-y-1">
      <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        More in {currentCategory.name}
      </h3>
      <div className="space-y-0.5">
        {videos.map((video) => (
          <RelatedItem
            key={video.slug}
            video={video}
            category={currentCategory}
          />
        ))}
      </div>
    </div>
  );
}
