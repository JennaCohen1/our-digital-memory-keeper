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
  email: string;
  name: string;
  picture?: string;
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
      email: supaUser.email ?? "",
      name: nameFromMeta ?? supaUser.email ?? "Unknown user",
      picture: pictureFromMeta,
    };

    setUserState(mappedUser);
    setIdToken(session.access_token);
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      applySession(session);
      if (event === "INITIAL_SESSION") {
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
        redirectTo: window.location.origin,
      },
    });
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
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
