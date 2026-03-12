import { useState } from "react";

interface BookCoverProps {
  onOpen: () => void;
}

const BookCover = ({ onOpen }: BookCoverProps) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => onOpen(), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-muted book-scene">
      <div className={`book-container ${isOpening ? "book-opened" : ""}`}>
        {/* Back page */}
        <div className="book-back-page">
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
        </div>

        {/* Front cover — white with bold black text, Tom Ford style */}
        <div className="book-cover-cream" onClick={handleOpen}>
          {/* Subtle spine shadow */}
          <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-foreground/[0.04] to-transparent" />

          <div className="relative z-10 h-full flex flex-col items-center justify-end pb-16">
            <div className="w-[80%]" style={{ fontSize: 'clamp(3rem, 15vw, 6rem)', lineHeight: 1.1 }}>
              {["CHR", "IST", "IAN", "SON"].map((row, ri) => (
                <div key={ri} className="flex justify-between">
                  {row.split("").map((letter, ci) => (
                    <span key={ci} className="font-display font-bold text-foreground uppercase inline-block" style={{ width: '1em', textAlign: 'center' }}>{letter}</span>
                  ))}
                </div>
              ))}
            </div>

          </div>

          {/* Date at bottom center */}
          <p className="absolute bottom-6 left-0 right-0 text-center font-display text-xs italic text-foreground">
            8.7.1978
          </p>

          {/* Open hint at bottom right, like flipping a page corner */}
          <p className="absolute bottom-3 right-4 text-[9px] tracking-[0.15em] uppercase text-muted-foreground/30 font-body">
            Open →
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookCover;
