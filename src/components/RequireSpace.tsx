import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSpace } from "@/contexts/SpaceContext";

export default function RequireSpace({ children }: { children: ReactNode }) {
  const { currentSpaceId } = useSpace();
  const location = useLocation();
  // #region agent log
  fetch("http://127.0.0.1:7683/ingest/d1ed7b71-be6e-4f7b-88ca-db5fa32ff6c7", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "e75e82" },
    body: JSON.stringify({
      sessionId: "e75e82",
      location: "RequireSpace.tsx:render",
      message: "RequireSpace",
      data: { currentSpaceId: currentSpaceId ?? null, pathname: location.pathname, redirecting: !currentSpaceId },
      timestamp: Date.now(),
      hypothesisId: "H4",
    }),
  }).catch(() => {});
  // #endregion
  if (!currentSpaceId) {
    return <Navigate to="/books" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
