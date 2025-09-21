import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, Globe, Brain, Zap, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from 'react-i18next';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
}

interface CategoriesResponse {
  categories: Category[];
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const language = i18n.language;

  const { data: categoriesData } = useQuery<CategoriesResponse>({
    queryKey: ['/api/categories'],
    queryFn: () => apiRequest('/api/categories'),
  });
  
  const categories = categoriesData?.categories || [];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-md bg-card/95">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo CriativeIA */}
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                <Zap className="h-2 w-2 text-yellow-900" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                {t('header.logoName')}
              </h1>
              <span className="text-xs text-muted-foreground -mt-1">{t('header.logoSubtitle')}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">{t('header.selectLanguage')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage("pt")}>
                  <span className={`mr-2 ${language === "pt" ? "font-bold" : ""}`}>PT</span>
                  <span className="text-muted-foreground">Português</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("es")}>
                  <span className={`mr-2 ${language === "es" ? "font-bold" : ""}`}>ES</span>
                  <span className="text-muted-foreground">Español</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("en")}>
                  <span className={`mr-2 ${language === "en" ? "font-bold" : ""}`}>EN</span>
                  <span className="text-muted-foreground">English</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <span className="text-sm text-muted-foreground hidden sm:block">
              {language.toUpperCase()}
            </span>



            {/* Admin Access - Discrete Icon */}
            <Link to="/auth">
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border border-slate-300 dark:border-slate-600 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-200 shadow-sm"
                title="Admin Dashboard"
              >
                <span className="text-slate-700 dark:text-slate-300 font-bold text-sm">A</span>
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;