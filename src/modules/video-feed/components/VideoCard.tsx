"use client";

import Image from "next/image";
import type { Category, Video } from "@/types/video";
import { usePlayerStore } from "@/modules/player/state/playerStore";

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
      className="group flex w-full gap-3 rounded-lg p-2 text-left transition-colors hover:bg-zinc-900 active:bg-zinc-800"
    >
      <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-md bg-zinc-800">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          sizes="160px"
          className="object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-white">
          {video.title}
        </h3>

        <div className="mt-auto flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
            {category.name}
          </span>
        </div>
      </div>
    </button>
  );
}
