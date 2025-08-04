import PostCard from "./PostCard";

const PostsGrid = () => {
  // Mock recent posts data
  const recentPosts = [
    {
      id: 4,
      title: "ChatGPT vs Claude: Qual IA Escolher para Seu Negócio?",
      excerpt: "Comparamos as principais ferramentas de IA disponíveis no mercado para ajudar você a tomar a melhor decisão.",
      author: "Carlos Oliveira",
      publishedAt: "2024-01-12",
      readTime: "7 min",
      category: "IA Tools",
      imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=600&h=400",
      slug: "chatgpt-vs-claude-comparacao"
    },
    {
      id: 5,
      title: "Automação de Marketing com IA: Guia Completo",
      excerpt: "Aprenda a automatizar seus processos de marketing digital usando inteligência artificial.",
      author: "Laura Fernandes",
      publishedAt: "2024-01-11",
      readTime: "9 min",
      category: "Automações",
      imageUrl: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=600&h=400",
      slug: "automacao-marketing-ia-guia"
    },
    {
      id: 6,
      title: "Como Criar Agentes IA Personalizados para Atendimento",
      excerpt: "Desenvolva chatbots inteligentes que oferecem suporte 24/7 aos seus clientes.",
      author: "Roberto Silva",
      publishedAt: "2024-01-09",
      readTime: "12 min",
      category: "Agentes",
      imageUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=600&h=400",
      slug: "agentes-ia-atendimento-personalizado"
    },
    {
      id: 7,
      title: "Estratégias de Monetização para Criadores de Conteúdo IA",
      excerpt: "Descubra diferentes formas de gerar receita com conteúdo relacionado à inteligência artificial.",
      author: "Amanda Costa",
      publishedAt: "2024-01-07",
      readTime: "6 min",
      category: "Monetização",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=400",
      slug: "estrategias-monetizacao-criadores-ia"
    },
    {
      id: 8,
      title: "IA Generativa: O Futuro da Criação de Conteúdo Visual",
      excerpt: "Explore as ferramentas mais avançadas para geração de imagens e vídeos com inteligência artificial.",
      author: "Daniel Santos",
      publishedAt: "2024-01-06",
      readTime: "8 min",
      category: "IA Tools",
      imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&h=400",
      slug: "ia-generativa-criacao-visual"
    },
    {
      id: 9,
      title: "Workflow de Automação: Da Ideia à Implementação",
      excerpt: "Um guia prático para criar fluxos de trabalho automatizados eficientes em qualquer empresa.",
      author: "Beatriz Lima",
      publishedAt: "2024-01-04",
      readTime: "11 min",
      category: "Automações",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&h=400",
      slug: "workflow-automacao-implementacao"
    }
  ];

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Artigos Recentes</h2>
        <div className="flex items-center space-x-4 text-sm">
          <button className="text-primary font-medium hover:underline">
            Todos
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            IA Tools
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            Monetização
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            Agentes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recentPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center pt-8">
        <button className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium">
          Carregar Mais Artigos
        </button>
      </div>
    </section>
  );
};

export default PostsGrid;