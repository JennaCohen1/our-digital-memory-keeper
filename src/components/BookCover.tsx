import { useState } from "react";

interface BookCoverProps {
  onOpen: () => void;
}

const BookCover = ({ onOpen }: BookCoverProps) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => onOpen(), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-muted book-scene">
      <div className={`book-container ${isOpening ? "book-opened" : ""}`}>
        {/* Back page */}
        <div className="book-back-page">
          <div className="h-full flex flex-col items-center justify-center p-10 text-center">
            <p className="font-display text-xl italic text-muted-foreground leading-relaxed">
              "The best thing about memories<br />is making them."
            </p>
          </div>
        </div>

        {/* Front cover — cream with gold text */}
        <div className="book-cover-cream" onClick={handleOpen}>
          {/* Subtle spine shadow */}
          <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-foreground/[0.04] to-transparent" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-12 text-center">
            <h1 className="font-display text-5xl sm:text-6xl font-medium text-warm-gold tracking-[0.04em] leading-[1.15] uppercase">
              Christianson
            </h1>

            <div className="w-10 h-px bg-warm-gold/30 my-8" />

            <p className="font-body text-[11px] font-normal tracking-[0.3em] uppercase text-warm-gold/60">
              Our Family's Memories
            </p>
          </div>

          {/* Bottom hint */}
          <p className="absolute bottom-6 left-0 right-0 text-center text-[10px] tracking-[0.2em] uppercase text-muted-foreground/40 font-body">
            Open
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookCover;
