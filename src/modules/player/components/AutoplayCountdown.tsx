"use client";

import type { Video } from "@/types/video";

interface AutoplayCountdownProps {
  nextVideo: Video;
  countdown: number;
  onCancel: () => void;
}

export function AutoplayCountdown({
  nextVideo,
  countdown,
  onCancel,
}: AutoplayCountdownProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        {/* Countdown ring */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="#333"
              strokeWidth="2"
            />
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="113"
              className="countdown-ring"
            />
          </svg>
          <span className="text-xl font-bold text-white">{countdown}</span>
        </div>

        <div>
          <p className="text-xs text-zinc-400">Up next</p>
          <p className="mt-1 max-w-[200px] text-sm font-medium text-white line-clamp-2">
            {nextVideo.title}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-full border border-zinc-600 px-4 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-white hover:text-white active:scale-95"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
