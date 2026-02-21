"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { usePlayerStore } from "@/modules/player/state/playerStore";
import { usePlayerGestures } from "@/modules/player/hooks/usePlayerGestures";
import { useAutoplayNext } from "@/modules/player/hooks/useAutoplayNext";
import { PlayerControls } from "./PlayerControls";
import { RelatedVideoList } from "./RelatedVideoList";
import { AutoplayCountdown } from "./AutoplayCountdown";

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

const CONTROLS_HIDE_DELAY = 3000;

export function FullPlayer() {
  const currentVideo = usePlayerStore((s) => s.currentVideo);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const setPlaying = usePlayerStore((s) => s.setPlaying);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const close = usePlayerStore((s) => s.close);
  const minimize = usePlayerStore((s) => s.minimize);

  const { gestureHandlers, dragStyle } = usePlayerGestures();
  const { nextVideo, countdown, isCountingDown, cancel: cancelAutoplay } = useAutoplayNext();

  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentVideoSlug = useRef<string | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [controlsVisible, setControlsVisible] = useState(true);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, CONTROLS_HIDE_DELAY);
  }, []);

  const handleInteraction = useCallback(() => {
    showControls();
  }, [showControls]);

  useEffect(() => {
    showControls();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [showControls]);

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

    scrollRef.current?.scrollTo({ top: 0 });
    showControls();

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
        width: "100%",
        height: "100%",
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          showinfo: 0,
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
              showControls();
            } else if (e.data === window.YT.PlayerState.ENDED) {
              setPlaying(false);
              clearProgressInterval();
              showControls();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
    };
  }, [currentVideo, setPlaying, setProgress, startProgressInterval, clearProgressInterval, showControls]);

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
    showControls();
  }, [showControls]);

  const handleSkip = useCallback((seconds: number) => {
    const p = playerRef.current;
    if (!p) return;
    const cur = p.getCurrentTime();
    const dur = p.getDuration();
    p.seekTo(Math.max(0, Math.min(cur + seconds, dur)), true);
    showControls();
  }, [showControls]);

  const handleSeek = useCallback((time: number) => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(time, true);
    showControls();
  }, [showControls]);

  if (!currentVideo) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 bg-black"
      style={dragStyle}
      onMouseMove={handleInteraction}
      onTouchStart={handleInteraction}
    >
      <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain">
        {/* Video section -- fills viewport, controls inside so they scroll with it */}
        <div className="relative flex min-h-dvh w-full flex-col bg-black">
          {/* Video player with yt-crop */}
          <div className="yt-wrapper flex-1" style={{ aspectRatio: "16/9" }}>
            <div className="yt-crop">
              <div ref={containerRef} />
            </div>
          </div>

          {/* Tap overlay for play/pause + drag gesture */}
          <div
            className="absolute inset-0 z-10"
            style={{ touchAction: "none" }}
            onClick={handleTogglePlay}
            {...gestureHandlers}
          />

          {isCountingDown && nextVideo && (
            <AutoplayCountdown
              nextVideo={nextVideo}
              countdown={countdown}
              onCancel={cancelAutoplay}
            />
          )}

          {/* Top bar overlay: minimize + close */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-30 transition-opacity duration-300"
            style={{ opacity: controlsVisible ? 1 : 0 }}
          >
            <div className="pointer-events-auto flex h-14 items-center gap-4 bg-linear-to-b from-black/80 via-black/40 to-transparent px-4 pt-[env(safe-area-inset-top,0px)]">
              <button
                type="button"
                onClick={minimize}
                className="shrink-0 rounded-full p-2 text-white transition-colors hover:bg-white/10"
                aria-label="Minimize player"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <h2 className="min-w-0 flex-1 truncate text-base font-semibold leading-tight text-white">
                {currentVideo.title}
              </h2>
              <button
                type="button"
                onClick={close}
                className="shrink-0 rounded-full p-2 text-white transition-colors hover:bg-white/10"
                aria-label="Close player"
              >
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l8 8M14 6l-8 8" />
                </svg>
              </button>
            </div>
          </div>

          {/* Bottom controls overlay: seek bar + buttons */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-30 transition-opacity duration-300"
            style={{ opacity: controlsVisible ? 1 : 0 }}
          >
            <div className="pointer-events-auto bg-linear-to-t from-black/80 via-black/50 to-transparent px-4 pb-[env(safe-area-inset-bottom,16px)] pt-10">
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

        {/* Content below video: related videos */}
        <div className="px-4 pt-4 pb-8">
          <RelatedVideoList />
        </div>
      </div>
    </div>
  );
}
