import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpace } from "@/contexts/SpaceContext";
import { useAlbums, useStories } from "@/hooks/useMemoriesSupabase";
import { Album, Story } from "@/lib/types";

interface BookPage {
  type: "cover" | "quote" | "contents" | "album" | "story" | "end";
  title?: string;
  content?: string;
  photos?: { imageData: string; caption?: string }[];
  date?: string;
}

function buildPages(albums: Album[], stories: Story[]): { pages: BookPage[]; tocData: Record<string, string[]> } {
  const pages: BookPage[] = [
    { type: "cover" },
    { type: "quote" },
  ];

  // Sort by memory date (chronological), fall back to createdAt
  const items: (Album | Story)[] = [...albums, ...stories].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : new Date(a.createdAt).getTime();
    const dateB = b.date ? new Date(b.date).getTime() : new Date(b.createdAt).getTime();
    return dateA - dateB;
  });

  // Build table of contents grouped by year
  const tocData: Record<string, string[]> = {};
  for (const item of items) {
    const dateStr = item.date || "";
    const yearMatch = dateStr.match(/(\d{4})/);
    const year = yearMatch ? yearMatch[1] : "Undated";
    if (!tocData[year]) tocData[year] = [];
    tocData[year].push(item.title);
  }

  // Add contents page after quote
  pages.push({ type: "contents" });

  for (const item of items) {
    if ("photos" in item) {
      pages.push({
        type: "album",
        title: item.title,
        date: item.date,
        photos: item.photos,
      });
    } else {
      pages.push({
        type: "story",
        title: item.title,
        content: item.content,
        date: item.date,
      });
    }
  }

  pages.push({ type: "end" });
  return { pages, tocData };
}

