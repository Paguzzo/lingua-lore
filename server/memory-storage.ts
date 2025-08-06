import { IStorage } from "./storage";
import {
  type User, type InsertUser, type Post, type InsertPost, type Category, type InsertCategory,
  type Profile, type InsertProfile, type Media, type InsertMedia, type AffiliateLink, type InsertAffiliateLink,
  type Cta, type InsertCta, type Analytics, type InsertAnalytics, type SiteSetting, type InsertSiteSetting,
  type Webhook, type InsertWebhook
} from "@shared/schema";

// In-memory storage for development
export class MemoryStorage implements IStorage {
  private users: User[] = [];
  private profiles: Profile[] = [];
  private categories: Category[] = [];
  private posts: Post[] = [];
  private media: Media[] = [];
  private affiliateLinks: AffiliateLink[] = [];
  private ctas: Cta[] = [];
  private analytics: Analytics[] = [];
  private siteSettings: SiteSetting[] = [];
  private webhooks: Webhook[] = [];

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.users.length + 1,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  // Profile management
  async getProfile(userId: string): Promise<Profile | undefined> {
    return this.profiles.find(p => p.userId === userId);
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const newProfile: Profile = {
      id: this.generateId(),
      ...profile,
      fullName: profile.fullName ?? null,
      avatarUrl: profile.avatarUrl ?? null,
      bio: profile.bio ?? null,
      role: profile.role ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.profiles.push(newProfile);
    return newProfile;
  }

  async updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const index = this.profiles.findIndex(p => p.userId === userId);
    if (index === -1) return undefined;
    
    this.profiles[index] = { ...this.profiles[index], ...profile, updatedAt: new Date() };
    return this.profiles[index];
  }

