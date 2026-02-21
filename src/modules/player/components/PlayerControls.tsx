"use client";

import { formatSecondsToTimeLabel } from "@/lib/time";
import { SeekBar } from "./SeekBar";

interface PlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onSkip: (seconds: number) => void;
  onSeek: (time: number) => void;
}

export function PlayerControls({
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onSkip,
  onSeek,
}: PlayerControlsProps) {
  return (
    <div className="space-y-2">
      <SeekBar currentTime={currentTime} duration={duration} onSeek={onSeek} />

      <div className="flex items-center justify-between">
        <span className="text-xs tabular-nums text-zinc-400">
          {formatSecondsToTimeLabel(currentTime)} / {formatSecondsToTimeLabel(duration)}
        </span>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onSkip(-10)}
            className="rounded-full p-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 active:bg-zinc-700"
            aria-label="Skip back 10 seconds"
          >
            -10s
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105 active:scale-95"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="3" y="2" width="4" height="12" rx="1" />
                <rect x="9" y="2" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 2.5v11l10-5.5L4 2.5z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSkip(10)}
            className="rounded-full p-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 active:bg-zinc-700"
            aria-label="Skip forward 10 seconds"
          >
            +10s
          </button>
        </div>

        <div className="w-16" />
      </div>
    </div>
  );
}
