import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";

const HeroSection = () => {
  // Featured post data
  const featuredPost = {
    id: 1,
    title: "CriativeIA: O Futuro da Criação de Conteúdo Inteligente",
    excerpt: "Explore como nossa plataforma revoluciona a criação de conteúdo combinando inteligência artificial com criatividade humana para resultados extraordinários.",
    author: "Equipe CriativeIA",
    publishedAt: "2024-01-15",
    readTime: "7 min",
    category: "IA & Criatividade",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&h=600",
    slug: "criativeIA-futuro-criacao-conteudo-inteligente"
  };

  return (
    <section className="bg-gradient-hero py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <Badge variant="secondary" className="w-fit">
              {featuredPost.category}
            </Badge>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {featuredPost.title}
            </h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {featuredPost.excerpt}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{featuredPost.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{featuredPost.readTime} de leitura</span>
              </div>
            </div>
            
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
              Ler Artigo Completo
            </Button>
          </div>

          {/* Featured Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-hover">
              <img
                src={featuredPost.imageUrl}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-hover border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">
                  Artigo em Destaque
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;