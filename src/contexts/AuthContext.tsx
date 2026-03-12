import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useGoogleLogin } from "@react-oauth/google";

export interface User {
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextValue {
  user: User | null;
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  idToken: string | null;
  setUserAndToken: (user: User, idToken: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = "memory-book-user";
const TOKEN_KEY = "memory-book-id-token";

function loadStored(): { user: User | null; idToken: string | null } {
  try {
    const u = localStorage.getItem(USER_KEY);
    const t = localStorage.getItem(TOKEN_KEY);
    if (u && t) return { user: JSON.parse(u) as User, idToken: t };
  } catch {
    /* ignore */
  }
  return { user: null, idToken: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => loadStored().user);
  const [idToken, setIdToken] = useState<string | null>(() => loadStored().idToken);

  const setUserAndToken = useCallback((u: User, token: string) => {
    setUserState(u);
    setIdToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    localStorage.setItem(TOKEN_KEY, token);
  }, []);

  const signOut = useCallback(() => {
    setUserState(null);
    setIdToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      const res = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!res.ok) return;
      const profile = (await res.json()) as {
        email: string;
        name: string;
        picture?: string;
      };
      // Get ID token if available (needed for backend auth); use access_token as fallback
      const idToken =
        "id_token" in tokenResponse
          ? (tokenResponse as { id_token?: string }).id_token
          : accessToken;
      setUserAndToken(
        { email: profile.email, name: profile.name, picture: profile.picture },
        idToken ?? accessToken
      );
    },
    scope: "openid email profile",
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isSignedIn: !!user,
      signIn: login,
      signOut,
      idToken,
      setUserAndToken,
    }),
    [user, idToken, login, signOut, setUserAndToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
