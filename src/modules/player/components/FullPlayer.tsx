"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePlayerStore } from "@/modules/player/state/playerStore";
import { PlayerControls } from "./PlayerControls";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

function getYouTubeVideoId(url: string): string | null {
  const match = url.match(/embed\/([^?/]+)/);
  return match ? match[1] : null;
}

function loadYouTubeAPI(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();

  return new Promise((resolve) => {
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const check = setInterval(() => {
        if (window.YT?.Player) {
          clearInterval(check);
          resolve();
        }
      }, 50);
      return;
    }

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
}

export function FullPlayer() {
  const currentVideo = usePlayerStore((s) => s.currentVideo);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const setPlaying = usePlayerStore((s) => s.setPlaying);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const close = usePlayerStore((s) => s.close);

  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentVideoSlug = useRef<string | null>(null);

  const clearProgressInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startProgressInterval = useCallback(() => {
    clearProgressInterval();
    intervalRef.current = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      try {
        setProgress(p.getCurrentTime(), p.getDuration());
      } catch {
        /* player not ready */
      }
    }, 250);
  }, [clearProgressInterval, setProgress]);

  useEffect(() => {
    if (!currentVideo) return;

    const videoId = getYouTubeVideoId(currentVideo.mediaUrl);
    if (!videoId) return;

    if (currentVideoSlug.current === currentVideo.slug && playerRef.current) {
      return;
    }
    currentVideoSlug.current = currentVideo.slug;

    let cancelled = false;

    loadYouTubeAPI().then(() => {
      if (cancelled) return;

      if (playerRef.current) {
        playerRef.current.loadVideoById(videoId);
        return;
      }

      if (!containerRef.current) return;

      const el = document.createElement("div");
      el.id = "yt-player-target";
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(el);

      playerRef.current = new window.YT.Player(el.id, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (e: YT.PlayerEvent) => {
            setProgress(0, e.target.getDuration());
            startProgressInterval();
          },
          onStateChange: (e: YT.OnStateChangeEvent) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              setPlaying(true);
              startProgressInterval();
            } else if (e.data === window.YT.PlayerState.PAUSED) {
              setPlaying(false);
              clearProgressInterval();
            } else if (e.data === window.YT.PlayerState.ENDED) {
              setPlaying(false);
              clearProgressInterval();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
    };
  }, [currentVideo, setPlaying, setProgress, startProgressInterval, clearProgressInterval]);

  useEffect(() => {
    return () => {
      clearProgressInterval();
      playerRef.current?.destroy();
      playerRef.current = null;
      currentVideoSlug.current = null;
    };
  }, [clearProgressInterval]);

  const handleTogglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    const state = p.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      p.pauseVideo();
    } else {
      p.playVideo();
    }
  }, []);

  const handleSkip = useCallback((seconds: number) => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(p.getCurrentTime() + seconds, true);
  }, []);

  const handleSeek = useCallback((time: number) => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(time, true);
  }, []);

  if (!currentVideo) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Close / back button */}
      <div className="absolute right-3 top-3 z-10">
        <button
          type="button"
          onClick={close}
          className="rounded-full bg-black/60 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
          aria-label="Close player"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l8 8M14 6l-8 8" />
          </svg>
        </button>
      </div>

      {/* Video container */}
      <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
        <div ref={containerRef} className="absolute inset-0 [&>iframe]:h-full [&>iframe]:w-full" />
      </div>

      {/* Info + controls */}
      <div className="flex flex-1 flex-col px-4 pt-4">
        <h2 className="text-base font-semibold leading-snug text-white">
          {currentVideo.title}
        </h2>

        <div className="mt-4">
          <PlayerControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onTogglePlay={handleTogglePlay}
            onSkip={handleSkip}
            onSeek={handleSeek}
          />
        </div>
      </div>
    </div>
  );
}
