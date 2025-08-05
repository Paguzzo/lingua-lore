import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Eye, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  totalUsers: number;
}

export default function Dashboard() {
  const { data: stats = {
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    totalUsers: 0,
  }, isLoading: loading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      return response.json();
    }
  });

  const statCards = [
    {
      title: 'Total de Posts',
      value: stats.totalPosts,
      description: `${stats.publishedPosts} publicados`,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Usuários',
      value: stats.totalUsers,
      description: 'Usuários registrados',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Visualizações',
      value: stats.totalViews,
      description: 'Total de visualizações',
      icon: Eye,
      color: 'text-purple-600',
    },
    {
      title: 'Taxa de Publicação',
      value: `${stats.totalPosts > 0 ? Math.round((stats.publishedPosts / stats.totalPosts) * 100) : 0}%`,
      description: 'Posts publicados',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo ao painel de administração</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu blog</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <CardDescription className="text-xs">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sistema iniciado</p>
                  <p className="text-xs text-muted-foreground">Painel de administração ativo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesso rápido às funcionalidades principais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/admin/posts/new" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
              <div className="font-medium">Criar Novo Post</div>
              <div className="text-sm text-muted-foreground">Adicionar conteúdo ao blog</div>
            </a>
            <a href="/admin/categories" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
              <div className="font-medium">Gerenciar Categorias</div>
              <div className="text-sm text-muted-foreground">Organizar conteúdo</div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}