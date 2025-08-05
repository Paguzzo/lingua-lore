import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PostsGrid from "@/components/PostsGrid";
import Sidebar from "@/components/Sidebar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      <main className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <PostsGrid />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-950 dark:to-cyan-950 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 <span className="font-semibold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">CriativeIA</span>. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Impulsionando a criatividade com Inteligência Artificial
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
