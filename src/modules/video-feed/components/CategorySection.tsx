import Image from "next/image";
import type { CategoryWithVideos } from "@/types/video";
import { VideoCard } from "./VideoCard";

interface CategorySectionProps {
  entry: CategoryWithVideos;
}

export function CategorySection({ entry }: CategorySectionProps) {
  const { category, contents } = entry;

  return (
    <section aria-label={category.name}>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-800 ring-1 ring-zinc-700/50">
          <Image
            src={category.iconUrl}
            alt=""
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight sm:text-lg">
            {category.name}
          </h2>
          <p className="text-xs text-zinc-500">
            {contents.length} videos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {contents.map((video) => (
          <VideoCard key={video.slug} video={video} category={category} />
        ))}
      </div>
    </section>
  );
}
