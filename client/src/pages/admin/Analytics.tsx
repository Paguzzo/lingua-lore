
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Eye, Clock, Calendar } from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  avgTimeOnSite: string;
  bounceRate: string;
  topPosts: Array<{
    title: string;
    views: number;
    slug: string;
  }>;
  viewsOverTime: Array<{
    date: string;
    views: number;
  }>;
}

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics'],
    queryFn: async () => {
      // Dados fictícios para demonstração
      return {
        totalViews: 15840,
        uniqueVisitors: 8420,
        avgTimeOnSite: '3m 42s',
        bounceRate: '32%',
        topPosts: [
          { title: 'Transformação digital: impactos da IA no mundo dos negócios', views: 2450, slug: 'transformacao-digital-ia' },
          { title: 'ChatGPT vs Claude: Qual IA Escolher?', views: 1820, slug: 'chatgpt-vs-claude' },
          { title: '10 Ferramentas de IA Essenciais', views: 1340, slug: '10-ferramentas-ia' },
        ],
        viewsOverTime: [
          { date: '2024-01-01', views: 450 },
          { date: '2024-01-02', views: 520 },
          { date: '2024-01-03', views: 380 },
          { date: '2024-01-04', views: 640 },
          { date: '2024-01-05', views: 590 },
        ]
      };
    },
  });

  const statCards = [
    {
      title: 'Total de Visualizações',
      value: analytics?.totalViews.toLocaleString() || '0',
      description: '+12% em relação ao mês anterior',
      icon: Eye,
      color: 'text-blue-600',
    },
    {
      title: 'Visitantes Únicos',
      value: analytics?.uniqueVisitors.toLocaleString() || '0',
      description: '+8% em relação ao mês anterior',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Tempo Médio no Site',
      value: analytics?.avgTimeOnSite || '0s',
      description: '+15% em relação ao mês anterior',
      icon: Clock,
      color: 'text-purple-600',
    },
    {
      title: 'Taxa de Rejeição',
      value: analytics?.bounceRate || '0%',
      description: '-5% em relação ao mês anterior',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Acompanhe o desempenho do seu blog</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
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
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Acompanhe o desempenho do seu blog</p>
      </div>

      {/* Cards de Estatísticas */}
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
        {/* Posts Mais Populares */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Posts Mais Populares
            </CardTitle>
            <CardDescription>
              Posts com mais visualizações nos últimos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.topPosts.map((post, index) => (
                <div key={post.slug} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm leading-tight line-clamp-2">
                        {post.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {post.views.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visualizações ao Longo do Tempo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Visualizações Recentes
            </CardTitle>
            <CardDescription>
              Visualizações dos últimos 5 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.viewsOverTime.map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <div className="text-sm">
                    {new Date(day.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(day.views / 700) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium w-12 text-right">
                      {day.views}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
