import { Album } from "@/lib/types";
import { Calendar, Trash2, Image } from "lucide-react";

interface AlbumCardProps {
  album: Album;
  onDelete?: (id: string) => void;
}

const AlbumCard = ({ album, onDelete }: AlbumCardProps) => {
  const coverPhoto = album.photos[0];
  const extraCount = album.photos.length - 1;

  return (
    <article className="group bg-card rounded-xl border border-border shadow-warm overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
      {coverPhoto && (
        <div className="aspect-[4/3] overflow-hidden relative">
          <img
            src={coverPhoto.imageData}
            alt={album.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {extraCount > 0 && (
            <div className="absolute bottom-3 right-3 bg-foreground/70 text-background text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
              <Image className="w-3 h-3" />
              +{extraCount}
            </div>
          )}
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug">
            {album.title}
          </h3>
          {onDelete && (
            <button
              onClick={() => onDelete(album.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              aria-label="Delete album"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        {album.date && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(album.date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</span>
          </div>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {album.photos.length} photo{album.photos.length !== 1 ? "s" : ""}
        </p>
      </div>
    </article>
  );
};

export default AlbumCard;
