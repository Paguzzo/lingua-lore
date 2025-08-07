import { MemoryStorage } from './memory-storage';

export async function seedMemoryStorage(storage: MemoryStorage) {
  await storage.initialize();
  
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
      categoryId: null
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
      categoryId: null
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
        </ul>`,
      excerpt: "Aprenda como implementar automação inteligente em seu negócio para aumentar a eficiência e escalar operações sem aumentar custos proporcionalmente.",
      slug: "automacao-inteligente-escalar-negocio",
      featuredImage: "https://images.unsplash.com/photo-1518186233392-c232efbf2373?auto=format&fit=crop&w=1200&h=600",
      isPublished: true,
      publishedAt: new Date("2024-01-10"),
      authorName: "Carlos Santos",
      readTime: 7,
      categoryId: null
    }
  ];

  // Adicionar os posts
  for (const postData of samplePosts) {
    await storage.createPost(postData);
  }
  
  console.log('✅ Posts de exemplo criados com sucesso!');
}