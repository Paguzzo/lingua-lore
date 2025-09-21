import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Users, Zap, Target, Heart, Award } from "lucide-react";
import SEO from "@/components/SEO";

const About = () => {
  useEffect(() => {
    document.title = "Sobre Nós - CriativeIA";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Conheça o CriativeIA e nossa missão de democratizar a criação de conteúdo através da inteligência artificial. Saiba mais sobre nossa equipe e valores.');
    }
  }, []);

  const values = [
    {
      icon: Brain,
      title: "Inovação",
      description: "Estamos sempre na vanguarda da tecnologia de IA, desenvolvendo soluções criativas e eficientes."
    },
    {
      icon: Users,
      title: "Colaboração",
      description: "Acreditamos que a melhor criatividade surge da colaboração entre humanos e inteligência artificial."
    },
    {
      icon: Heart,
      title: "Paixão",
      description: "Somos apaixonados por empoderar criadores e democratizar o acesso a ferramentas de alta qualidade."
    },
    {
      icon: Target,
      title: "Foco no Usuário",
      description: "Cada decisão que tomamos tem o usuário no centro, priorizando experiência e resultados."
    },
    {
      icon: Zap,
      title: "Eficiência",
      description: "Desenvolvemos ferramentas que economizam tempo e aumentam a produtividade criativa."
    },
    {
      icon: Award,
      title: "Excelência",
      description: "Buscamos a excelência em tudo que fazemos, desde o código até o atendimento ao cliente."
    }
  ];

  const team = [
    {
      name: "Ana Silva",
      role: "CEO & Fundadora",
      description: "Especialista em IA com 10+ anos de experiência em tecnologia e inovação.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=300&h=300"
    },
    {
      name: "Carlos Santos",
      role: "CTO",
      description: "Arquiteto de software com expertise em machine learning e sistemas distribuídos.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300"
    },
    {
      name: "Maria Oliveira",
      role: "Head of Design",
      description: "Designer UX/UI apaixonada por criar experiências intuitivas e acessíveis.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&h=300"
    },
    {
      name: "João Costa",
      role: "Lead Developer",
      description: "Desenvolvedor full-stack com foco em performance e escalabilidade.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Sobre Nós - CriativeIA"
        description="Conheça a CriativeIA, nossa missão de democratizar o conhecimento em inteligência artificial e nossa equipe especializada em tecnologia e inovação."
        url={window.location.href}
        type="website"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            Sobre o CriativeIA
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Somos uma empresa dedicada a democratizar a criação de conteúdo através da 
            inteligência artificial, combinando tecnologia de ponta com criatividade humana 
            para resultados extraordinários.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Acreditamos que a criatividade não deve ser limitada por barreiras técnicas ou 
              recursos. Nossa missão é empoderar criadores, empresas e indivíduos com 
              ferramentas de inteligência artificial que amplificam sua capacidade criativa.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Através do CriativeIA, queremos tornar a criação de conteúdo de alta qualidade 
              acessível a todos, independentemente de seu nível técnico ou orçamento.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Nossa Visão</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Visualizamos um futuro onde a inteligência artificial e a criatividade humana 
              trabalham em perfeita harmonia, criando possibilidades ilimitadas para 
              expressão e inovação.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Queremos ser a plataforma de referência global para criação de conteúdo 
              assistida por IA, reconhecida pela qualidade, inovação e impacto positivo 
              na comunidade criativa.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Nossa Equipe</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto"
                    />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="font-semibold text-primary">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Nossa História</h2>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="mb-6">
                    O CriativeIA nasceu da frustração de criadores que enfrentavam barreiras 
                    técnicas para expressar suas ideias. Em 2023, nossa equipe de especialistas 
                    em IA e design se uniu com uma visão clara: democratizar a criação de conteúdo.
                  </p>
                  <p className="mb-6">
                    Começamos como um pequeno projeto de pesquisa, explorando como a inteligência 
                    artificial poderia amplificar a criatividade humana sem substituí-la. 
                    Rapidamente percebemos o potencial transformador dessa abordagem.
                  </p>
                  <p className="mb-6">
                    Hoje, o CriativeIA serve milhares de usuários ao redor do mundo, desde 
                    criadores independentes até grandes empresas, todos unidos pela paixão 
                    de criar conteúdo excepcional.
                  </p>
                  <p>
                    Continuamos evoluindo, sempre ouvindo nossa comunidade e inovando para 
                    oferecer as melhores ferramentas de criação assistida por IA do mercado.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Junte-se à Nossa Jornada</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Seja parte da revolução criativa. Descubra como o CriativeIA pode 
            transformar sua forma de criar conteúdo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Entre em Contato
            </a>
            <a 
              href="/" 
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Explore a Plataforma
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;