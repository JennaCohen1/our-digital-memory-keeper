import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export interface User {
  id: string;
  primary_email: string;
  display_name: string;
  avatar_url?: string;
}

interface AuthContextValue {
  user: User | null;
  isSignedIn: boolean;
  loading: boolean;
  signIn: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  idToken: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((session: Session | null) => {
    if (!session) {
      setUserState(null);
      setIdToken(null);
      return;
    }
    const supaUser = session.user;
    const nameFromMeta =
      (supaUser.user_metadata.full_name as string | undefined) ??
      (supaUser.user_metadata.name as string | undefined);
    const pictureFromMeta = supaUser.user_metadata.avatar_url as string | undefined;

    const mappedUser: User = {
      id: supaUser.id,
      primary_email: supaUser.email ?? "",
      display_name: nameFromMeta ?? supaUser.email ?? "Unknown user",
      avatar_url: pictureFromMeta,
    };

    setUserState(mappedUser);
    setIdToken(session.access_token);
  }, []);

  useEffect(() => {
    // When returning from an OAuth redirect (PKCE), the URL contains ?code=…
    // _initialize() may resolve INITIAL_SESSION with a stale session from
    // localStorage before the code exchange finishes.  We must keep loading
    // true until SIGNED_IN fires, which only happens after the exchange
    // completes with a fresh access token.
    const pendingCodeExchange = new URLSearchParams(window.location.search).has("code");

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      applySession(session);

      if (event === "INITIAL_SESSION" && !pendingCodeExchange) {
        // Normal page load — no OAuth redirect in progress.
        setLoading(false);
      } else if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        // SIGNED_IN: fresh session after code exchange (or a normal sign-in).
        // SIGNED_OUT: session was cleared (covers code-exchange failure).
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [applySession]);

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/books`,
      },
    });
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/books`,
      },
    });
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUserState(null);
    setIdToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isSignedIn: !!user,
      signIn: signInWithGoogle,
      signInWithGoogle,
      signInWithEmail,
      signOut,
      idToken,
    }),
    [user, loading, idToken, signInWithGoogle, signInWithEmail, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
