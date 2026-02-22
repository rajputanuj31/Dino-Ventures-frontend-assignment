"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePlayerStore } from "@/modules/player/state/playerStore";
import { getVideosByCategorySlug } from "@/lib/videos";
import type { Video } from "@/types/video";

const COUNTDOWN_SECONDS = 2;

interface AutoplayState {
  nextVideo: Video | null;
  countdown: number;
  active: boolean;
}

export function useAutoplayNext() {
  const currentVideo = usePlayerStore((s) => s.currentVideo);
  const currentCategory = usePlayerStore((s) => s.currentCategory);
  const videoEnded = usePlayerStore((s) => s.videoEnded);
  const openVideo = usePlayerStore((s) => s.openVideo);
  const setVideoEnded = usePlayerStore((s) => s.setVideoEnded);

  const [state, setState] = useState<AutoplayState>({
    nextVideo: null,
    countdown: COUNTDOWN_SECONDS,
    active: false,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef = useRef(false);

  const getNextVideo = useCallback((): Video | null => {
    if (!currentCategory || !currentVideo) return null;
    const videos = getVideosByCategorySlug(currentCategory.slug);
    const idx = videos.findIndex((v) => v.slug === currentVideo.slug);
    if (idx === -1 || idx >= videos.length - 1) return null;
    return videos[idx + 1];
  }, [currentCategory, currentVideo]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    clearTimer();
    cancelledRef.current = true;
    setVideoEnded(false);
    setState({ nextVideo: null, countdown: COUNTDOWN_SECONDS, active: false });
  }, [clearTimer, setVideoEnded]);

  // Reset when the current video changes
  useEffect(() => {
    cancelledRef.current = false;
    clearTimer();
    setState({ nextVideo: null, countdown: COUNTDOWN_SECONDS, active: false });
  }, [currentVideo, clearTimer]);

  // Start countdown when video ends
  useEffect(() => {
    if (!videoEnded || cancelledRef.current || state.active) return;

    const next = getNextVideo();
    if (!next) return;

    setState({ nextVideo: next, countdown: COUNTDOWN_SECONDS, active: true });

    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.countdown <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          return { ...prev, countdown: 0, active: false };
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);
  }, [videoEnded, state.active, getNextVideo]);

  // Navigate to next video when countdown finishes
  useEffect(() => {
    if (state.active || state.countdown !== 0 || !state.nextVideo || !currentCategory) return;

    const next = state.nextVideo;
    setVideoEnded(false);
    openVideo(next, currentCategory);
    setState({ nextVideo: null, countdown: COUNTDOWN_SECONDS, active: false });
  }, [state, currentCategory, openVideo, setVideoEnded]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    nextVideo: state.nextVideo,
    countdown: state.countdown,
    isCountingDown: state.active,
    cancel,
  };
}
