"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { usePlayerStore } from "@/modules/player/state/playerStore";
import { usePlayerGestures } from "@/modules/player/hooks/usePlayerGestures";
import { useAutoplayNext } from "@/modules/player/hooks/useAutoplayNext";
import { RelatedVideoList } from "./RelatedVideoList";
import { FullPlayerUI } from "./FullPlayerUI";
import { MiniPlayerBar } from "./MiniPlayerBar";

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

export function PlayerOverlay() {
  const mode = usePlayerStore((s) => s.mode);
  const currentVideo = usePlayerStore((s) => s.currentVideo);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const setPlaying = usePlayerStore((s) => s.setPlaying);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const setVideoEnded = usePlayerStore((s) => s.setVideoEnded);
  const close = usePlayerStore((s) => s.close);
  const minimize = usePlayerStore((s) => s.minimize);
  const restore = usePlayerStore((s) => s.restore);

  const { gestureHandlers, dragStyle } = usePlayerGestures();
  const {
    nextVideo,
    countdown,
    isCountingDown,
    cancel: cancelAutoplay,
  } = useAutoplayNext();

  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentVideoSlug = useRef<string | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [controlsVisible, setControlsVisible] = useState(true);

  const isFull = mode === "full";
  const isMini = mode === "mini";

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(
      () => setControlsVisible(false),
      CONTROLS_HIDE_DELAY,
    );
  }, []);

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

  const destroyPlayer = useCallback(() => {
    clearProgressInterval();
    try {
      playerRef.current?.destroy();
    } catch {
      /* already destroyed */
    }
    playerRef.current = null;
    currentVideoSlug.current = null;
  }, [clearProgressInterval]);

  useEffect(() => {
    if (!currentVideo || mode === "hidden") {
      destroyPlayer();
      return;
    }

    const videoId = getYouTubeVideoId(currentVideo.mediaUrl);
    if (!videoId) return;

    if (
      currentVideoSlug.current === currentVideo.slug &&
      playerRef.current
    ) {
      return;
    }

    if (
      currentVideoSlug.current !== null &&
      currentVideoSlug.current !== currentVideo.slug &&
      playerRef.current
    ) {
      playerRef.current.loadVideoById(videoId);
      currentVideoSlug.current = currentVideo.slug;
      scrollRef.current?.scrollTo({ top: 0 });
      showControls();
      return;
    }

    destroyPlayer();
    currentVideoSlug.current = currentVideo.slug;

    scrollRef.current?.scrollTo({ top: 0 });
    showControls();

    let cancelled = false;

    loadYouTubeAPI().then(() => {
      if (cancelled) return;
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
              setVideoEnded(true);
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
  }, [
    currentVideo,
    mode,
    setPlaying,
    setProgress,
    setVideoEnded,
    startProgressInterval,
    clearProgressInterval,
    destroyPlayer,
    showControls,
  ]);

  useEffect(() => {
    return () => destroyPlayer();
  }, [destroyPlayer]);

  useEffect(() => {
    const p = playerRef.current;
    if (!p || mode === "hidden") return;
    try {
      const iframe = p.getIframe?.();
      if (iframe) {
        iframe.style.width = "100%";
        iframe.style.height = "100%";
      }
    } catch {
      /* player not ready */
    }
  }, [mode]);

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

  const handleSkip = useCallback(
    (seconds: number) => {
      const p = playerRef.current;
      if (!p) return;
      const cur = p.getCurrentTime();
      const dur = p.getDuration();
      p.seekTo(Math.max(0, Math.min(cur + seconds, dur)), true);
      showControls();
    },
    [showControls],
  );

  const handleSeek = useCallback(
    (time: number) => {
      playerRef.current?.seekTo(time, true);
      showControls();
    },
    [showControls],
  );

  if (mode === "hidden" || !currentVideo) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={
        isFull
          ? "animate-fade-in fixed inset-0 z-50 bg-black"
          : "animate-scale-in-br fixed bottom-4 right-4 z-50 w-80 overflow-hidden rounded-2xl bg-zinc-950 shadow-2xl shadow-black/60 ring-1 ring-white/10"
      }
      style={isFull ? dragStyle : undefined}
      onMouseMove={isFull ? () => showControls() : undefined}
      onTouchStart={isFull ? () => showControls() : undefined}
    >
      {/* Scrollable wrapper (only scrolls in full mode) */}
      <div
        ref={scrollRef}
        className={isFull ? "h-full overflow-y-auto overscroll-contain" : ""}
      >
        {/* Video section */}
        <div
          className={
            isFull
              ? "relative flex min-h-dvh w-full flex-col bg-black"
              : "relative aspect-video w-full bg-black"
          }
        >
          {/* Persistent YouTube player — always at the same tree position */}
          <div
            className={
              isFull ? "yt-wrapper flex-1" : "absolute inset-0"
            }
            style={isFull ? { aspectRatio: "16/9" } : { overflow: "hidden" }}
          >
            <div
              className="yt-crop"
              style={isMini ? { position: "absolute", inset: 0 } : undefined}
            >
              <div ref={containerRef} />
            </div>
          </div>

          {/* ── Full-mode overlays ── */}
          {isFull && (
            <FullPlayerUI
              video={currentVideo}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              controlsVisible={controlsVisible}
              gestureHandlers={gestureHandlers}
              nextVideo={nextVideo}
              countdown={countdown}
              isCountingDown={isCountingDown}
              onTogglePlay={handleTogglePlay}
              onSkip={handleSkip}
              onSeek={handleSeek}
              onMinimize={minimize}
              onClose={close}
              onCancelAutoplay={cancelAutoplay}
            />
          )}

          {/* ── Mini-mode: click video to expand ── */}
          {isMini && (
            <button
              type="button"
              className="absolute inset-0 z-10"
              onClick={restore}
              aria-label="Expand player"
            />
          )}
        </div>

        {/* Full mode: related videos below */}
        {isFull && (
          <div className="px-4 pt-4 pb-8">
            <RelatedVideoList />
          </div>
        )}
      </div>

      {/* ── Mini-mode: controls bar + progress ── */}
      {isMini && (
        <MiniPlayerBar
          video={currentVideo}
          isPlaying={isPlaying}
          progress={progress}
          onRestore={restore}
          onTogglePlay={handleTogglePlay}
          onClose={close}
        />
      )}
    </div>
  );
}
