import { Link, useLocation } from "react-router-dom";
import { BookOpen, ImagePlus, PenLine, Home } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/memories", label: "Memories", icon: BookOpen },
    { to: "/add/album", label: "Album", icon: ImagePlus },
    { to: "/add/story", label: "Story", icon: PenLine },
  ];

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-foreground" />
          <span className="font-display text-lg font-semibold text-foreground tracking-tight">
            Memory Book
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                location.pathname === to
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
