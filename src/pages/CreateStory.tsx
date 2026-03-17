import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpace } from "@/contexts/SpaceContext";
import { useStories } from "@/hooks/useMemoriesSupabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import MemoryDatePicker from "@/components/MemoryDatePicker";

const CreateStory = () => {
  const navigate = useNavigate();
  const { currentSpaceId } = useSpace();
  const { addStory } = useStories(currentSpaceId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !year) return;
    const eventDate = month && month !== "none" ? `${year}-${month}-01` : `${year}-01-01`;
    await addStory({ title, content, date: eventDate });
    navigate("/memories");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Write a Story
        </h1>
        <p className="text-muted-foreground mb-8">
          Capture a memory in your own words — no photos needed.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The day we moved house"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">When</label>
              <MemoryDatePicker
                month={month}
                year={year}
                onMonthChange={setMonth}
                onYearChange={setYear}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Your Story</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Take your time — every detail matters..."
              rows={14}
              className="resize-y leading-relaxed"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={!title.trim() || !content.trim() || !year}>
              Save Story
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateStory;
