
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Youtube, Instagram, Mail } from "lucide-react";
import PostCard from "./PostCard";
import { useState } from "react";

const Sidebar = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode implementar a lógica de inscrição na newsletter
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  // Artigos populares
  const popularArticles = [
    {
      id: 1,
      title: "10 Ferramentas de IA Que Todo Criador Deveria Conhecer",
      excerpt: "Descubra as melhores ferramentas de inteligência artificial...",
      author: "Equipe CriativeIA",
      publishedAt: "2024-01-10",
      readTime: "5 min",
      category: "IA Tools",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&h=300",
      slug: "10-ferramentas-ia-criador"
    },
    {
      id: 2,
      title: "ChatGPT vs Claude: Qual IA Escolher para seu Projeto?",
      excerpt: "Comparamos as principais ferramentas de IA disponíveis...",
      author: "Carlos Oliveira",
      publishedAt: "2024-01-08",
      readTime: "7 min",
      category: "IA Tools",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&h=300",
      slug: "chatgpt-vs-claude-qual-escolher"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Newsletter */}
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Mail className="h-5 w-5" />
            Newsletter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-100 mb-4">
            Receba as últimas novidades sobre IA e tecnologia diretamente no seu email.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/20 border-white/30 text-white placeholder:text-purple-200"
            />
            <Button 
              type="submit" 
              className="w-full bg-white text-purple-600 hover:bg-purple-50"
            >
              Inscrever-se
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Posts Populares */}
      <Card>
        <CardHeader>
          <CardTitle>Posts Populares</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {popularArticles.map((post) => (
            <div key={post.id} className="flex gap-3 pb-4 border-b border-border last:border-b-0 last:pb-0">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-tight mb-1 line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {post.readTime} • {post.publishedAt.split('-')[2]}/{post.publishedAt.split('-')[1]}/{post.publishedAt.split('-')[0]}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Siga-nos */}
      <Card>
        <CardHeader>
          <CardTitle>Siga-nos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <Facebook className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">25.7k</div>
              <div className="text-xs text-muted-foreground">Facebook</div>
            </div>
            <div className="text-center">
              <Twitter className="h-8 w-8 mx-auto mb-2 text-blue-400" />
              <div className="text-sm font-medium">39.3k</div>
              <div className="text-xs text-muted-foreground">Twitter</div>
            </div>
            <div className="text-center">
              <Youtube className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <div className="text-sm font-medium">65.4k</div>
              <div className="text-xs text-muted-foreground">YouTube</div>
            </div>
            <div className="text-center">
              <Instagram className="h-8 w-8 mx-auto mb-2 text-pink-600" />
              <div className="text-sm font-medium">23.9k</div>
              <div className="text-xs text-muted-foreground">Instagram</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
