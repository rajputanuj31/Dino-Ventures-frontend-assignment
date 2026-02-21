"use client";

import { useState, useCallback } from "react";
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
  const [skipFeedback, setSkipFeedback] = useState<number | null>(null);

  const handleSkip = useCallback(
    (seconds: number) => {
      onSkip(seconds);
      setSkipFeedback(seconds);
      setTimeout(() => setSkipFeedback(null), 500);
    },
    [onSkip],
  );

  return (
    <div className="space-y-3">
      <SeekBar currentTime={currentTime} duration={duration} onSeek={onSeek} />

      <div className="flex items-center justify-between">
        <span className="min-w-[80px] text-xs tabular-nums text-zinc-400">
          {formatSecondsToTimeLabel(currentTime)}{" "}
          <span className="text-zinc-600">/</span>{" "}
          {formatSecondsToTimeLabel(duration)}
        </span>

        <div className="relative flex items-center gap-5">
          {/* Skip feedback overlay */}
          {skipFeedback !== null && (
            <div className="skip-animation pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white/80">
                {skipFeedback > 0 ? `+${skipFeedback}s` : `${skipFeedback}s`}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => handleSkip(-10)}
            className="rounded-full p-2.5 text-xs font-semibold text-zinc-300 transition-all hover:bg-zinc-800 active:scale-90"
            aria-label="Skip back 10 seconds"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 17l-5-5 5-5" />
              <text x="14" y="15" fill="currentColor" stroke="none" fontSize="8" fontWeight="bold">10</text>
            </svg>
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg shadow-white/10 transition-transform hover:scale-105 active:scale-95"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                <rect x="3" y="2" width="4" height="12" rx="1" />
                <rect x="9" y="2" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 2.5v11l10-5.5L4 2.5z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSkip(10)}
            className="rounded-full p-2.5 text-xs font-semibold text-zinc-300 transition-all hover:bg-zinc-800 active:scale-90"
            aria-label="Skip forward 10 seconds"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 17l5-5-5-5" />
              <text x="2" y="15" fill="currentColor" stroke="none" fontSize="8" fontWeight="bold">10</text>
            </svg>
          </button>
        </div>

        <div className="min-w-[80px]" />
      </div>
    </div>
  );
}
