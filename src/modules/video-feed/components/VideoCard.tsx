"use client";

import Image from "next/image";
import type { Category, Video } from "@/types/video";
import { usePlayerStore } from "@/modules/player/state/playerStore";
import { formatSecondsToTimeLabel } from "@/lib/time";

interface VideoCardProps {
  video: Video;
  category: Category;
}

export function VideoCard({ video, category }: VideoCardProps) {
  const openVideo = usePlayerStore((s) => s.openVideo);

  return (
    <button
      type="button"
      onClick={() => openVideo(video, category)}
      className="group w-full cursor-pointer text-left"
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

      <div className="mt-3 flex gap-3">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-800">
          <Image
            src={category.iconUrl}
            alt=""
            fill
            sizes="36px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-white">
            {video.title}
          </h3>
          <p className="mt-1 text-xs text-zinc-400">
            {category.name}
          </p>
        </div>
      </div>
    </button>
  );
}
