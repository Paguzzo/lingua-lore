import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Shield, Mail, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Users() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Como não temos uma rota de usuários na API, vamos simular dados
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
    queryFn: () => {
      // Simulando dados de usuários
      return Promise.resolve([
        {
          id: 1,
          username: 'compg.oficial@gmail.com',
          email: 'compg.oficial@gmail.com',
          role: 'admin',
          createdAt: new Date('2025-01-20').toISOString(),
          updatedAt: new Date('2025-01-20').toISOString()
        }
      ]);
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
        <p className="text-muted-foreground">
          Gerencie os usuários do sistema
        </p>
      </div>

      <div className="grid gap-4">
        {users?.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{user.username}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    <Shield className="h-3 w-3 mr-1" />
                    {user.role || 'user'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    Desativar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Nenhum usuário encontrado
          </h3>
          <p className="text-muted-foreground">
            Os usuários aparecerão aqui quando se registrarem
          </p>
        </div>
      )}
    </div>
  );
}