import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";
import AdminLayout from "@/components/AdminLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import Posts from "./pages/admin/Posts";
import PostEditor from "./pages/admin/PostEditor";
import Post from "./pages/Post";
import NotFound from "./pages/NotFound";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/post/:slug" element={<Post />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/admin/posts" element={<AdminLayout><Posts /></AdminLayout>} />
            <Route path="/admin/posts/new" element={<AdminLayout><PostEditor /></AdminLayout>} />
            <Route path="/admin/posts/edit/:id" element={<AdminLayout><PostEditor /></AdminLayout>} />
            <Route path="/admin/categories" element={<AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Categorias</h1><p className="text-muted-foreground">Gerenciamento de categorias em desenvolvimento.</p></div></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Configurações</h1><p className="text-muted-foreground">Configurações do sistema em desenvolvimento.</p></div></AdminLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;