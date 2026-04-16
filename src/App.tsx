import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { FarmerBriefingBot } from "@/components/FarmerBriefingBot";
import Admin from "./pages/Admin.tsx";
import Index from "./pages/Index.tsx";
import Articles from "./pages/Articles.tsx";
import ArticleDetail from "./pages/ArticleDetail.tsx";
import CropGuide from "./pages/CropGuide.tsx";
import PestControl from "./pages/PestControl.tsx";
import Events from "./pages/Events.tsx";
import SubmitEvent from "./pages/SubmitEvent.tsx";
import Forum from "./pages/Forum.tsx";
import Highlights from "./pages/Highlights.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="agrilearn-theme" disableTransitionOnChange>
      <LanguageProvider>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <FarmerBriefingBot />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/articles/:id" element={<ArticleDetail />} />
                  <Route path="/crop-guide" element={<CropGuide />} />
                  <Route path="/pest-control" element={<PestControl />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/submit" element={<SubmitEvent />} />
                  <Route path="/forum" element={<Forum />} />
                  <Route path="/highlights" element={<Highlights />} />
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<Admin />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
