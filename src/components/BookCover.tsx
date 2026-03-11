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
            <p className="font-display text-sm italic text-muted-foreground leading-relaxed max-w-[260px]">
              "If you can fill the unforgiving minute<br />
              With sixty seconds' worth of distance run,<br />
              Yours is the Earth and everything that's in it."
            </p>
            <p className="font-body text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mt-4">
              — Rudyard Kipling
            </p>
          </div>
        </div>

        {/* Front cover — white with bold black text, Tom Ford style */}
        <div className="book-cover-cream" onClick={handleOpen}>
          {/* Subtle spine shadow */}
          <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-foreground/[0.04] to-transparent" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-10">
            <div className="w-full" style={{ fontSize: 'clamp(4rem, 18vw, 8rem)', lineHeight: 0.85 }}>
              {["CHR", "IST", "IAN", "SON"].map((row, ri) => (
                <div key={ri} className="flex justify-between">
                  {row.split("").map((letter, ci) => (
                    <span key={ci} className="font-display font-bold text-foreground uppercase inline-block" style={{ width: '1em', textAlign: 'center' }}>{letter}</span>
                  ))}
                </div>
              ))}
            </div>

            <p className="font-body text-[10px] font-normal tracking-[0.3em] uppercase text-foreground mt-6">
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
