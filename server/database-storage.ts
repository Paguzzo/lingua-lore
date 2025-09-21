import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc, and, like, or } from "drizzle-orm";
import bcrypt from 'bcryptjs';
import {
  users, posts, categories, profiles, media, affiliateLinks, ctas, analytics, siteSettings, webhooks, subscribers,
  type User, type InsertUser, type Post, type InsertPost, type Category, type InsertCategory,
  type Profile, type InsertProfile, type Media, type InsertMedia, type AffiliateLink, type InsertAffiliateLink,
  type Cta, type InsertCta, type Analytics, type InsertAnalytics, type SiteSetting, type InsertSiteSetting,
  type Webhook, type InsertWebhook
} from "@shared/schema";

// Subscriber types
export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  isActive: boolean;
  source: string;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  emailVerified: boolean;
  verificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertSubscriber {
  email: string;
  name?: string;
  isActive?: boolean;
  source?: string;
  emailVerified?: boolean;
  verificationToken?: string;
}

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Profile management
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, profile: Partial<Profile>): Promise<Profile | undefined>;

  // Category management
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Post management
  getPosts(options?: { limit?: number; offset?: number; published?: boolean; categoryId?: string; featured?: boolean }): Promise<Post[]>;
  getPost(id: string): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<Post>): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;
  searchPosts(query: string): Promise<Post[]>;

  // Media management
  getMedia(options?: string | { limit?: number; offset?: number }): Promise<Media[] | Media | undefined>;
  getMediaByPostId(postId: string): Promise<Media[]>;
  createMedia(media: InsertMedia): Promise<Media>;
  deleteMedia(id: string): Promise<boolean>;

  // Affiliate Links management
  getAffiliateLinks(postId?: string): Promise<AffiliateLink[]>;
  createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink>;
  updateAffiliateLink(id: string, link: Partial<AffiliateLink>): Promise<AffiliateLink | undefined>;
  deleteAffiliateLink(id: string): Promise<boolean>;

  // CTA management
  getCtas(postId?: string): Promise<Cta[]>;
  createCta(cta: InsertCta): Promise<Cta>;
  updateCta(id: string, cta: Partial<Cta>): Promise<Cta | undefined>;
  deleteCta(id: string): Promise<boolean>;

  // Analytics management
  getAnalytics(postId?: string): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;

  // Site Settings management
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  setSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;

  // Webhook management
  getWebhooks(): Promise<Webhook[]>;
  createWebhook(webhook: InsertWebhook): Promise<Webhook>;
  deleteWebhook(id: string): Promise<boolean>;

  // Subscriber management
  getSubscribers(): Promise<Subscriber[]>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  updateSubscriber(id: string, subscriber: Partial<Subscriber>): Promise<Subscriber | undefined>;
  deleteSubscriber(id: string): Promise<boolean>;

  // Initialization
  initialize(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  private db: any;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required for DatabaseStorage');
    }
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  async initialize(): Promise<void> {
    try {
      // Criar categorias padrão se não existirem
      const existingCategories = await this.getCategories();
      if (existingCategories.length === 0) {
        const defaultCategories = [
          { name: 'IA Criativa', slug: 'ia-criativa', description: 'Conteúdo sobre inteligência artificial criativa', color: '#8B5CF6' },
          { name: 'Ferramentas', slug: 'ferramentas', description: 'Ferramentas e recursos úteis', color: '#3B82F6' },
          { name: 'Automação', slug: 'automacao', description: 'Automação e produtividade', color: '#10B981' },
          { name: 'Tutoriais', slug: 'tutoriais', description: 'Tutoriais e guias práticos', color: '#F59E0B' },
          { name: 'Tecnologia', slug: 'tecnologia', description: 'Novidades em tecnologia', color: '#EF4444' },
          { name: 'Marketing Digital', slug: 'marketing-digital', description: 'Estratégias de marketing digital', color: '#8B5CF6' }
        ];

        for (const category of defaultCategories) {
          await this.createCategory(category);
        }
        console.log('✅ Categorias padrão criadas');
      }

      // Criar usuário admin se não existir
      const adminUser = await this.getUserByUsername('compg.oficial@gmail.com');
      if (!adminUser) {
        await this.createUser({
          username: 'compg.oficial@gmail.com',
          password: bcrypt.hashSync('Jt@917705', 10)
        });
        console.log('✅ Usuário administrador criado');
      }

      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing database:', error);
      throw error;
    }
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  // Profile management
  async getProfile(userId: string): Promise<Profile | undefined> {
    const result = await this.db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    return result[0];
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const result = await this.db.insert(profiles).values(profile).returning();
    return result[0];
  }

  async updateProfile(userId: string, profile: Partial<Profile>): Promise<Profile | undefined> {
    const result = await this.db.update(profiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();
    return result[0];
  }

  // Category management
  async getCategories(): Promise<Category[]> {
    return await this.db.select().from(categories).orderBy(categories.name);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const result = await this.db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0];
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await this.db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await this.db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category | undefined> {
    const result = await this.db.update(categories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.db.delete(categories).where(eq(categories.id, id));
    return result.rowCount > 0;
  }

  // Post management
  async getPosts(options: { limit?: number; offset?: number; published?: boolean; categoryId?: string; featured?: boolean } = {}): Promise<Post[]> {
    let query = this.db.select().from(posts);
    
    const conditions = [];
    if (options.published !== undefined) {
      conditions.push(eq(posts.isPublished, options.published));
    }
    if (options.categoryId) {
      conditions.push(eq(posts.categoryId, options.categoryId));
    }
    if (options.featured !== undefined) {
      conditions.push(eq(posts.isFeatured, options.featured));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(posts.createdAt));
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.offset(options.offset);
    }
    
    return await query;
  }

  async getPost(id: string): Promise<Post | undefined> {
    const result = await this.db.select().from(posts).where(eq(posts.id, id)).limit(1);
    return result[0];
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const result = await this.db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
    return result[0];
  }

  async createPost(post: InsertPost): Promise<Post> {
    const result = await this.db.insert(posts).values(post).returning();
    return result[0];
  }

  async updatePost(id: string, post: Partial<Post>): Promise<Post | undefined> {
    const result = await this.db.update(posts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return result[0];
  }

  async deletePost(id: string): Promise<boolean> {
    const result = await this.db.delete(posts).where(eq(posts.id, id));
    return result.rowCount > 0;
  }

  async searchPosts(query: string): Promise<Post[]> {
    return await this.db.select().from(posts)
      .where(
        and(
          eq(posts.isPublished, true),
          or(
            like(posts.title, `%${query}%`),
            like(posts.content, `%${query}%`),
            like(posts.excerpt, `%${query}%`)
          )
        )
      )
      .orderBy(desc(posts.createdAt));
  }

  // Media management
  async getMedia(options?: string | { limit?: number; offset?: number }): Promise<Media[] | Media | undefined> {
    // If string is passed, treat as ID lookup
    if (typeof options === 'string') {
      const result = await this.db.select().from(media).where(eq(media.id, options)).limit(1);
      return result[0];
    }
    
    // If object is passed, treat as pagination options
    let query = this.db.select().from(media);
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.offset(options.offset);
    }
    
    return await query.orderBy(desc(media.createdAt));
  }
  
  async getMediaByPostId(postId: string): Promise<Media[]> {
    return await this.db.select().from(media)
      .where(eq(media.postId, postId))
      .orderBy(media.positionInContent);
  }

  async createMedia(mediaData: InsertMedia): Promise<Media> {
    const result = await this.db.insert(media).values(mediaData).returning();
    return result[0];
  }

  async deleteMedia(id: string): Promise<boolean> {
    const result = await this.db.delete(media).where(eq(media.id, id));
    return result.rowCount > 0;
  }

  // Affiliate Links management
  async getAffiliateLinks(postId?: string): Promise<AffiliateLink[]> {
    let query = this.db.select().from(affiliateLinks);
    if (postId) {
      query = query.where(eq(affiliateLinks.postId, postId));
    }
    return await query.orderBy(affiliateLinks.positionInContent);
  }

  async createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink> {
    const result = await this.db.insert(affiliateLinks).values(link).returning();
    return result[0];
  }

  async updateAffiliateLink(id: string, link: Partial<AffiliateLink>): Promise<AffiliateLink | undefined> {
    const result = await this.db.update(affiliateLinks)
      .set(link)
      .where(eq(affiliateLinks.id, id))
      .returning();
    return result[0];
  }

  async deleteAffiliateLink(id: string): Promise<boolean> {
    const result = await this.db.delete(affiliateLinks).where(eq(affiliateLinks.id, id));
    return result.rowCount > 0;
  }

  // CTA management
  async getCtas(postId?: string): Promise<Cta[]> {
    let query = this.db.select().from(ctas);
    if (postId) {
      query = query.where(eq(ctas.postId, postId));
    }
    return await query.orderBy(ctas.positionInContent);
  }

  async createCta(cta: InsertCta): Promise<Cta> {
    const result = await this.db.insert(ctas).values(cta).returning();
    return result[0];
  }

  async updateCta(id: string, cta: Partial<Cta>): Promise<Cta | undefined> {
    const result = await this.db.update(ctas)
      .set(cta)
      .where(eq(ctas.id, id))
      .returning();
    return result[0];
  }

  async deleteCta(id: string): Promise<boolean> {
    const result = await this.db.delete(ctas).where(eq(ctas.id, id));
    return result.rowCount > 0;
  }

  // Analytics management
  async getAnalytics(postId?: string): Promise<Analytics[]> {
    let query = this.db.select().from(analytics);
    if (postId) {
      query = query.where(eq(analytics.postId, postId));
    }
    return await query.orderBy(desc(analytics.createdAt));
  }

  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const result = await this.db.insert(analytics).values(analyticsData).returning();
    return result[0];
  }

  // Site Settings management
  async getSiteSettings(): Promise<SiteSetting[]> {
    return await this.db.select().from(siteSettings);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const result = await this.db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
    return result[0];
  }

  async setSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const existing = await this.getSiteSetting(setting.key);
    if (existing) {
      const result = await this.db.update(siteSettings)
        .set({ value: setting.value, updatedAt: new Date() })
        .where(eq(siteSettings.key, setting.key))
        .returning();
      return result[0];
    } else {
      const result = await this.db.insert(siteSettings).values(setting).returning();
      return result[0];
    }
  }

  // Webhook management
  async getWebhooks(): Promise<Webhook[]> {
    return await this.db.select().from(webhooks);
  }

  async createWebhook(webhook: InsertWebhook): Promise<Webhook> {
    const result = await this.db.insert(webhooks).values(webhook).returning();
    return result[0];
  }

  async deleteWebhook(id: string): Promise<boolean> {
    const result = await this.db.delete(webhooks).where(eq(webhooks.id, id));
    return result.rowCount > 0;
  }

  // Subscriber management
  async getSubscribers(): Promise<Subscriber[]> {
    return await this.db.select().from(subscribers);
  }

  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const result = await this.db.insert(subscribers).values({
      ...subscriber,
      id: crypto.randomUUID(),
      isActive: subscriber.isActive ?? true,
      source: subscriber.source ?? 'website',
      subscribedAt: new Date(),
      emailVerified: subscriber.emailVerified ?? false,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return result[0];
  }

  async updateSubscriber(id: string, subscriber: Partial<Subscriber>): Promise<Subscriber | undefined> {
    const result = await this.db.update(subscribers)
      .set({ ...subscriber, updatedAt: new Date() })
      .where(eq(subscribers.id, id))
      .returning();
    return result[0];
  }

  async deleteSubscriber(id: string): Promise<boolean> {
    const result = await this.db.delete(subscribers).where(eq(subscribers.id, id));
    return result.rowCount > 0;
  }
}