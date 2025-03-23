
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SiteProvider } from "@/context/SiteContext";
import Index from "./pages/Index";
import Article from "./pages/Article";
import Category from "./pages/Category";
import Page from "./pages/Page";
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import Articles from "./pages/Admin/Articles";
import Categories from "./pages/Admin/Categories";
import Pages from "./pages/Admin/Pages";
import Menus from "./pages/Admin/Menus";
import Media from "./pages/Admin/Media";
import Settings from "./pages/Admin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SiteProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/article/:slug" element={<Article />} />
              <Route path="/category/:slug" element={<Category />} />
              <Route path="/page/:slug" element={<Page />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/articles" element={<Articles />} />
              <Route path="/admin/articles/:id" element={<Articles />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/admin/categories/:id" element={<Categories />} />
              <Route path="/admin/pages" element={<Pages />} />
              <Route path="/admin/pages/:id" element={<Pages />} />
              <Route path="/admin/menus" element={<Menus />} />
              <Route path="/admin/media" element={<Media />} />
              <Route path="/admin/settings" element={<Settings />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SiteProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
