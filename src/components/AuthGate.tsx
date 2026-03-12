import { type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SpaceProvider } from "@/contexts/SpaceContext";
import SignIn from "@/pages/SignIn";

export default function AuthGate({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <SignIn />;
  }

  return <SpaceProvider>{children}</SpaceProvider>;
}
