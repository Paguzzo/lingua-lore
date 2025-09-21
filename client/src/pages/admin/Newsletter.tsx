import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Mail, Users, UserCheck, UserX, Search, Download, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  isActive: boolean;
  source: string;
  subscribedAt: string;
  unsubscribedAt?: string;
  emailVerified: boolean;
  createdAt: string;
}

export default function Newsletter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [testEmail, setTestEmail] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch subscribers
  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ["subscribers"],
    queryFn: () => apiRequest("/api/subscribers"),
  });

  // Delete subscriber mutation
  const deleteSubscriberMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/subscribers/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
      toast({
        title: "Sucesso",
        description: "Subscriber removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao remover subscriber.",
        variant: "destructive",
      });
    },
  });

  const sendTestEmail = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest('/api/subscribers/test-email', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao enviar email de teste');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Email de teste enviado com sucesso!",
      });
      setTestEmail('');
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter((subscriber: Subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subscriber.name && subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Statistics
  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter((s: Subscriber) => s.isActive).length;
  const verifiedSubscribers = subscribers.filter((s: Subscriber) => s.emailVerified).length;

  // Export subscribers to CSV
  const exportToCSV = () => {
    const csvContent = [
      ["Email", "Nome", "Status", "Verificado", "Fonte", "Data de Inscrição"],
      ...subscribers.map((s: Subscriber) => [
        s.email,
        s.name || "",
        s.isActive ? "Ativo" : "Inativo",
        s.emailVerified ? "Sim" : "Não",
        s.source,
        new Date(s.subscribedAt).toLocaleDateString("pt-BR")
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando subscribers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletter</h1>
          <p className="text-muted-foreground">
            Gerencie os subscribers da sua newsletter
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              {totalSubscribers > 0 ? Math.round((activeSubscribers / totalSubscribers) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E-mails Verificados</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              {totalSubscribers > 0 ? Math.round((verifiedSubscribers / totalSubscribers) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Subscribers</CardTitle>
          <CardDescription>
            Lista de todos os subscribers da newsletter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por email ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Test Email Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Teste de Email
              </CardTitle>
              <CardDescription>
                Envie um email de teste para verificar se a configuração está funcionando corretamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Digite um email para teste..."
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  type="email"
                  className="flex-1"
                />
                <Button
                  onClick={() => sendTestEmail.mutate(testEmail)}
                  disabled={!testEmail || sendTestEmail.isPending}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {sendTestEmail.isPending ? 'Enviando...' : 'Enviar Teste'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscribers Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verificado</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Data de Inscrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {searchTerm ? "Nenhum subscriber encontrado." : "Nenhum subscriber cadastrado."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscribers.map((subscriber: Subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell>{subscriber.name || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                          {subscriber.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subscriber.emailVerified ? "default" : "outline"}>
                          {subscriber.emailVerified ? "Sim" : "Não"}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{subscriber.source}</TableCell>
                      <TableCell>
                        {new Date(subscriber.subscribedAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover Subscriber</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover o subscriber {subscriber.email}?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteSubscriberMutation.mutate(subscriber.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}