"use client";

import type { Video } from "@/types/video";

interface MiniPlayerBarProps {
  video: Video;
  isPlaying: boolean;
  progress: number;
  onRestore: () => void;
  onTogglePlay: () => void;
  onClose: () => void;
}

export function MiniPlayerBar({
  video,
  isPlaying,
  progress,
  onRestore,
  onTogglePlay,
  onClose,
}: MiniPlayerBarProps) {
  return (
    <>
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          type="button"
          onClick={onRestore}
          className="min-w-0 flex-1 text-left"
          aria-label="Expand player"
        >
          <p className="truncate text-xs font-medium text-white">
            {video.title}
          </p>
        </button>

        <button
          type="button"
          onClick={onTogglePlay}
          className="shrink-0 rounded-full p-1.5 text-white transition-all hover:bg-zinc-800 active:scale-90"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <rect x="4" y="3" width="4.5" height="14" rx="1" />
              <rect x="11.5" y="3" width="4.5" height="14" rx="1" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 3v14l12-7L5 3z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-full p-1.5 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white active:scale-90"
          aria-label="Close player"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 5l8 8M13 5l-8 8" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full bg-zinc-800">
        <div
          className="h-full bg-white/70 transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}
