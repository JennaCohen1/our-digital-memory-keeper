import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSpace } from "@/contexts/SpaceContext";

export default function RequireSpace({ children }: { children: ReactNode }) {
  const { currentSpaceId } = useSpace();
  const location = useLocation();

  if (!currentSpaceId) {
    return <Navigate to="/books" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
