import { Memory } from "@/lib/types";
import { Calendar, Trash2 } from "lucide-react";

interface MemoryCardProps {
  memory: Memory;
  onDelete?: (id: string) => void;
}

const MemoryCard = ({ memory, onDelete }: MemoryCardProps) => {
  return (
    <article className="group bg-card rounded-xl border border-border shadow-warm overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
      {memory.imageData && (
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={memory.imageData}
            alt={memory.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug">
            {memory.title}
          </h3>
          {onDelete && (
            <button
              onClick={() => onDelete(memory.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              aria-label="Delete memory"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        {memory.date && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(memory.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        )}
        <p className="mt-3 text-sm text-secondary-foreground leading-relaxed line-clamp-4">
          {memory.content}
        </p>
        <span className="inline-block mt-3 text-xs font-medium px-2.5 py-1 rounded-full bg-accent text-accent-foreground capitalize">
          {memory.type}
        </span>
      </div>
    </article>
  );
};

export default MemoryCard;
