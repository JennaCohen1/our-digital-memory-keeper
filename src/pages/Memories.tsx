import { useMemories } from "@/hooks/useMemories";
import MemoryCard from "@/components/MemoryCard";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const Memories = () => {
  const { memories, deleteMemory } = useMemories();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Our Memories
          </h1>
          <Link to="/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Memory
            </Button>
          </Link>
        </div>

        {memories.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="font-display text-xl text-foreground mb-2">
              No memories yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start adding photos and stories to build your family memory book.
            </p>
            <Link to="/add">
              <Button>Add Your First Memory</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} onDelete={deleteMemory} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Memories;
