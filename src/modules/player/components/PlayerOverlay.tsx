"use client";

import { usePlayerStore } from "@/modules/player/state/playerStore";
import { FullPlayer } from "./FullPlayer";
import { MiniPlayer } from "./MiniPlayer";

export function PlayerOverlay() {
  const mode = usePlayerStore((s) => s.mode);

  if (mode === "hidden") return null;

  return (
    <>
      {mode === "full" && <FullPlayer />}
      {mode === "mini" && <MiniPlayer />}
    </>
  );
}
