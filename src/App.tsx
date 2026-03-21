import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import PropertyDetail from "./pages/PropertyDetail.tsx";
import SavedRooms from "./pages/SavedRooms.tsx";
import TermsPage from "./pages/TermsPage.tsx";

import NotFound from "./pages/NotFound.tsx";
import { ScrollToTop } from "./components/ScrollToTop.tsx";
import { MobileBottomNav } from "./components/MobileBottomNav.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/advertisement/:id" element={<PropertyDetail />} />
          <Route path="/saved" element={<SavedRooms />} />
          <Route path="/policy" element={<TermsPage />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <MobileBottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
