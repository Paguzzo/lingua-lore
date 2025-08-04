import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, Globe } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("pt");

  const categories = [
    { name: "IA Tools", slug: "ia-tools" },
    { name: "Monetização", slug: "monetization" },
    { name: "Agentes", slug: "agents" },
    { name: "Automações", slug: "automations" },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "pt" ? "es" : "pt");
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-md bg-card/95">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">BlogIA</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <a
                key={category.slug}
                href={`/category/${category.slug}`}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {category.name}
              </a>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleLanguage}
              className="text-muted-foreground hover:text-foreground"
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">Toggle language</span>
            </Button>
            
            <span className="text-sm text-muted-foreground hidden sm:block">
              {language === "pt" ? "PT" : "ES"}
            </span>

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
                <a
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;