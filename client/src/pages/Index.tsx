import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PostsGrid from "@/components/PostsGrid";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import SEO from '@/components/SEO';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="CriativeIA - Blog de Inteligência Artificial e Tecnologia"
        description="Descubra as últimas tendências em IA, tutoriais práticos e insights sobre tecnologia. Conteúdo especializado para desenvolvedores e entusiastas de inteligência artificial."
        keywords={['inteligência artificial', 'IA', 'tecnologia', 'blog', 'tutoriais', 'machine learning', 'deep learning', 'programação']}
        url={window.location.href}
        type="website"
      />
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
      
      <Footer />
    </div>
  );
};

export default Index;
