"use client";

import { usePlayerStore } from "@/modules/player/state/playerStore";

export function PlayerOverlay() {
  const mode = usePlayerStore((s) => s.mode);
  const currentVideo = usePlayerStore((s) => s.currentVideo);

  if (mode === "hidden") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-end">
      {mode === "full" && (
        <div className="pointer-events-auto flex-1 bg-black/95 text-white flex items-center justify-center">
          <div className="px-4 text-center text-sm text-zinc-300">
            <div className="text-base font-semibold">
              Video player (full screen)
            </div>
            {currentVideo && (
              <p className="mt-1 max-w-md truncate text-xs text-zinc-400">
                {currentVideo.title}
              </p>
            )}
          </div>
        </div>
      )}

      {mode === "mini" && currentVideo && (
        <div className="pointer-events-auto bg-zinc-950/95 text-white px-4 py-2">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-3 text-xs">
            <div className="min-w-0">
              <p className="truncate font-medium">{currentVideo.title}</p>
              <p className="truncate text-[10px] text-zinc-400">
                Mini-player (swipe up to expand in future step)
              </p>
            </div>
            <div className="text-[10px] text-zinc-500">
              Dino Ventures · Playing
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

