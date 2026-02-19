import { getAllCategoryEntries } from "@/lib/videos";
import { VideoFeed } from "@/modules/video-feed/components/VideoFeed";

export default function Home() {
  const categoryEntries = getAllCategoryEntries();

  return (
    <VideoFeed categoryEntries={categoryEntries} />
  );
}
