import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  LayoutDashboard,
  FileText,
  Tags,
  Settings,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  Mail
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const { user, signOut, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Erro ao sair',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      navigate('/');
      toast({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
      });
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Categorias', href: '/admin/categories', icon: Tags },
    { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
    ...(userRole === 'admin' ? [
      { name: 'Usuários', href: '/admin/users', icon: Users },
      { name: 'Configurações', href: '/admin/settings', icon: Settings },
    ] : []),
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  const isCurrentPath = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="px-4">
              <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            </div>
            <nav className="mt-8 px-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isCurrentPath(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-card border-r">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="px-4">
                <h1 className="text-xl font-bold text-foreground">Lingua Lore Admin</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {(user as any)?.email || 'Admin'} ({userRole})
                </p>
              </div>
              <nav className="mt-8 flex-1 px-4 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isCurrentPath(item.href)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t p-4">
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}