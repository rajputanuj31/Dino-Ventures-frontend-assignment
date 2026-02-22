"use client";

import type { Video } from "@/types/video";
import { PlayerControls } from "./PlayerControls";
import { RelatedVideoList } from "./RelatedVideoList";
import { AutoplayCountdown } from "./AutoplayCountdown";

interface FullPlayerUIProps {
  video: Video;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  controlsVisible: boolean;
  gestureHandlers: Record<string, React.PointerEventHandler>;
  isDragging: boolean;
  nextVideo: Video | null;
  countdown: number;
  isCountingDown: boolean;
  onTogglePlay: () => void;
  onSkip: (seconds: number) => void;
  onSeek: (time: number) => void;
  onMinimize: () => void;
  onClose: () => void;
  onCancelAutoplay: () => void;
}

export function FullPlayerUI({
  video,
  isPlaying,
  currentTime,
  duration,
  controlsVisible,
  gestureHandlers,
  isDragging,
  nextVideo,
  countdown,
  isCountingDown,
  onTogglePlay,
  onSkip,
  onSeek,
  onMinimize,
  onClose,
  onCancelAutoplay,
}: FullPlayerUIProps) {
  return (
    <>
      {/* Tap overlay for play/pause + drag gesture */}
      <div
        className={`absolute inset-0 z-10 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ touchAction: "none" }}
        onClick={onTogglePlay}
        {...gestureHandlers}
      />

      {isCountingDown && nextVideo && (
        <AutoplayCountdown
          nextVideo={nextVideo}
          countdown={countdown}
          onCancel={onCancelAutoplay}
        />
      )}

      {/* Top bar: minimize + close */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-30 transition-opacity duration-300"
        style={{ opacity: controlsVisible ? 1 : 0 }}
      >
        <div className="pointer-events-auto flex h-14 items-center gap-4 bg-linear-to-b from-black/80 via-black/40 to-transparent px-4 pt-[env(safe-area-inset-top,0px)]">
          <button
            type="button"
            onClick={onMinimize}
            className="cursor-pointer shrink-0 rounded-full p-2 text-white transition-colors hover:bg-white/10"
            aria-label="Minimize player"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <h2 className="min-w-0 flex-1 truncate text-base font-semibold leading-tight text-white">
            {video.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer shrink-0 rounded-full p-2 text-white transition-colors hover:bg-white/10"
            aria-label="Close player"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 6l8 8M14 6l-8 8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom controls: seek bar + buttons */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 transition-opacity duration-300"
        style={{ opacity: controlsVisible ? 1 : 0 }}
      >
        <div className="pointer-events-auto bg-linear-to-t from-black/80 via-black/50 to-transparent px-4 pb-[env(safe-area-inset-bottom,16px)] pt-10">
          <PlayerControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onTogglePlay={onTogglePlay}
            onSkip={onSkip}
            onSeek={onSeek}
          />
        </div>
      </div>
    </>
  );
}
