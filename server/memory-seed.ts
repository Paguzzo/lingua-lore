import { MemoryStorage } from './memory-storage';
import bcrypt from 'bcryptjs';

export async function seedMemoryStorage(storage: MemoryStorage) {
  await storage.initialize();
  
  // Criar usuário administrador único
  const adminUser = {
    username: 'compg.oficial@gmail.com',
    password: bcrypt.hashSync('Jt@917705', 10)
  };
  
  const createdUser = await storage.createUser(adminUser);
  console.log('✅ Usuário administrador criado com sucesso!', {
    id: createdUser.id,
    username: createdUser.username
  });
  
  // Obter categorias criadas durante a inicialização
  const categories = await storage.getCategories();
  const tecnologiaCategory = categories.find(c => c.slug === 'tecnologia');
  const iaToolsCategory = categories.find(c => c.slug === 'ia-tools');
  const automacoesCategory = categories.find(c => c.slug === 'automacoes');
  const monetizacaoCategory = categories.find(c => c.slug === 'monetizacao');
  const ferramentasCategory = categories.find(c => c.slug === 'ferramentas');
  const automacaoCategory = categories.find(c => c.slug === 'automacao');
  const tutoriaisCategory = categories.find(c => c.slug === 'tutoriais');
  const iaCriativaCategory = categories.find(c => c.slug === 'ia-criativa');
  
  // Criar posts de exemplo
  const samplePosts = [
    {
      title: "Inteligência Artificial Criativa: Revolucionando o Marketing Digital",
      content: `<h2>A Nova Era da Criação de Conteúdo</h2>
        <p>A inteligência artificial está transformando a forma como criamos e distribuímos conteúdo. Neste artigo, exploramos as principais ferramentas e estratégias que estão moldando o futuro do marketing digital.</p>
        
        <h3>Principais Benefícios da IA na Criação</h3>
        <ul>
          <li>Automatização de processos criativos</li>
          <li>Personalização em massa</li>
          <li>Análise preditiva de performance</li>
          <li>Otimização de ROI</li>
        </ul>
        
        <p>As ferramentas de IA não substituem a criatividade humana, mas a amplificam exponencialmente.</p>`,
      excerpt: "Descubra como a inteligência artificial está revolucionando a criação de conteúdo e o marketing digital, oferecendo novas possibilidades para criadores e empresas.",
      slug: "inteligencia-artificial-criativa-marketing-digital",
      featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&h=600",
      isPublished: true,
      publishedAt: new Date("2024-01-15"),
      authorName: "Equipe CriativeIA",
      readTime: 8,
      categoryId: tecnologiaCategory?.id || null
    },
    {
      title: "Melhores Ferramentas para Produtividade em 2024",
      content: `<h2>Ferramentas Essenciais</h2><p>Descubra as ferramentas que vão boostar sua produtividade.</p>`,
      excerpt: "Lista de ferramentas para produtividade.",
      slug: "melhores-ferramentas-produtividade-2024",
      featuredImage: "https://example.com/image.jpg",
      isPublished: true,
      publishedAt: new Date("2024-01-01"),
      authorName: "Equipe",
      readTime: 5,
      categoryId: ferramentasCategory?.id || null
    },
    {
      title: "Automação no Dia a Dia",
      content: `<h2>Automatize Sua Rotina</h2><p>Dicas para automação cotidiana.</p>`,
      excerpt: "Dicas de automação.",
      slug: "automacao-dia-dia",
      featuredImage: "https://example.com/image.jpg",
      isPublished: true,
      publishedAt: new Date("2024-01-02"),
      authorName: "Equipe",
      readTime: 6,
      categoryId: automacaoCategory?.id || null
    },
    {
      title: "Tutoriais para Iniciantes em IA",
      content: `<h2>Começando com IA</h2><p>Tutoriais básicos para IA.</p>`,
      excerpt: "Tutoriais para iniciantes.",
      slug: "tutoriais-iniciantes-ia",
      featuredImage: "https://example.com/image.jpg",
      isPublished: true,
      publishedAt: new Date("2024-01-03"),
      authorName: "Equipe",
      readTime: 7,
      categoryId: tutoriaisCategory?.id || null
    },
    {
      title: "IA Criativa: Ideias Inovadoras",
      content: `<h2>Inovação com IA</h2><p>Ideias criativas usando IA.</p>`,
      excerpt: "Ideias inovadoras com IA.",
      slug: "ia-criativa-ideias-inovadoras",
      featuredImage: "https://example.com/image.jpg",
      isPublished: true,
      publishedAt: new Date("2024-01-04"),
      authorName: "Equipe",
      readTime: 8,
      categoryId: iaCriativaCategory?.id || null
    },
    {
      title: "5 Ferramentas de IA que Todo Criador Deve Conhecer",
      content: `<h2>Ferramentas Essenciais para Criadores</h2>
        <p>O mercado de ferramentas de IA está em constante evolução. Selecionamos as 5 principais que estão fazendo a diferença no mundo da criação.</p>
        
        <h3>1. ChatGPT - Assistente de Escrita</h3>
        <p>Ideal para brainstorming, redação e otimização de textos.</p>
        
        <h3>2. DALL-E - Geração de Imagens</h3>
        <p>Crie imagens únicas a partir de descrições textuais.</p>
        
        <h3>3. Midjourney - Arte Digital</h3>
        <p>Perfeito para criação artística e conceitual.</p>`,
      excerpt: "Uma lista essencial das melhores ferramentas de IA para criadores de conteúdo, com dicas práticas de uso e casos de sucesso.",
      slug: "5-ferramentas-ia-criador-deve-conhecer",
      featuredImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&h=600",
      isPublished: true,
      publishedAt: new Date("2024-01-12"),
      authorName: "Ana Silva",
      readTime: 6,
      categoryId: iaToolsCategory?.id || null
    },
    {
      title: "Automação Inteligente: Como Escalar Seu Negócio com IA",
      content: `<h2>Escalando com Automação</h2>
        <p>A automação inteligente permite que pequenas empresas operem como grandes corporações. Aprenda as estratégias que funcionam.</p>
        
        <h3>Áreas-Chave para Automação</h3>
        <ul>
          <li>Atendimento ao cliente</li>
          <li>Marketing de conteúdo</li>
          <li>Vendas e follow-up</li>
          <li>Análise de dados</li>
        </ul>
        
        <h3>Implementação Prática</h3>
        <p>Para começar com automação, recomendamos focar em processos repetitivos que consomem muito tempo da equipe. Chatbots inteligentes podem resolver 80% das dúvidas dos clientes, liberando sua equipe para tarefas mais estratégicas.</p>`,
      excerpt: "Aprenda como implementar automação inteligente em seu negócio para aumentar a eficiência e escalar operações sem aumentar custos proporcionalmente.",
      slug: "automacao-inteligente-escalar-negocio",
      featuredImage: "https://images.unsplash.com/photo-1518186233392-c232efbf2373?auto=format&fit=crop&w=1200&h=600",
      isPublished: true,
      publishedAt: new Date("2024-01-10"),
      authorName: "Carlos Santos",
      readTime: 7,
      categoryId: automacoesCategory?.id || null
    },
    {
      title: "Monetização com IA: Transforme Conhecimento em Renda",
      content: `<h2>Oportunidades de Monetização com IA</h2>
        <p>A inteligência artificial abriu um mundo de possibilidades para monetizar conhecimento e habilidades. Desde a criação de cursos até consultoria especializada, as oportunidades são infinitas.</p>
        
        <h3>Principais Estratégias de Monetização</h3>
        <ul>
          <li><strong>Criação de Conteúdo Automatizada:</strong> Use IA para produzir conteúdo em escala</li>
          <li><strong>Consultoria em IA:</strong> Ajude empresas a implementar soluções inteligentes</li>
          <li><strong>Produtos Digitais:</strong> Desenvolva ferramentas e templates com IA</li>
          <li><strong>Cursos Online:</strong> Ensine outros a usar ferramentas de IA</li>
        </ul>
        
        <h3>Casos de Sucesso</h3>
        <p>Muitos criadores já estão faturando 6 dígitos mensais combinando IA com estratégias de marketing digital. O segredo está em identificar problemas reais e criar soluções escaláveis.</p>
        
        <blockquote>
          <p>"A IA não vai substituir humanos, mas humanos que usam IA vão substituir humanos que não usam." - Futuro do Trabalho</p>
        </blockquote>`,
      excerpt: "Descubra as principais estratégias para monetizar conhecimento em IA, desde consultoria até produtos digitais, com casos reais de sucesso.",
      slug: "monetizacao-ia-conhecimento-renda",
      featuredImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&h=600",
      isPublished: true,
      publishedAt: new Date("2024-01-08"),
      authorName: "Marina Costa",
      readTime: 9,
      categoryId: monetizacaoCategory?.id || null
    },
    {
      title: "ChatGPT vs Claude vs Gemini: Comparativo Completo 2024",
      content: `<h2>A Guerra dos Assistentes de IA</h2>
        <p>Com tantas opções disponíveis, escolher o assistente de IA ideal pode ser desafiador. Fizemos um comparativo detalhado das três principais plataformas do mercado.</p>
        
        <h3>ChatGPT (OpenAI)</h3>
        <p><strong>Pontos Fortes:</strong></p>
        <ul>
          <li>Interface intuitiva e fácil de usar</li>
          <li>Excelente para tarefas criativas</li>
          <li>Grande base de conhecimento</li>
          <li>Plugins e integrações</li>
        </ul>
        
        <h3>Claude (Anthropic)</h3>
        <p><strong>Pontos Fortes:</strong></p>
        <ul>
          <li>Melhor em análise de documentos longos</li>
          <li>Mais seguro e ético</li>
          <li>Excelente para programação</li>
          <li>Respostas mais precisas</li>
        </ul>
        
        <h3>Gemini (Google)</h3>
        <p><strong>Pontos Fortes:</strong></p>
        <ul>
          <li>Integração com ecossistema Google</li>
          <li>Acesso a informações em tempo real</li>
          <li>Multimodal (texto, imagem, vídeo)</li>
          <li>Gratuito com conta Google</li>
        </ul>
        
        <h3>Veredicto Final</h3>
        <p>Para criadores de conteúdo, recomendamos usar uma combinação: ChatGPT para brainstorming, Claude para análises profundas e Gemini para pesquisas atualizadas.</p>`,
      excerpt: "Comparativo detalhado entre ChatGPT, Claude e Gemini: descubra qual assistente de IA é melhor para suas necessidades específicas.",
      slug: "chatgpt-claude-gemini-comparativo-2024",
      featuredImage: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?auto=format&fit=crop&w=1200&h=600",
      isPublished: true,
      publishedAt: new Date("2024-01-05"),
      authorName: "Tech Review",
      readTime: 12,
      categoryId: iaToolsCategory?.id || null
    },
    {
      title: "IA Generativa: O Futuro da Criação de Conteúdo Visual",
      content: `<h2>Revolução Visual com IA</h2>
        <p>A IA generativa está transformando completamente a indústria criativa. Designers, artistas e criadores de conteúdo agora têm acesso a ferramentas que antes eram impensáveis.</p>
        
        <h3>Principais Ferramentas de IA Visual</h3>
        <ul>
          <li><strong>Midjourney:</strong> Líder em qualidade artística</li>
          <li><strong>DALL-E 3:</strong> Melhor compreensão de texto</li>
          <li><strong>Stable Diffusion:</strong> Open source e customizável</li>
          <li><strong>Adobe Firefly:</strong> Integrado ao Creative Suite</li>
        </ul>
        
        <h3>Casos de Uso Práticos</h3>
        <p>Desde a criação de thumbnails para YouTube até campanhas publicitárias completas, a IA visual está democratizando a criação profissional.</p>
        
        <h3>Dicas para Melhores Resultados</h3>
        <ol>
          <li>Seja específico nos prompts</li>
          <li>Use referências de estilo</li>
          <li>Itere e refine gradualmente</li>
          <li>Combine diferentes ferramentas</li>
        </ol>
        
        <p>O futuro da criação visual é colaborativo: humanos e IA trabalhando juntos para resultados extraordinários.</p>`,
      excerpt: "Explore o mundo da IA generativa para criação visual: ferramentas, técnicas e casos práticos para revolucionar seu processo criativo.",
      slug: "ia-generativa-futuro-criacao-visual",
      featuredImage: "https://images.unsplash.com/photo-1686191128892-c1c5d5e8e4b8?auto=format&fit=crop&w=1200&h=600",
      isPublished: true,
      publishedAt: new Date("2024-01-03"),
      authorName: "Visual AI Team",
      readTime: 10,
      categoryId: tecnologiaCategory?.id || null
    }
  ];

  // Adicionar os posts
  const createdPosts: any[] = [];
  for (const postData of samplePosts) {
    const post = await storage.createPost(postData);
    createdPosts.push(post);
  }
  
  console.log('✅ Posts de exemplo criados com sucesso!');

  // Adicionar dados de analytics de exemplo
  const sampleAnalytics = [
    // Visualizações do primeiro post (mais popular)
    ...Array.from({ length: 45 }, (_, i) => ({
      eventType: 'page_view',
      eventData: { path: `/post/${createdPosts[0].slug}`, referrer: 'https://google.com' },
      postId: createdPosts[0].id,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`
    })),
    
    // Visualizações do segundo post
    ...Array.from({ length: 32 }, (_, i) => ({
      eventType: 'page_view',
      eventData: { path: `/post/${createdPosts[1].slug}`, referrer: 'https://facebook.com' },
      postId: createdPosts[1].id,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      ipAddress: `10.0.0.${Math.floor(Math.random() * 255)}`
    })),
    
    // Visualizações do terceiro post
    ...Array.from({ length: 28 }, (_, i) => ({
      eventType: 'page_view',
      eventData: { path: `/post/${createdPosts[2].slug}`, referrer: 'https://twitter.com' },
      postId: createdPosts[2].id,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
      ipAddress: `172.16.0.${Math.floor(Math.random() * 255)}`
    })),
    
    // Visualizações gerais da página inicial
    ...Array.from({ length: 67 }, (_, i) => ({
      eventType: 'page_view',
      eventData: { path: '/', referrer: 'https://google.com' },
      postId: null,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    })),
    
    // Alguns cliques em links
    ...Array.from({ length: 15 }, (_, i) => ({
      eventType: 'click',
      eventData: { element: 'social-share', action: 'share' },
      postId: createdPosts[Math.floor(Math.random() * createdPosts.length)].id,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`
    }))
  ];

  // Adicionar os dados de analytics
  for (const analyticsData of sampleAnalytics) {
    await storage.createAnalytic(analyticsData);
  }
  
  console.log('✅ Dados de analytics de exemplo criados com sucesso!');
}