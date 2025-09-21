import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Globe } from "lucide-react";
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HeroSection = () => {
  const { i18n, t } = useTranslation();
  const language = i18n.language;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const getLanguageFlag = (lang: string) => {
    const flags = {
      pt: '🇧🇷',
      es: '🇪🇸', 
      en: '🇺🇸'
    };
    return flags[lang as keyof typeof flags] || '🌐';
  };

  // Featured post data
  const featuredPost = {
    id: 1,
    title: t('hero.title'),
    excerpt: t('hero.excerpt'),
    author: t('hero.author'),
    publishedAt: "2024-01-15",
    readTime: "7 min",
    category: t('hero.category'),
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&h=600",
    slug: "criativeIA-futuro-criacao-conteudo-inteligente"
  };

  return (
    <section className="bg-gradient-hero py-16 lg:py-24 relative">
      {/* Language Selector - Floating */}
      <div className="absolute top-6 right-6 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white/95 transition-all duration-200 shadow-lg"
            >
              <Globe className="h-4 w-4 mr-2" />
              <span className="text-lg mr-1">{getLanguageFlag(language)}</span>
              <span className="font-medium">{language.toUpperCase()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm">
            <DropdownMenuItem 
              onClick={() => changeLanguage("pt")}
              className={`cursor-pointer ${language === "pt" ? "bg-primary/10" : ""}`}
            >
              <span className="text-lg mr-2">🇧🇷</span>
              <span className={`${language === "pt" ? "font-bold" : ""}`}>Português</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => changeLanguage("es")}
              className={`cursor-pointer ${language === "es" ? "bg-primary/10" : ""}`}
            >
              <span className="text-lg mr-2">🇪🇸</span>
              <span className={`${language === "es" ? "font-bold" : ""}`}>Español</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => changeLanguage("en")}
              className={`cursor-pointer ${language === "en" ? "bg-primary/10" : ""}`}
            >
              <span className="text-lg mr-2">🇺🇸</span>
              <span className={`${language === "en" ? "font-bold" : ""}`}>English</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
                <span>{featuredPost.readTime} {t('hero.readTimeSuffix')}</span>
              </div>
            </div>
            
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
              {t('hero.readFullArticle')}
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
                  {t('hero.featuredArticle')}
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