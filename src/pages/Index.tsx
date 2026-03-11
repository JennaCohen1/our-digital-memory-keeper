import { Link } from "react-router-dom";
import { BookOpen, ImagePlus, PenLine, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const features = [
  {
    icon: ImagePlus,
    title: "Scan & Import Photos",
    description: "Upload old photographs or snap new ones to preserve every moment.",
  },
  {
    icon: PenLine,
    title: "Write Stories",
    description: "Capture memories in your own words — from quick captions to long-form stories.",
  },
  {
    icon: Mic,
    title: "Voice-Over",
    description: "Record your voice telling the story behind each memory. (Coming soon)",
  },
  {
    icon: BookOpen,
    title: "Publish as a Book",
    description: "Turn your collected memories into a beautiful printed book. (Coming soon)",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
          <BookOpen className="w-4 h-4" />
          A place for family memories
        </div>
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-foreground leading-tight mb-6">
          Every family has a story worth keeping
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
          Collect photos, write stories, and preserve your family's most
          precious memories — all in one beautiful place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/add">
            <Button size="lg" className="text-base px-8">
              Start Adding Memories
            </Button>
          </Link>
          <Link to="/memories">
            <Button size="lg" variant="outline" className="text-base px-8">
              View Memory Book
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card rounded-xl border border-border p-6 shadow-warm transition-all hover:shadow-lg"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-8">
        <p className="text-center text-sm text-muted-foreground">
          Made with love for our family 💛
        </p>
      </footer>
    </div>
  );
};

export default Index;
