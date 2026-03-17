import { useEffect, useRef, useState } from "react";

const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useVersionCheck() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (import.meta.env.DEV) return;

    const check = async () => {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.buildHash && data.buildHash !== __BUILD_HASH__) {
          setUpdateAvailable(true);
          setLatestVersion(data.version);
        }
      } catch {
        // silently ignore network errors
      }
    };

    check();
    intervalRef.current = setInterval(check, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, []);

  return {
    currentVersion: __APP_VERSION__,
    buildHash: __BUILD_HASH__,
    updateAvailable,
    latestVersion,
  };
}
