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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background book-scene">
      <div className={`book-container ${isOpening ? "book-opened" : ""}`}>
        {/* Back page */}
        <div className="book-back-page">
          <div className="h-full flex flex-col items-center justify-center p-10 text-center">
            <p className="font-display text-xl italic text-muted-foreground leading-relaxed">
              "The best thing about memories<br />is making them."
            </p>
          </div>
        </div>

        {/* Front cover — minimal dark */}
        <div className="book-cover" onClick={handleOpen}>
          {/* Spine edge */}
          <div className="absolute inset-y-0 left-0 w-4 bg-foreground/10" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-12 text-center">
            {/* Thin rule */}
            <div className="w-12 h-px bg-background/20 mb-8" />

            <h1 className="font-display text-4xl sm:text-5xl font-medium text-background tracking-tight leading-tight">
              Our
              <br />
              Memory
              <br />
              Book
            </h1>

            <div className="w-8 h-px bg-background/20 my-8" />

            <p className="font-body text-sm font-light tracking-[0.2em] uppercase text-background/50">
              A Family Story
            </p>
          </div>

          {/* Bottom hint */}
          <p className="absolute bottom-6 left-0 right-0 text-center text-xs tracking-[0.15em] uppercase text-background/30 font-body">
            Open
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookCover;
