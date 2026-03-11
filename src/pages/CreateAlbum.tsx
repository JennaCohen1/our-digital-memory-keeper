import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAlbums } from "@/hooks/useMemories";
import { Upload, X, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import MemoryDatePicker from "@/components/MemoryDatePicker";
import { Photo } from "@/lib/types";

const CreateAlbum = () => {
  const navigate = useNavigate();
  const { addAlbum } = useAlbums();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newPhoto: Photo = {
          id: crypto.randomUUID(),
          imageData: ev.target?.result as string,
          caption: "",
        };
        setPhotos((prev) => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const updateCaption = (id: string, caption: string) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const date = year ? (month && month !== "none" ? `${year}-${month}` : year) : undefined;
    addAlbum({ title, date, photos });
    navigate("/memories");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Create Photo Album
        </h1>
        <p className="text-muted-foreground mb-8">
          Upload multiple photos and group them as an album.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Album Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Holiday 1995"
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

          {/* Drop zone */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Photos ({photos.length} uploaded)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 p-8 ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <Upload className="w-8 h-8" />
              <span className="text-sm font-medium">
                Drop photos here or click to browse
              </span>
              <span className="text-xs text-muted-foreground">
                Select multiple files at once
              </span>
            </div>
          </div>

          {/* Photo grid */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative">
                  <div className="aspect-square rounded-lg overflow-hidden border border-border">
                    <img
                      src={photo.imageData}
                      alt={photo.caption || "Photo"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <Input
                    value={photo.caption || ""}
                    onChange={(e) => updateCaption(photo.id, e.target.value)}
                    placeholder="Add caption..."
                    className="mt-2 text-xs h-8"
                  />
                </div>
              ))}

              {/* Add more button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/40 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ImagePlus className="w-6 h-6" />
                <span className="text-xs">Add more</span>
              </button>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={!title.trim() || photos.length === 0}>
              Save Album
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

export default CreateAlbum;
