"use client";

import Image from "next/image";
import { usePlayerStore } from "@/modules/player/state/playerStore";
import { getVideosByCategorySlug } from "@/lib/videos";
import { formatSecondsToTimeLabel } from "@/lib/time";
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
      className="group w-full text-left"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-800">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 transition-all group-hover:ring-white/20" />
        {video.durationSeconds > 0 && (
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium tabular-nums text-white">
            {formatSecondsToTimeLabel(video.durationSeconds)}
          </span>
        )}
      </div>
      <div className="mt-2.5 flex gap-3">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-zinc-800">
          <Image
            src={category.iconUrl}
            alt=""
            fill
            sizes="32px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-2 text-sm font-medium leading-snug text-white">
            {video.title}
          </h4>
          <p className="mt-0.5 text-xs text-zinc-400">
            {category.name}
          </p>
        </div>
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
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        More in {currentCategory.name}
      </h3>
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
