"use client";

import { useRef, useCallback, useState, type CSSProperties } from "react";
import { usePlayerStore } from "@/modules/player/state/playerStore";

const MINIMIZE_THRESHOLD = 150;
const MAX_DRAG = 400;

export function usePlayerGestures() {
  const minimize = usePlayerStore((s) => s.minimize);

  const dragging = useRef(false);
  const startY = useRef(0);
  const [offsetY, setOffsetY] = useState(0);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    startY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const delta = Math.max(0, Math.min(e.clientY - startY.current, MAX_DRAG));
    setOffsetY(delta);
  }, []);

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;

    if (offsetY > MINIMIZE_THRESHOLD) {
      minimize();
    }
    setOffsetY(0);
  }, [offsetY, minimize]);

  const progress = offsetY / MAX_DRAG;
  const scale = 1 - progress * 0.3;
  const opacity = 1 - progress * 0.4;
  const borderRadius = progress * 16;

  const style: CSSProperties = {
    transform: `translateY(${offsetY}px) scale(${scale})`,
    opacity,
    borderRadius,
    transition: dragging.current ? "none" : "transform 0.3s ease, opacity 0.3s ease, border-radius 0.3s ease",
    touchAction: "none",
  };

  return {
    gestureHandlers: { onPointerDown, onPointerMove, onPointerUp },
    dragStyle: style,
    isDragging: offsetY > 0,
  };
}
