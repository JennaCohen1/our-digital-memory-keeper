import { useAlbums, useStories } from "@/hooks/useMemories";
import AlbumCard from "@/components/AlbumCard";
import StoryCard from "@/components/StoryCard";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { Plus, BookOpen, ImagePlus, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

const Memories = () => {
  const { albums, deleteAlbum } = useAlbums();
  const { stories, deleteStory } = useStories();

  const isEmpty = albums.length === 0 && stories.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Our Memories
          </h1>
          <div className="flex gap-2">
            <Link to="/add/album">
              <Button variant="outline" size="sm">
                <ImagePlus className="w-4 h-4 mr-2" />
                Album
              </Button>
            </Link>
            <Link to="/add/story">
              <Button variant="outline" size="sm">
                <PenLine className="w-4 h-4 mr-2" />
                Story
              </Button>
            </Link>
          </div>
        </div>

        {isEmpty ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-display text-xl text-foreground mb-2">
              No memories yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Start by uploading a photo album or writing a story.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/add/album">
                <Button>
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Create Album
                </Button>
              </Link>
              <Link to="/add/story">
                <Button variant="outline">
                  <PenLine className="w-4 h-4 mr-2" />
                  Write Story
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Albums */}
            {albums.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                  <ImagePlus className="w-5 h-5 text-muted-foreground" />
                  Photo Albums
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {albums.map((album) => (
                    <AlbumCard key={album.id} album={album} onDelete={deleteAlbum} />
                  ))}
                </div>
              </section>
            )}

            {/* Stories */}
            {stories.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                  <PenLine className="w-5 h-5 text-muted-foreground" />
                  Stories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {stories.map((story) => (
                    <StoryCard key={story.id} story={story} onDelete={deleteStory} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Memories;
