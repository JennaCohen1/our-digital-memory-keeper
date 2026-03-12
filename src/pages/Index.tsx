import { useState } from "react";
import { Link } from "react-router-dom";
import { ImagePlus, PenLine, Mic, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import BookCover from "@/components/BookCover";
import { useToast } from "@/hooks/use-toast";

const features = [
  {
    icon: ImagePlus,
    title: "Photo Albums",
    description: "Upload batches of photos, group them into albums, and add captions.",
    to: "/add/album",
  },
  {
    icon: PenLine,
    title: "Written Stories",
    description: "Write standalone memories — no photo needed. Every detail matters.",
    to: "/add/story",
  },
  {
    icon: Mic,
    title: "Voice-Over",
    description: "Record your voice telling the story behind each memory. (Coming soon)",
    comingSoon: true,
  },
  {
    icon: Eye,
    title: "Preview Draft",
    description: "Flip through your collected memories as a beautiful book preview.",
    to: "/preview",
  },
];

const Index = () => {
  const { toast } = useToast();
  const [hasOpenedOnce, setHasOpenedOnce] = useState<boolean>(() => {
    try {
      return localStorage.getItem("memory-book-cover-opened") === "true";
    } catch {
      return false;
    }
  });

  const [bookOpened, setBookOpened] = useState<boolean>(hasOpenedOnce);

  if (!bookOpened) {
    return (
      <BookCover
        onOpen={() => {
          setBookOpened(true);
          setHasOpenedOnce(true);
          try {
            localStorage.setItem("memory-book-cover-opened", "true");
          } catch {
            // ignore storage issues
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />

      <section className="container mx-auto px-4 pt-20 pb-16 text-center max-w-3xl">
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-foreground leading-tight mb-6">
          Every family has a story worth keeping
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
          Collect photos, write stories, and preserve your family's most
          precious memories — all in one beautiful place.
        </p>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => {
            const content = (
              <div
                className="bg-card rounded-xl border border-border p-6 shadow-warm transition-all hover:shadow-lg cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );

            if (feature.to) {
              return (
                <Link key={feature.title} to={feature.to}>
                  {content}
                </Link>
              );
            }

            if (feature.comingSoon) {
              return (
                <button
                  key={feature.title}
                  type="button"
                  onClick={() =>
                    toast({
                      title: "Voice-Over",
                      description: "Voice-Over recording is coming soon.",
                    })
                  }
                  className="text-left"
                >
                  {content}
                </button>
              );
            }

            return (
              <div key={feature.title}>
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-border py-8 mt-8">
        <p className="text-center text-sm text-muted-foreground">
          Made with love for our family 💛
        </p>
      </footer>
    </div>
  );
};

export default Index;
