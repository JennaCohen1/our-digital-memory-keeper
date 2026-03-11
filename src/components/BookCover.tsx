import { useState } from "react";
import bookCoverTexture from "@/assets/book-cover-texture.jpg";

interface BookCoverProps {
  onOpen: () => void;
}

const BookCover = ({ onOpen }: BookCoverProps) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => onOpen(), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-parchment book-scene">
      <div className={`book-container ${isOpening ? "book-opened" : ""}`}>
        {/* Back page (visible when cover opens) */}
        <div className="book-back-page">
          <div className="h-full flex flex-col items-center justify-center p-12 text-center">
            <p className="font-display text-2xl italic text-muted-foreground leading-relaxed">
              "The best thing about memories is making them."
            </p>
            <span className="mt-4 text-sm text-muted-foreground">— Unknown</span>
          </div>
        </div>

        {/* Front cover */}
        <div className="book-cover" onClick={handleOpen}>
          <img
            src={bookCoverTexture}
            alt=""
            className="absolute inset-0 w-full h-full object-cover rounded-r-lg"
          />
          {/* Spine shadow */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/30 to-transparent rounded-l-sm" />

          {/* Cover content overlay */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-10 text-center">
            {/* Decorative top line */}
            <div className="w-24 h-px bg-amber-200/60 mb-6" />

            <h1 className="font-display text-4xl sm:text-5xl font-bold text-amber-50 drop-shadow-lg leading-tight mb-3">
              Our Memory
              <br />
              Book
            </h1>

            <div className="w-16 h-px bg-amber-200/60 my-4" />

            <p className="font-display text-lg italic text-amber-100/80 drop-shadow mb-8">
              A Family Story
            </p>

            {/* Decorative bottom line */}
            <div className="w-24 h-px bg-amber-200/60 mt-2" />

            <p className="absolute bottom-8 text-xs text-amber-200/50 tracking-widest uppercase">
              Click to open
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCover;
