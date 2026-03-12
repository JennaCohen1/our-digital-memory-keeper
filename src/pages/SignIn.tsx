import { useState } from "react";
import { BookOpen, LogIn, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const SignIn = () => {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await signInWithEmail(email);
      setEmailSent(true);
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="space-y-4">
          <Button
            size="lg"
            onClick={signInWithGoogle}
            className="gap-2 w-full"
            type="button"
          >
            <LogIn className="w-5 h-5" />
            Continue with Google
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or continue with email
              </span>
            </div>
          </div>
          <form onSubmit={handleEmailSignIn} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button
                type="submit"
                size="lg"
                className="gap-2 w-full sm:w-auto"
                disabled={submitting}
              >
                <Mail className="w-4 h-4" />
                Send magic link
              </Button>
            </div>
            {emailSent && (
              <p className="text-xs text-muted-foreground">
                We&apos;ve sent a sign-in link to {email}. Check your inbox (and
                spam folder) to continue.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
