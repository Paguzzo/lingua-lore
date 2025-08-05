
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users as UsersIcon, Mail, Calendar, MoreHorizontal } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  isActive: boolean;
  source: 'newsletter' | 'contact' | 'comment';
}

export default function Users() {
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
    queryFn: async () => {
      // Dados fictícios para demonstração - em produção viria da API
      return [
        {
          id: '1',
          email: 'joao.silva@email.com',
          name: 'João Silva',
          subscribedAt: '2024-01-15T10:30:00Z',
          isActive: true,
          source: 'newsletter'
        },
        {
          id: '2',
          email: 'maria.santos@email.com',
          name: 'Maria Santos',
          subscribedAt: '2024-01-14T14:20:00Z',
          isActive: true,
          source: 'newsletter'
        },
        {
          id: '3',
          email: 'pedro.oliveira@email.com',
          subscribedAt: '2024-01-13T09:15:00Z',
          isActive: false,
          source: 'contact'
        },
        {
          id: '4',
          email: 'ana.costa@email.com',
          name: 'Ana Costa',
          subscribedAt: '2024-01-12T16:45:00Z',
          isActive: true,
          source: 'newsletter'
        },
        {
          id: '5',
          email: 'carlos.pereira@email.com',
          subscribedAt: '2024-01-11T11:30:00Z',
          isActive: true,
          source: 'comment'
        }
      ];
    },
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    newsletter: users.filter(u => u.source === 'newsletter').length,
    thisMonth: users.filter(u => {
      const userDate = new Date(u.subscribedAt);
      const now = new Date();
      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
    }).length,
  };

  const getSourceBadge = (source: User['source']) => {
    const variants = {
      newsletter: { label: 'Newsletter', variant: 'default' as const },
      contact: { label: 'Contato', variant: 'secondary' as const },
      comment: { label: 'Comentário', variant: 'outline' as const },
    };
    return variants[source];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">Gerencie seus inscritos e usuários</p>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
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
        <h1 className="text-2xl font-bold">Usuários</h1>
        <p className="text-muted-foreground">Gerencie seus inscritos e usuários</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <UsersIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <CardDescription className="text-xs">
              Todos os usuários registrados
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UsersIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <CardDescription className="text-xs">
              {Math.round((stats.active / stats.total) * 100)}% do total
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscritos Newsletter</CardTitle>
            <Mail className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newsletter}</div>
            <CardDescription className="text-xs">
              Inscritos na newsletter
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Este Mês</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth}</div>
            <CardDescription className="text-xs">
              Usuários registrados este mês
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Todos os usuários que se inscreveram no blog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => {
              const sourceBadge = getSourceBadge(user.source);
              return (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">
                        {user.name || user.email}
                      </div>
                      {user.name && (
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        Inscrito em {new Date(user.subscribedAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={sourceBadge.variant}>
                      {sourceBadge.label}
                    </Badge>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {users.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum usuário encontrado</h3>
              <p className="text-muted-foreground">
                Os usuários que se inscreverem aparecerão aqui.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
