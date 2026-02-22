"use client";

interface SeekBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export function SeekBar({ currentTime, duration, onSeek }: SeekBarProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="group relative w-full">
      <input
        type="range"
        min={0}
        max={duration > 0 ? duration : 1}
        step={0.1}
        value={currentTime ?? 0}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="seek-bar w-full cursor-pointer appearance-none bg-transparent"
        aria-label="Seek video"
      />
      <div className="pointer-events-none absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-zinc-700 w-full">
        <div
          className="h-full rounded-full bg-white transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
