import Image from "next/image";
import type { CategoryWithVideos } from "@/types/video";
import { VideoCard } from "./VideoCard";

interface CategorySectionProps {
  entry: CategoryWithVideos;
}

export function CategorySection({ entry }: CategorySectionProps) {
  const { category, contents } = entry;

  return (
    <section aria-label={category.name} className="space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-zinc-800">
          <Image
            src={category.iconUrl}
            alt=""
            fill
            sizes="28px"
            className="object-cover"
          />
        </div>
        <h2 className="text-base font-semibold tracking-tight">
          {category.name}
        </h2>
        <span className="ml-auto text-xs text-zinc-500">
          {contents.length} videos
        </span>
      </div>

      <div className="space-y-1">
        {contents.map((video) => (
          <VideoCard key={video.slug} video={video} category={category} />
        ))}
      </div>
    </section>
  );
}
