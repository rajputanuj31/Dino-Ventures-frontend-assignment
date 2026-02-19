import type { CategoryWithVideos } from "@/types/video";

interface CategorySectionProps {
  entry: CategoryWithVideos;
}

export function CategorySection({ entry }: CategorySectionProps) {
  const { category, contents } = entry;

  return (
    <section aria-label={category.name} className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-zinc-800" aria-hidden />
        <h2 className="text-sm font-semibold tracking-tight">
          {category.name}
        </h2>
      </div>
      <ul className="space-y-1 text-xs text-zinc-400">
        {contents.map((video) => (
          <li key={video.slug} className="truncate">
            {video.title}
          </li>
        ))}
      </ul>
    </section>
  );
}

