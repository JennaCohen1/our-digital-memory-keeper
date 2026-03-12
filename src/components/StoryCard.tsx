import { Story } from "@/lib/types";
import { formatMemoryDate } from "@/lib/dateUtils";
import { Calendar, Trash2 } from "lucide-react";

interface StoryCardProps {
  story: Story;
  onDelete?: (id: string) => void;
  spaceName?: string;
}

const StoryCard = ({ story, onDelete, spaceName }: StoryCardProps) => {
  return (
    <article className="group relative bg-card rounded-xl border border-border shadow-warm p-6 transition-all hover:shadow-lg hover:-translate-y-0.5">
      {spaceName && (
        <div className="mb-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground">
            {spaceName}
          </span>
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-semibold text-foreground leading-snug">
          {story.title}
        </h3>
        {onDelete && (
          <button
            onClick={() => onDelete(story.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            aria-label="Delete story"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      {formatMemoryDate(story.date) && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatMemoryDate(story.date)}</span>
        </div>
      )}
      <p className="mt-3 text-sm text-secondary-foreground leading-relaxed line-clamp-5">
        {story.content}
      </p>
    </article>
  );
};

export default StoryCard;
