"use client";

import Image from "next/image";
import { usePlayerStore } from "@/modules/player/state/playerStore";

export function MiniPlayer() {
  const currentVideo = usePlayerStore((s) => s.currentVideo);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const restore = usePlayerStore((s) => s.restore);
  const close = usePlayerStore((s) => s.close);
  const setPlaying = usePlayerStore((s) => s.setPlaying);

  if (!currentVideo) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="animate-slide-up fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950 safe-bottom">
      {/* Progress indicator */}
      <div className="h-0.5 w-full bg-zinc-800">
        <div
          className="h-full bg-white/70 transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto flex max-w-xl items-center gap-3 px-3 py-2">
        {/* Thumbnail */}
        <button
          type="button"
          onClick={restore}
          className="relative aspect-video w-20 shrink-0 overflow-hidden rounded-md bg-zinc-800 transition-transform active:scale-95"
          aria-label="Expand player"
        >
          <Image
            src={currentVideo.thumbnailUrl}
            alt={currentVideo.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        </button>

        {/* Title */}
        <button
          type="button"
          onClick={restore}
          className="min-w-0 flex-1 text-left"
          aria-label="Expand player"
        >
          <p className="truncate text-sm font-medium text-white">
            {currentVideo.title}
          </p>
        </button>

        {/* Play/Pause */}
        <button
          type="button"
          onClick={() => setPlaying(!isPlaying)}
          className="shrink-0 rounded-full p-2 text-white transition-all hover:bg-zinc-800 active:scale-90"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
              <rect x="4" y="3" width="4.5" height="14" rx="1" />
              <rect x="11.5" y="3" width="4.5" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3v14l12-7L5 3z" />
            </svg>
          )}
        </button>

        {/* Close */}
        <button
          type="button"
          onClick={close}
          className="shrink-0 rounded-full p-2 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white active:scale-90"
          aria-label="Close player"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 5l8 8M13 5l-8 8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
