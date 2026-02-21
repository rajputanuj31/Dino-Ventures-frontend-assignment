"use client";

import { usePlayerStore } from "@/modules/player/state/playerStore";
import { FullPlayer } from "./FullPlayer";

export function PlayerOverlay() {
  const mode = usePlayerStore((s) => s.mode);
  const currentVideo = usePlayerStore((s) => s.currentVideo);

  if (mode === "hidden") return null;

  return (
    <>
      {mode === "full" && <FullPlayer />}

      {mode === "mini" && currentVideo && (
        <div className="pointer-events-auto fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 text-white px-4 py-2">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-3 text-xs">
            <div className="min-w-0">
              <p className="truncate font-medium">{currentVideo.title}</p>
              <p className="truncate text-[10px] text-zinc-400">
                Mini-player
              </p>
            </div>
            <div className="text-[10px] text-zinc-500">Playing</div>
          </div>
        </div>
      )}
    </>
  );
}
