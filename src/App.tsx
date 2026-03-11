import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Memories from "./pages/Memories.tsx";
import CreateAlbum from "./pages/CreateAlbum.tsx";
import CreateStory from "./pages/CreateStory.tsx";
import NotFound from "./pages/NotFound.tsx";
import BookPreview from "./pages/BookPreview.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/add/album" element={<CreateAlbum />} />
          <Route path="/add/story" element={<CreateStory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
