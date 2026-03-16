import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSpace } from "@/contexts/SpaceContext";
import { useSpaces } from "@/hooks/useSpaces";

const MemoryBooks = () => {
  const navigate = useNavigate();
  const { setCurrentSpaceId } = useSpace();
  const { spaces, isLoading, createSpace } = useSpaces();
  const { toast } = useToast();
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || creating) return;
    setCreating(true);
    try {
      const space = await createSpace.mutateAsync(newName.trim());
      setCurrentSpaceId(space.id);
      navigate("/");
    } catch (err) {
      toast({
        title: "Could not create book",
        description: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
      setNewName("");
    }
  };

  const handleSelect = (spaceId: string) => {
    setCurrentSpaceId(spaceId);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight mb-2">
            Memory Books
          </h1>
          <p className="text-muted-foreground">
            Choose a book to open or create a new one.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <form onSubmit={handleCreate} className="flex gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New book name..."
              className="flex-1"
            />
            <Button type="submit" disabled={!newName.trim() || creating}>
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </form>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading your books...</p>
        ) : spaces.length === 0 ? (
          <p className="text-center text-muted-foreground">
            You don’t have any memory books yet. Create one above.
          </p>
        ) : (
          <ul className="space-y-2">
            {spaces.map((space) => (
              <li key={space.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(space.id)}
                  className="w-full text-left rounded-xl border border-border bg-card p-4 shadow-warm hover:shadow-lg hover:border-primary/40 transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <span className="font-display font-semibold text-foreground">
                      {space.name}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MemoryBooks;
