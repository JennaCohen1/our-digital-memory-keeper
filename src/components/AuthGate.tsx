import { type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SpaceProvider } from "@/contexts/SpaceContext";
import SignIn from "@/pages/SignIn";

export default function AuthGate({ children }: { children: ReactNode }) {
  const { isSignedIn, loading } = useAuth();
  // #region agent log
  fetch("http://127.0.0.1:7683/ingest/d1ed7b71-be6e-4f7b-88ca-db5fa32ff6c7", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "e75e82" },
    body: JSON.stringify({
      sessionId: "e75e82",
      location: "AuthGate.tsx:render",
      message: "AuthGate branch",
      data: { loading, isSignedIn, branch: !isSignedIn ? "SignIn" : "SpaceProvider" },
      timestamp: Date.now(),
      hypothesisId: "H2",
    }),
  }).catch(() => {});
  // #endregion
  if (loading) {
    return null;
  }

  if (!isSignedIn) {
    return <SignIn />;
  }

  return <SpaceProvider>{children}</SpaceProvider>;
}
