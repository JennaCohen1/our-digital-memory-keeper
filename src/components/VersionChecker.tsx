import { useVersionCheck } from "@/hooks/useVersionCheck";
import { RefreshCw } from "lucide-react";

export function VersionChecker() {
  const { updateAvailable } = useVersionCheck();

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-primary text-primary-foreground px-4 py-2 flex items-center justify-center gap-3 text-sm">
      <span>A new version is available.</span>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-1 underline font-medium"
      >
        <RefreshCw className="h-3 w-3" />
        Refresh
      </button>
    </div>
  );
}