const BookPreview = () => {
  const navigate = useNavigate();
  const { currentSpaceId } = useSpace();
  const { albums } = useAlbums(currentSpaceId);
  const { stories } = useStories(currentSpaceId);
  const { pages, tocData } = buildPages(albums, stories);
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({});
  const [dragState, setDragState] = useState<{ year: string; index: number } | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");

  const jumpToPage = useCallback(
    (pageIndex: number) => {
      if (isFlipping || pageIndex === currentPage) return;
      setFlipDirection(pageIndex > currentPage ? "next" : "prev");
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(pageIndex);
        setIsFlipping(false);
      }, 600);
    },
    [currentPage, isFlipping]
  );

  const goToPage = useCallback(
    (direction: "next" | "prev") => {
      if (isFlipping) return;
      const target = direction === "next" ? currentPage + 1 : currentPage - 1;
      if (target < 0 || target >= pages.length) return;

      setFlipDirection(direction);
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(target);
        setIsFlipping(false);
      }, 600);
    },
    [currentPage, isFlipping, pages.length]
  );

  const renderPage = (page: BookPage, index: number) => {
    switch (page.type) {
      case "cover":
        return (
          <div className="h-full flex flex-col items-center justify-end pb-16">
            <div className="w-[80%]" style={{ fontSize: 'clamp(3rem, 15vw, 6rem)', lineHeight: 1.1 }}>
              {["CHR", "IST", "IAN", "SON"].map((row, ri) => (
                <div key={ri} className="flex justify-between">
                  {row.split("").map((letter, ci) => (
                    <span
                      key={ci}
                      className="font-display font-bold text-foreground uppercase inline-block"
                      style={{ width: "1em", textAlign: "center" }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <p className="absolute bottom-8 left-0 right-0 text-center font-display text-xs italic text-foreground">
              8.7.1978
            </p>
          </div>
        );

      case "quote":
        return (
          <div className="h-full flex flex-col justify-end p-12 pb-20 bg-foreground">
            <p className="font-body text-sm font-bold text-background tracking-normal leading-relaxed text-left whitespace-nowrap">
              "If you can fill the unforgiving minute,<br />
              With sixty seconds' worth of distance run,<br />
              Yours is the earth and everything that's in it..."
            </p>
            <p className="font-body text-xs font-bold text-background tracking-wide mt-5 text-right">
              —Rudyard Kipling
            </p>
          </div>
        );

      case "contents":
        return (
          <div className="h-full flex flex-col p-8 overflow-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Contents
            </h2>
            <div className="space-y-1">
              {Object.entries(tocData)
                .sort(([a], [b]) => (a === "Undated" ? 1 : b === "Undated" ? -1 : a.localeCompare(b)))
                .map(([year, titles]) => (
                  <div key={year}>
                    <button
                      className="w-full flex items-center justify-between py-2 border-b border-border text-left group"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedYears((prev) => ({ ...prev, [year]: !prev[year] }));
                      }}
                    >
                      <span className="font-body text-base font-semibold text-foreground">{year}</span>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedYears[year] ? "rotate-180" : ""}`} />
                    </button>
                    {expandedYears[year] && (
                      <div className="pl-4 py-1 space-y-0">
                        {titles.map((title, i) => {
                          const pageIndex = pages.findIndex(
                            (p) => (p.type === "album" || p.type === "story") && p.title === title
                          );
                          return (
                            <div
                              key={i}
                              draggable
                              onDragStart={() => setDragState({ year, index: i })}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => {
                                if (dragState && dragState.year === year && dragState.index !== i) {
                                  const arr = [...tocData[year]];
                                  const [moved] = arr.splice(dragState.index, 1);
                                  arr.splice(i, 0, moved);
                                  tocData[year] = arr;
                                }
                                setDragState(null);
                              }}
                              onDragEnd={() => setDragState(null)}
                              className={`flex items-center py-1.5 cursor-grab active:cursor-grabbing rounded transition-colors ${
                                dragState?.year === year && dragState?.index === i ? "opacity-50" : ""
                              }`}
                            >
                              <span className="text-muted-foreground/40 mr-2 text-xs">⠿</span>
                              <button
                                className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (pageIndex >= 0) jumpToPage(pageIndex);
                                }}
                              >
                                {title}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        );
        return (
          <div className="h-full flex flex-col p-6 overflow-hidden">
            <h2 className="font-display text-xl font-semibold text-foreground mb-1">
              {page.title}
            </h2>
            {page.date && (
              <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-4">
                {page.date}
              </p>
            )}
            <div className="flex-1 grid grid-cols-2 gap-2 overflow-hidden">
              {page.photos?.slice(0, 4).map((photo, i) => (
                <div key={i} className="relative rounded overflow-hidden bg-muted">
                  <img
                    src={photo.imageData}
                    alt={photo.caption || "Photo"}
                    className="w-full h-full object-cover"
                  />
                  {photo.caption && (
                    <p className="absolute bottom-0 left-0 right-0 bg-foreground/60 text-background text-[9px] px-2 py-1 truncate">
                      {photo.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "story":
        return (
          <div className="h-full flex flex-col p-6 overflow-hidden">
            <h2 className="font-display text-xl font-semibold text-foreground mb-1">
              {page.title}
            </h2>
            {page.date && (
              <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-4">
                {page.date}
              </p>
            )}
            <div className="flex-1 overflow-hidden">
              <p className="font-body text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {page.content}
              </p>
            </div>
          </div>
        );

      case "end":
        return (
          <div className="h-full flex flex-col items-center justify-end p-8 pb-16 text-center bg-card">
            <p className="font-body text-base font-bold text-foreground tracking-wide">
              The story continues…
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/95 z-50 flex flex-col items-center justify-center">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-background/70 hover:text-background hover:bg-background/10"
        onClick={() => navigate("/")}
      >
        <X className="w-5 h-5" />
      </Button>

      {/* Page counter */}
      <p className="absolute top-4 left-1/2 -translate-x-1/2 text-background/40 text-xs font-body tracking-widest">
        {currentPage + 1} / {pages.length}
      </p>

      {/* Book */}
      <div className="book-preview-scene">
        <div className="book-preview-container">
          {/* Current page */}
          <div
            className={`book-page ${
              isFlipping
                ? flipDirection === "next"
                  ? "page-flip-out"
                  : "page-flip-in"
                : ""
            }`}
          >
            {renderPage(pages[currentPage], currentPage)}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6 mt-6">
        <Button
          variant="ghost"
          size="icon"
          className="text-background/50 hover:text-background hover:bg-background/10 disabled:opacity-20"
          disabled={currentPage === 0 || isFlipping}
          onClick={() => goToPage("prev")}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-background/50 hover:text-background hover:bg-background/10 disabled:opacity-20"
          disabled={currentPage === pages.length - 1 || isFlipping}
          onClick={() => goToPage("next")}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default BookPreview;
