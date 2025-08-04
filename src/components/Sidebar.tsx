import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook, Twitter, Youtube, Instagram, Mail } from "lucide-react";
import PostCard from "./PostCard";

const Sidebar = () => {
  // Mock popular posts
  const popularPosts = [
    {
      id: 1,
      title: "10 Ferramentas de IA Que Todo Criador Deveria Conhecer",
      excerpt: "",
      author: "Maria Santos",
      publishedAt: "2024-01-10",
      readTime: "8 min",
      category: "IA Tools",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400&h=300",
      slug: "ferramentas-ia-criadores",
      isPopular: true
    },
    {
      id: 2,
      title: "Como Monetizar Seu Blog com IA em 2024",
      excerpt: "",
      author: "Pedro Costa",
      publishedAt: "2024-01-08",
      readTime: "6 min",
      category: "Monetização",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=300",
      slug: "monetizar-blog-ia-2024",
      isPopular: true
    },
    {
      id: 3,
      title: "Criando Agentes IA para Automação de Tarefas",
      excerpt: "",
      author: "Ana Silva",
      publishedAt: "2024-01-05",
      readTime: "10 min",
      category: "Agentes",
      imageUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=400&h=300",
      slug: "agentes-ia-automacao",
      isPopular: true
    }
  ];

  const socialStats = [
    { platform: "Facebook", count: "25.7k", icon: Facebook, color: "text-blue-600" },
    { platform: "Twitter", count: "39.3k", icon: Twitter, color: "text-sky-500" },
    { platform: "YouTube", count: "65.4k", icon: Youtube, color: "text-red-600" },
    { platform: "Instagram", count: "23.9k", icon: Instagram, color: "text-pink-600" },
  ];

  return (
    <aside className="space-y-8">
      {/* Newsletter Signup */}
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Newsletter</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm opacity-90">
            Receba as últimas novidades sobre IA e tecnologia diretamente no seu email.
          </p>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Seu email"
              className="w-full px-3 py-2 rounded-lg text-foreground bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 placeholder:text-primary-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
            />
            <Button variant="secondary" className="w-full">
              Inscrever-se
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Siga-nos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {socialStats.map((social) => {
              const Icon = social.icon;
              return (
                <div
                  key={social.platform}
                  className="flex flex-col items-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  <Icon className={`h-5 w-5 ${social.color} mb-2`} />
                  <span className="text-sm font-semibold">{social.count}</span>
                  <span className="text-xs text-muted-foreground">{social.platform}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Popular Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Posts Populares</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {popularPosts.map((post) => (
            <PostCard key={post.id} post={post} variant="horizontal" />
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { name: "IA Tools", count: 25 },
              { name: "Monetização", count: 18 },
              { name: "Agentes", count: 12 },
              { name: "Automações", count: 15 },
            ].map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};

export default Sidebar;