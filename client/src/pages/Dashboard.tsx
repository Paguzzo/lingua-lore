import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, Eye, Users } from "lucide-react";

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  totalUsers: number;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total de Posts",
      value: stats?.totalPosts || 0,
      description: "Posts criados",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Posts Publicados",
      value: stats?.publishedPosts || 0,
      description: "Posts ativos",
      icon: BarChart3,
      color: "text-green-600"
    },
    {
      title: "Visualizações",
      value: stats?.totalViews || 0,
      description: "Total de views",
      icon: Eye,
      color: "text-purple-600"
    },
    {
      title: "Usuários",
      value: stats?.totalUsers || 0,
      description: "Usuários registrados",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu blog
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}