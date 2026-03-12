import { BookOpen, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const SignIn = () => {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground tracking-tight mb-2">
          Memory Book
        </h1>
        <p className="text-muted-foreground mb-8">
          Sign in to save and share your family's memories.
        </p>
        <Button size="lg" onClick={signIn} className="gap-2 w-full sm:w-auto">
          <LogIn className="w-5 h-5" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default SignIn;
