import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthGate from "@/components/AuthGate";
import RequireSpace from "@/components/RequireSpace";
import { AuthProvider } from "@/contexts/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { VersionChecker } from "@/components/VersionChecker";
import Index from "./pages/Index.tsx";
import Memories from "./pages/Memories.tsx";
import MyMemories from "./pages/MyMemories.tsx";
import MemoryBooks from "./pages/MemoryBooks.tsx";
import CreateAlbum from "./pages/CreateAlbum.tsx";
import CreateStory from "./pages/CreateStory.tsx";
import NotFound from "./pages/NotFound.tsx";
import BookPreview from "./pages/BookPreview.tsx";

const queryClient = new QueryClient();

function ConfigRequired() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-xl font-bold text-foreground mb-2">Configuration required</h1>
      <p className="text-muted-foreground max-w-md mb-4">
        Add <code className="bg-muted px-1 rounded">VITE_SUPABASE_URL</code> and{" "}
        <code className="bg-muted px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to your deployment
        environment (e.g. Vercel → Project → Settings → Environment Variables), then redeploy.
      </p>
    </div>
  );
}

const App = () =>
  !isSupabaseConfigured ? (
    <ConfigRequired />
  ) : (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <VersionChecker />
        <BrowserRouter>
          <AuthGate>
            <Routes>
              <Route path="/books" element={<MemoryBooks />} />
              <Route path="/my-memories" element={<MyMemories />} />
              <Route
                path="/"
                element={
                  <RequireSpace>
                    <Index />
                  </RequireSpace>
                }
              />
              <Route
                path="/memories"
                element={
                  <RequireSpace>
                    <Memories />
                  </RequireSpace>
                }
              />
              <Route
                path="/add/album"
                element={
                  <RequireSpace>
                    <CreateAlbum />
                  </RequireSpace>
                }
              />
              <Route
                path="/add/story"
                element={
                  <RequireSpace>
                    <CreateStory />
                  </RequireSpace>
                }
              />
              <Route
                path="/preview"
                element={
                  <RequireSpace>
                    <BookPreview />
                  </RequireSpace>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthGate>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  );

export default App;