  // Category management
  async getCategories(): Promise<Category[]> {
    return [...this.categories];
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.find(c => c.id === id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = {
      id: this.generateId(),
      ...category,
      description: category.description ?? null,
      color: category.color ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    this.categories[index] = { ...this.categories[index], ...category, updatedAt: new Date() };
    return this.categories[index];
  }

  async deleteCategory(id: string): Promise<boolean> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.categories.splice(index, 1);
    return true;
  }

  // Post management
  async getPosts(): Promise<Post[]> {
    return [...this.posts].sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getPublishedPosts(): Promise<Post[]> {
    return this.posts
      .filter(p => p.isPublished)
      .sort((a, b) => {
        const dateA = a.publishedAt || a.createdAt;
        const dateB = b.publishedAt || b.createdAt;
        return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
      });
  }

  async getPost(id: string): Promise<Post | undefined> {
    return this.posts.find(p => p.id === id);
  }

  async getPostById(id: string): Promise<Post | undefined> {
    return this.posts.find(p => p.id === id);
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    return this.posts.find(p => p.slug === slug);
  }

  async createPost(post: InsertPost): Promise<Post> {
    const newPost: Post = {
      id: this.generateId(),
      ...post,
      authorName: post.authorName || 'Admin',
      excerpt: post.excerpt ?? null,
      featuredImage: post.featuredImage ?? null,
      categoryId: post.categoryId ?? null,
      publishedAt: post.publishedAt ?? null,
      metaTitle: post.metaTitle ?? null,
      metaDescription: post.metaDescription ?? null,
      ogTitle: post.ogTitle ?? null,
      ogDescription: post.ogDescription ?? null,
      ogImage: post.ogImage ?? null,
      schemaMarkup: post.schemaMarkup ?? null,
      readTime: post.readTime ?? null,
      isFeatured: post.isFeatured ?? null,
      isPublished: post.isPublished ?? null,
      position: post.position ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.posts.push(newPost);
    return newPost;
  }

  async updatePost(id: string, post: Partial<InsertPost>): Promise<Post | undefined> {
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    this.posts[index] = { ...this.posts[index], ...post, updatedAt: new Date() };
    return this.posts[index];
  }

  async deletePost(id: string): Promise<boolean> {
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.posts.splice(index, 1);
    return true;
  }

  // Media management
  async getMedia(): Promise<Media[]> {
    return [...this.media].sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getMediaByPostId(postId: string): Promise<Media[]> {
    return this.media.filter(m => m.postId === postId);
  }

  async createMedia(mediaItem: InsertMedia): Promise<Media> {
    const newMedia: Media = {
      id: this.generateId(),
      ...mediaItem,
      postId: mediaItem.postId ?? null,
      fileSize: mediaItem.fileSize ?? null,
      altText: mediaItem.altText ?? null,
      caption: mediaItem.caption ?? null,
      positionInContent: mediaItem.positionInContent ?? null,
      createdAt: new Date(),
    };
    this.media.push(newMedia);
    return newMedia;
  }

  async deleteMedia(id: string): Promise<boolean> {
    const index = this.media.findIndex(m => m.id === id);
    if (index === -1) return false;
    
    this.media.splice(index, 1);
    return true;
  }

  // Affiliate links management
  async getAffiliateLinks(): Promise<AffiliateLink[]> {
    return [...this.affiliateLinks].sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getAffiliateLinksByPostId(postId: string): Promise<AffiliateLink[]> {
    return this.affiliateLinks.filter(l => l.postId === postId);
  }

  async createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink> {
    const newLink: AffiliateLink = {
      id: this.generateId(),
      ...link,
      description: link.description ?? null,
      postId: link.postId ?? null,
      positionInContent: link.positionInContent ?? null,
      price: link.price ?? null,
      discount: link.discount ?? null,
      ctaText: link.ctaText ?? null,
      imageUrl: link.imageUrl ?? null,
      clickCount: link.clickCount ?? null,
      createdAt: new Date(),
    };
    this.affiliateLinks.push(newLink);
    return newLink;
  }

  async updateAffiliateLink(id: string, link: Partial<InsertAffiliateLink>): Promise<AffiliateLink | undefined> {
    const index = this.affiliateLinks.findIndex(l => l.id === id);
    if (index === -1) return undefined;
    
    this.affiliateLinks[index] = { ...this.affiliateLinks[index], ...link };
    return this.affiliateLinks[index];
  }

  async deleteAffiliateLink(id: string): Promise<boolean> {
    const index = this.affiliateLinks.findIndex(l => l.id === id);
    if (index === -1) return false;
    
    this.affiliateLinks.splice(index, 1);
    return true;
  }

  // CTA management
  async getCtas(): Promise<Cta[]> {
    return [...this.ctas].sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getCtasByPostId(postId: string): Promise<Cta[]> {
    return this.ctas.filter(c => c.postId === postId);
  }

  async createCta(ctaItem: InsertCta): Promise<Cta> {
    const newCta: Cta = {
      id: this.generateId(),
      ...ctaItem,
      description: ctaItem.description ?? null,
      position: ctaItem.position ?? null,
      postId: ctaItem.postId ?? null,
      buttonUrl: ctaItem.buttonUrl ?? null,
      style: ctaItem.style ?? null,
      isActive: ctaItem.isActive ?? null,
      conversionCount: ctaItem.conversionCount ?? null,
      createdAt: new Date(),
    };
    this.ctas.push(newCta);
    return newCta;
  }

  async updateCta(id: string, ctaItem: Partial<InsertCta>): Promise<Cta | undefined> {
    const index = this.ctas.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    this.ctas[index] = { ...this.ctas[index], ...ctaItem };
    return this.ctas[index];
  }

  async deleteCta(id: string): Promise<boolean> {
    const index = this.ctas.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.ctas.splice(index, 1);
    return true;
  }

  // Analytics
  async createAnalytic(analytic: InsertAnalytics): Promise<Analytics> {
    const newAnalytic: Analytics = {
      id: this.generateId(),
      ...analytic,
      eventData: analytic.eventData ?? null,
      postId: analytic.postId ?? null,
      userAgent: analytic.userAgent ?? null,
      ipAddress: analytic.ipAddress ?? null,
      createdAt: new Date(),
    };
    this.analytics.push(newAnalytic);
    return newAnalytic;
  }

  async getAnalytics(): Promise<Analytics[]> {
    return [...this.analytics].sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getAnalyticsByPostId(postId: string): Promise<Analytics[]> {
    return this.analytics.filter(a => a.postId === postId);
  }

  // Site settings
  async getSiteSettings(): Promise<SiteSetting[]> {
    return [...this.siteSettings];
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    return this.siteSettings.find(s => s.key === key);
  }

  async setSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const existing = await this.getSiteSetting(setting.key);
    if (existing) {
      const index = this.siteSettings.findIndex(s => s.key === setting.key);
      this.siteSettings[index] = { ...this.siteSettings[index], ...setting, updatedAt: new Date() };
      return this.siteSettings[index];
    } else {
      const newSetting: SiteSetting = {
        id: this.generateId(),
        ...setting,
        value: setting.value ?? null,
        type: setting.type ?? null,
        description: setting.description ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.siteSettings.push(newSetting);
      return newSetting;
    }
  }

  // Webhooks
  async getWebhooks(): Promise<Webhook[]> {
    return [...this.webhooks].sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createWebhook(webhook: InsertWebhook): Promise<Webhook> {
    const newWebhook: Webhook = {
      id: this.generateId(),
      ...webhook,
      isActive: webhook.isActive ?? null,
      headers: webhook.headers ?? null,
      payloadTemplate: webhook.payloadTemplate ?? null,
      lastTriggeredAt: webhook.lastTriggeredAt ?? null,
      createdAt: new Date(),
    };
    this.webhooks.push(newWebhook);
    return newWebhook;
  }

  async updateWebhook(id: string, webhook: Partial<InsertWebhook>): Promise<Webhook | undefined> {
    const index = this.webhooks.findIndex(w => w.id === id);
    if (index === -1) return undefined;
    
    this.webhooks[index] = { ...this.webhooks[index], ...webhook };
    return this.webhooks[index];
  }

  async deleteWebhook(id: string): Promise<boolean> {
    const index = this.webhooks.findIndex(w => w.id === id);
    if (index === -1) return false;
    
    this.webhooks.splice(index, 1);
    return true;
  }

  // Initialize with default data
  async initialize() {
    // Create admin user first
    const adminUser = await this.createUser({
      username: 'admin',
      password: '$2b$10$T9PX5lF6SEbF5.NL7u7ZUOo04KCCbUywAE5dAdLJau7ZBs4rRYb/y' // password: 'admin123'
    });

    // Create default categories for AI theme
    const defaultCategories = [
      {
        name: 'IA Criativa',
        slug: 'ia-criativa',
        color: '#8B5CF6',
        description: 'Inteligência Artificial aplicada à criatividade'
      },
      {
        name: 'Ferramentas',
        slug: 'ferramentas',
        color: '#3B82F6',
        description: 'Ferramentas de IA para criadores'
      },
      {
        name: 'Automação',
        slug: 'automacao',
        color: '#10B981',
        description: 'Automatização com IA'
      },
      {
        name: 'Tutoriais',
        slug: 'tutoriais',
        color: '#F59E0B',
        description: 'Tutoriais passo a passo'
      }
    ];

    const categories: Category[] = [];
    for (const cat of defaultCategories) {
      const category = await this.createCategory(cat);
      categories.push(category);
    }

    // Create sample posts
    const samplePosts = [
      {
        title: 'Como a IA está Revolucionando a Criatividade',
        slug: 'ia-revolucionando-criatividade',
        content: `
# Como a IA está Revolucionando a Criatividade

A inteligência artificial está transformando a maneira como criamos, inovamos e expressamos nossa criatividade. Neste artigo, exploramos as principais tendências e ferramentas que estão moldando o futuro da criação.

## O Que Mudou?

A IA não substituiu a criatividade humana, mas sim ampliou nossas capacidades criativas de maneiras inimagináveis:

- **Geração de Conteúdo**: Ferramentas como GPT-4 e Claude ajudam na escrita criativa
- **Arte Digital**: DALL-E, Midjourney e Stable Diffusion democratizam a criação visual
- **Música**: Ferramentas de composição assistida por IA
- **Vídeo**: Edição automática e geração de conteúdo visual

## Impacto na Indústria Criativa

As indústrias criativas estão se adaptando rapidamente a essas novas tecnologias, criando novas oportunidades e desafios.

A chave está em encontrar o equilíbrio perfeito entre a eficiência da IA e a essência humana da criatividade.
        `,
        excerpt: 'Descubra como a inteligência artificial está transformando o cenário criativo e oferecendo novas possibilidades para criadores de todos os tipos.',
        featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        categoryId: categories[0].id,
        authorName: 'CriativeIA Team',
        isPublished: true,
        isFeatured: true,
        readTime: 8,
        views: 1520,
        likes: 89,
        tags: ['IA', 'Criatividade', 'Tecnologia', 'Futuro']
      },
      {
        title: 'Top 10 Ferramentas de IA para Criadores em 2024',
        slug: 'top-10-ferramentas-ia-criadores-2024',
        content: `
# Top 10 Ferramentas de IA para Criadores em 2024

O cenário de ferramentas de IA para criadores está em constante evolução. Aqui estão as 10 ferramentas mais importantes que todo criador deveria conhecer.

## 1. ChatGPT & Claude
Para escrita criativa, brainstorming e automação de conteúdo.

## 2. Midjourney
Geração de imagens artísticas de alta qualidade.

## 3. Adobe Firefly
IA integrada aos produtos Adobe para designers.

## 4. Runway ML
Edição de vídeo com IA e efeitos especiais.

## 5. Canva AI
Design gráfico simplificado com assistência de IA.

E muitas outras ferramentas revolucionárias...
        `,
        excerpt: 'Uma lista abrangente das melhores ferramentas de IA disponíveis para criadores de conteúdo, designers e artistas.',
        featuredImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800',
        categoryId: categories[1].id,
        authorName: 'CriativeIA Team',
        isPublished: true,
        isFeatured: false,
        readTime: 12,
        views: 892,
        likes: 67,
        tags: ['Ferramentas', 'IA', 'Produtividade', 'Design']
      },
      {
        title: 'Automatizando seu Fluxo Criativo com IA',
        slug: 'automatizando-fluxo-criativo-ia',
        content: `
# Automatizando seu Fluxo Criativo com IA

A automação não é o inimigo da criatividade - é seu melhor aliado. Aprenda como integrar IA em seu processo criativo para maximizar sua produtividade.

## Por Que Automatizar?

- **Foco no que importa**: Deixe tarefas repetitivas para a IA
- **Mais tempo para criação**: Automatize pesquisa e organização
- **Consistência**: Mantenha padrões de qualidade

## Estratégias de Automação

1. **Pesquisa automatizada**: Use IA para coletar referências
2. **Geração de ideias**: Brainstorming assistido
3. **Otimização de conteúdo**: SEO e adaptação automática
        `,
        excerpt: 'Descubra como automatizar partes do seu processo criativo sem perder a essência humana do seu trabalho.',
        featuredImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        categoryId: categories[2].id,
        authorName: 'CriativeIA Team',
        isPublished: true,
        isFeatured: false,
        readTime: 6,
        views: 543,
        likes: 34,
        tags: ['Automação', 'Produtividade', 'Workflow', 'IA']
      }
    ];

    for (const post of samplePosts) {
      await this.createPost(post);
    }

    console.log('✅ Dados iniciais carregados na memória!');
    console.log(`📝 ${samplePosts.length} posts criados`);
    console.log(`📁 ${categories.length} categorias criadas`);
    console.log(`👤 1 usuário admin criado`);
  }
}