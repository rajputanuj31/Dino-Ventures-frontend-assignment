"use client";

import { create } from "zustand";
import type { Category, Video } from "@/types/video";

export type PlayerMode = "hidden" | "full" | "mini";

interface PlayerState {
  mode: PlayerMode;
  currentVideo: Video | null;
  currentCategory: Category | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  videoEnded: boolean;

  openVideo: (video: Video, category: Category) => void;
  minimize: () => void;
  restore: () => void;
  close: () => void;
  setPlaying: (isPlaying: boolean) => void;
  setProgress: (currentTime: number, duration: number) => void;
  setVideoEnded: (ended: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  mode: "hidden",
  currentVideo: null,
  currentCategory: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  videoEnded: false,

  openVideo: (video, category) =>
    set({
      mode: "full",
      currentVideo: video,
      currentCategory: category,
      isPlaying: true,
      currentTime: 0,
      videoEnded: false,
    }),

  minimize: () => set({ mode: "mini" }),

  restore: () => set({ mode: "full" }),

  close: () =>
    set({
      mode: "hidden",
      currentVideo: null,
      currentCategory: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      videoEnded: false,
    }),

  setPlaying: (isPlaying) => set({ isPlaying }),

  setProgress: (currentTime, duration) => set({ currentTime, duration }),

  setVideoEnded: (ended) => set({ videoEnded: ended }),
}));

