import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMemories } from "@/hooks/useMemories";
import { ImagePlus, BookOpen, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";

const AddMemory = () => {
  const navigate = useNavigate();
  const { addMemory } = useMemories();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<"photo" | "story">("photo");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [imageData, setImageData] = useState<string | undefined>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageData(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addMemory({ type, title, content, date, imageData });
    navigate("/memories");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          Add a Memory
        </h1>

        {/* Type selector */}
        <div className="flex gap-3 mb-8">
          {[
            { value: "photo" as const, label: "Photo Memory", icon: ImagePlus },
            { value: "story" as const, label: "Written Story", icon: BookOpen },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value)}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all font-medium ${
                type === value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer at Grandma's house"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              When did this happen?
            </label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          {type === "photo" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Photo</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {imageData ? (
                <div className="relative">
                  <img
                    src={imageData}
                    alt="Preview"
                    className="w-full rounded-xl border border-border max-h-80 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm text-foreground text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-card transition-colors"
                  >
                    Change photo
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/40 transition-colors flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary"
                >
                  <Upload className="w-8 h-8" />
                  <span className="text-sm font-medium">Click to upload a photo</span>
                  <span className="text-xs">or scan an old photograph</span>
                </button>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {type === "photo" ? "Caption / Story" : "Your Story"}
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                type === "photo"
                  ? "Tell us about this photo..."
                  : "Write your memory here. Take your time — every detail matters..."
              }
              rows={type === "story" ? 12 : 4}
              className="resize-y"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Save Memory
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

export default AddMemory;
