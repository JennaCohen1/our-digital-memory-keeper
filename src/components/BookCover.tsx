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

        {/* Front cover — white with bold black text, Tom Ford style */}
        <div className="book-cover-cream" onClick={handleOpen}>
          {/* Subtle spine shadow */}
          <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-foreground/[0.04] to-transparent" />

          <div className="relative z-10 h-full flex flex-col items-start justify-end px-10 pb-14 text-left">
            <h1 className="font-display text-7xl sm:text-8xl font-bold text-foreground tracking-[0.05em] leading-[0.85] uppercase">
              Chris<br />tian<br />son
            </h1>

            <p className="font-body text-[10px] font-normal tracking-[0.3em] uppercase text-foreground/40 mt-6">
              Our Family's Memories
            </p>
          </div>

          {/* Bottom hint */}
          <p className="absolute bottom-6 left-0 right-0 text-center text-[10px] tracking-[0.2em] uppercase text-muted-foreground/30 font-body">
            Open
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookCover;
