import { useState } from "react";
import { useSpace } from "@/contexts/SpaceContext";
import { useAlbums, useStories } from "@/hooks/useMemoriesSupabase";
import AlbumCard from "@/components/AlbumCard";
import StoryCard from "@/components/StoryCard";
import Header from "@/components/Header";
import { BookOpen } from "lucide-react";

const Memories = () => {
  const { currentSpaceId } = useSpace();
  const { albums, deleteAlbum } = useAlbums(currentSpaceId);
  const { stories, deleteStory } = useStories(currentSpaceId);

  const [filter, setFilter] = useState<"all" | "albums" | "stories">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const isEmpty = albums.length === 0 && stories.length === 0;

  let galleryItems = [
    ...albums.map((album) => ({ type: "album" as const, item: album })),
    ...stories.map((story) => ({ type: "story" as const, item: story })),
  ];

  if (filter === "albums") {
    galleryItems = galleryItems.filter((entry) => entry.type === "album");
  } else if (filter === "stories") {
    galleryItems = galleryItems.filter((entry) => entry.type === "story");
  }

  galleryItems = galleryItems.sort((a, b) => {
    const aDate = new Date(a.item.createdAt).getTime();
    const bDate = new Date(b.item.createdAt).getTime();
    return sortOrder === "newest" ? bDate - aDate : aDate - bDate;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Our Memories
          </h1>
          {!isEmpty && (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex gap-1 rounded-full border border-border bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 rounded-full ${
                    filter === "all" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("albums")}
                  className={`px-3 py-1 rounded-full ${
                    filter === "albums" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
                  }`}
                >
                  Albums
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("stories")}
                  className={`px-3 py-1 rounded-full ${
                    filter === "stories" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
                  }`}
                >
                  Stories
                </button>
              </div>
              <div className="flex gap-1 rounded-full border border-border bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setSortOrder("newest")}
                  className={`px-3 py-1 rounded-full ${
                    sortOrder === "newest" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
                  }`}
                >
                  Newest
                </button>
                <button
                  type="button"
                  onClick={() => setSortOrder("oldest")}
                  className={`px-3 py-1 rounded-full ${
                    sortOrder === "oldest" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
                  }`}
                >
                  Oldest
                </button>
              </div>
            </div>
          )}
        </div>

        {isEmpty ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-display text-xl text-foreground mb-2">
              No memories yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Start by uploading a photo album or writing a story from the home screen.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
              All memories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((entry) =>
                entry.type === "album" ? (
                  <AlbumCard key={`album-${entry.item.id}`} album={entry.item} onDelete={(id) => deleteAlbum(id)} />
                ) : (
                  <StoryCard key={`story-${entry.item.id}`} story={entry.item} onDelete={(id) => deleteStory(id)} />
                )
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Memories;
