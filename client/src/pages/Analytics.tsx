import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MousePointer, Clock, TrendingUp } from "lucide-react";

interface AnalyticsData {
  id: string;
  eventType: string;
  eventData: any;
  postId?: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
}

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData[]>({
    queryKey: ['/api/analytics'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Calcular estatísticas
  const totalEvents = analytics?.length || 0;
  const pageViews = analytics?.filter(a => a.eventType === 'page_view').length || 0;
  const clicks = analytics?.filter(a => a.eventType === 'click').length || 0;
  const uniqueIPs = new Set(analytics?.map(a => a.ipAddress)).size || 0;

  const eventTypeColors: Record<string, string> = {
    'page_view': 'bg-blue-100 text-blue-800',
    'click': 'bg-green-100 text-green-800',
    'scroll': 'bg-purple-100 text-purple-800',
    'form_submit': 'bg-orange-100 text-orange-800',
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'page_view':
        return <Eye className="h-4 w-4" />;
      case 'click':
        return <MousePointer className="h-4 w-4" />;
      case 'scroll':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Acompanhe o desempenho e engajamento do seu blog
        </p>
      </div>

      {/* Estatísticas Resumidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              Todas as interações registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pageViews}</div>
            <p className="text-xs text-muted-foreground">
              Páginas visualizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clicks}</div>
            <p className="text-xs text-muted-foreground">
              Elementos clicados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueIPs}</div>
            <p className="text-xs text-muted-foreground">
              IPs únicos registrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Eventos */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos Recentes</CardTitle>
          <CardDescription>
            Últimas interações registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.slice(0, 20).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                    {getEventIcon(event.eventType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={eventTypeColors[event.eventType] || 'bg-gray-100 text-gray-800'}
                      >
                        {event.eventType}
                      </Badge>
                      {event.postId && (
                        <Badge variant="outline">
                          Post: {event.postId}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      IP: {event.ipAddress} • {new Date(event.createdAt).toLocaleString('pt-BR')}
                    </p>
                    {event.eventData && typeof event.eventData === 'object' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Dados: {JSON.stringify(event.eventData)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {event.userAgent.length > 50 
                    ? `${event.userAgent.substring(0, 50)}...` 
                    : event.userAgent
                  }
                </div>
              </div>
            ))}
          </div>

          {analytics?.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Nenhum evento registrado
              </h3>
              <p className="text-muted-foreground">
                Os eventos de analytics aparecerão aqui conforme os usuários interagem com o blog
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}