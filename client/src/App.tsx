
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "next-themes";
import { useTranslation } from 'react-i18next';

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Post from "./pages/Post";
import CategoryPage from "./pages/CategoryPage";
import Ferramentas from "./pages/Ferramentas";
import Automacao from "./pages/Automacao";
import Tutoriais from "./pages/Tutoriais";
import IaCriativa from "./pages/IaCriativa";
import Tecnologia from "./pages/Tecnologia";
import Monetizacao from "./pages/Monetizacao";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import About from "./pages/About";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Posts from "./pages/admin/Posts";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import Newsletter from "./pages/admin/Newsletter";
import NotFound from "./pages/NotFound";
import PostEditor from "./pages/admin/PostEditor";

// QueryClient importado de ./lib/queryClient com configuração defaultQueryFn

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/post/:slug" element={<Post />} />
              <Route path="/category/ferramentas" element={<Ferramentas />} />
              <Route path="/category/automacao" element={<Automacao />} />
              <Route path="/category/tutoriais" element={<Tutoriais />} />
              <Route path="/category/ia-criativa" element={<IaCriativa />} />
              <Route path="/category/tecnologia" element={<Tecnologia />} />
              <Route path="/category/monetizacao" element={<Monetizacao />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="category/:slug" element={<CategoryPage />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              
              {/* Admin routes */}
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="posts" element={<Posts />} />
                <Route path="posts/new" element={<PostEditor />} />
                <Route path="posts/edit/:id" element={<PostEditor />} />
                <Route path="categories" element={<Categories />} />
                <Route path="newsletter" element={<Newsletter />} />
                <Route path="users" element={<Users />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
