import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY_PREFIX = "memory-book-current-space-";

interface SpaceContextValue {
  currentSpaceId: string | null;
  setCurrentSpaceId: (id: string | null) => void;
  clearSpace: () => void;
}

const SpaceContext = createContext<SpaceContextValue | null>(null);

function getStoredSpaceId(userId: string): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_PREFIX + userId);
  } catch {
    return null;
  }
}

function setStoredSpaceId(userId: string, spaceId: string | null) {
  try {
    if (spaceId) localStorage.setItem(STORAGE_KEY_PREFIX + userId, spaceId);
    else localStorage.removeItem(STORAGE_KEY_PREFIX + userId);
  } catch {
    // ignore
  }
}

export function SpaceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentSpaceId, setState] = useState<string | null>(() =>
    user ? getStoredSpaceId(user.id) : null
  );

  useEffect(() => {
    if (!user) setState(null);
    else setState(getStoredSpaceId(user.id));
  }, [user]);

  const setCurrentSpaceId = useCallback(
    (id: string | null) => {
      setState(id);
      if (user) setStoredSpaceId(user.id, id);
    },
    [user]
  );

  const clearSpace = useCallback(() => {
    setState(null);
    if (user) localStorage.removeItem(STORAGE_KEY_PREFIX + user.id);
  }, [user]);

  const value = useMemo<SpaceContextValue>(
    () => ({ currentSpaceId, setCurrentSpaceId, clearSpace }),
    [currentSpaceId, setCurrentSpaceId, clearSpace]
  );

  return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>;
}

export function useSpace() {
  const ctx = useContext(SpaceContext);
  if (!ctx) throw new Error("useSpace must be used within SpaceProvider");
  return ctx;
}
