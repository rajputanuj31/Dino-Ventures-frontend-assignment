"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePlayerStore } from "@/modules/player/state/playerStore";
import { getVideosByCategorySlug } from "@/lib/videos";
import type { Video } from "@/types/video";

const COUNTDOWN_SECONDS = 2;
const END_THRESHOLD = 0.5;

interface AutoplayState {
  nextVideo: Video | null;
  countdown: number;
  active: boolean;
}

export function useAutoplayNext() {
  const currentVideo = usePlayerStore((s) => s.currentVideo);
  const currentCategory = usePlayerStore((s) => s.currentCategory);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const openVideo = usePlayerStore((s) => s.openVideo);

  const [state, setState] = useState<AutoplayState>({
    nextVideo: null,
    countdown: COUNTDOWN_SECONDS,
    active: false,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const triggeredRef = useRef(false);

  const getNextVideo = useCallback((): Video | null => {
    if (!currentCategory || !currentVideo) return null;
    const videos = getVideosByCategorySlug(currentCategory.slug);
    const idx = videos.findIndex((v) => v.slug === currentVideo.slug);
    if (idx === -1 || idx >= videos.length - 1) return null;
    return videos[idx + 1];
  }, [currentCategory, currentVideo]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    triggeredRef.current = true;
    setState({ nextVideo: null, countdown: COUNTDOWN_SECONDS, active: false });
  }, []);

  useEffect(() => {
    triggeredRef.current = false;
    cancel();
  }, [currentVideo, cancel]);

  useEffect(() => {
    if (triggeredRef.current) return;
    if (!isPlaying || duration <= 0) return;

    const remaining = duration - currentTime;
    const nearEnd = remaining <= END_THRESHOLD && remaining >= 0;

    if (nearEnd && !state.active) {
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
    }
  }, [currentTime, duration, isPlaying, state.active, getNextVideo]);

  useEffect(() => {
    if (state.active === false && state.countdown === 0 && state.nextVideo && currentCategory) {
      openVideo(state.nextVideo, currentCategory);
      setState({ nextVideo: null, countdown: COUNTDOWN_SECONDS, active: false });
    }
  }, [state, currentCategory, openVideo]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    nextVideo: state.nextVideo,
    countdown: state.countdown,
    isCountingDown: state.active,
    cancel,
  };
}
