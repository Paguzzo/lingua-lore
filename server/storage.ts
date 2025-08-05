import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc, and } from "drizzle-orm";
import {
  users, posts, categories, profiles, media, affiliateLinks, ctas, analytics, siteSettings, webhooks,
  type User, type InsertUser, type Post, type InsertPost, type Category, type InsertCategory,
  type Profile, type InsertProfile, type Media, type InsertMedia, type AffiliateLink, type InsertAffiliateLink,
  type Cta, type InsertCta, type Analytics, type InsertAnalytics, type SiteSetting, type InsertSiteSetting,
  type Webhook, type InsertWebhook
} from "@shared/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Profile management
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;

  // Category management
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Post management
  getPosts(): Promise<Post[]>;
  getPublishedPosts(): Promise<Post[]>;
  getPost(id: string): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;

  // Media management
  getMedia(): Promise<Media[]>;
  getMediaByPostId(postId: string): Promise<Media[]>;
  createMedia(media: InsertMedia): Promise<Media>;
  deleteMedia(id: string): Promise<boolean>;

  // Affiliate links management
  getAffiliateLinks(): Promise<AffiliateLink[]>;
  getAffiliateLinksByPostId(postId: string): Promise<AffiliateLink[]>;
  createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink>;
  updateAffiliateLink(id: string, link: Partial<InsertAffiliateLink>): Promise<AffiliateLink | undefined>;
  deleteAffiliateLink(id: string): Promise<boolean>;

  // CTA management
  getCtas(): Promise<Cta[]>;
  getCtasByPostId(postId: string): Promise<Cta[]>;
  createCta(cta: InsertCta): Promise<Cta>;
  updateCta(id: string, cta: Partial<InsertCta>): Promise<Cta | undefined>;
  deleteCta(id: string): Promise<boolean>;

  // Analytics
  createAnalytic(analytic: InsertAnalytics): Promise<Analytics>;
  getAnalytics(): Promise<Analytics[]>;
  getAnalyticsByPostId(postId: string): Promise<Analytics[]>;

  // Site settings
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  setSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;

  // Webhooks
  getWebhooks(): Promise<Webhook[]>;
  createWebhook(webhook: InsertWebhook): Promise<Webhook>;
  updateWebhook(id: string, webhook: Partial<InsertWebhook>): Promise<Webhook | undefined>;
  deleteWebhook(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Profile management
  async getProfile(userId: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    return result[0];
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const result = await db.insert(profiles).values(profile).returning();
    return result[0];
  }

  async updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const result = await db.update(profiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();
    return result[0];
  }

  // Category management
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const result = await db.update(categories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount > 0;
  }

  // Post management
  async getPosts(): Promise<Post[]> {
    return await db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async getPublishedPosts(): Promise<Post[]> {
    return await db.select().from(posts)
      .where(eq(posts.isPublished, true))
      .orderBy(desc(posts.publishedAt));
  }

  async getPost(id: string): Promise<Post | undefined> {
    const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    return result[0];
  }

  async getPostById(id: string): Promise<Post | undefined> {
    const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    return result[0];
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
    return result[0];
  }

  async createPost(post: InsertPost): Promise<Post> {
    const result = await db.insert(posts).values(post).returning();
    return result[0];
  }

  async updatePost(id: string, post: Partial<InsertPost>): Promise<Post | undefined> {
    const result = await db.update(posts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return result[0];
  }

  async deletePost(id: string): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id));
    return result.rowCount > 0;
  }

  async deletePost(id: string): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id));
    return result.rowCount > 0;
  }

  // Media management
  async getMedia(): Promise<Media[]> {
    return await db.select().from(media).orderBy(desc(media.createdAt));
  }

  async getMediaByPostId(postId: string): Promise<Media[]> {
    return await db.select().from(media).where(eq(media.postId, postId));
  }

  async createMedia(mediaItem: InsertMedia): Promise<Media> {
    const result = await db.insert(media).values(mediaItem).returning();
    return result[0];
  }

  async deleteMedia(id: string): Promise<boolean> {
    const result = await db.delete(media).where(eq(media.id, id));
    return result.rowCount > 0;
  }

  // Affiliate links management
  async getAffiliateLinks(): Promise<AffiliateLink[]> {
    return await db.select().from(affiliateLinks).orderBy(desc(affiliateLinks.createdAt));
  }

  async getAffiliateLinksByPostId(postId: string): Promise<AffiliateLink[]> {
    return await db.select().from(affiliateLinks).where(eq(affiliateLinks.postId, postId));
  }

  async createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink> {
    const result = await db.insert(affiliateLinks).values(link).returning();
    return result[0];
  }

  async updateAffiliateLink(id: string, link: Partial<InsertAffiliateLink>): Promise<AffiliateLink | undefined> {
    const result = await db.update(affiliateLinks)
      .set(link)
      .where(eq(affiliateLinks.id, id))
      .returning();
    return result[0];
  }

  async deleteAffiliateLink(id: string): Promise<boolean> {
    const result = await db.delete(affiliateLinks).where(eq(affiliateLinks.id, id));
    return result.rowCount > 0;
  }

  // CTA management
  async getCtas(): Promise<Cta[]> {
    return await db.select().from(ctas).orderBy(desc(ctas.createdAt));
  }

  async getCtasByPostId(postId: string): Promise<Cta[]> {
    return await db.select().from(ctas).where(eq(ctas.postId, postId));
  }

  async createCta(ctaItem: InsertCta): Promise<Cta> {
    const result = await db.insert(ctas).values(ctaItem).returning();
    return result[0];
  }

  async updateCta(id: string, ctaItem: Partial<InsertCta>): Promise<Cta | undefined> {
    const result = await db.update(ctas)
      .set(ctaItem)
      .where(eq(ctas.id, id))
      .returning();
    return result[0];
  }

  async deleteCta(id: string): Promise<boolean> {
    const result = await db.delete(ctas).where(eq(ctas.id, id));
    return result.rowCount > 0;
  }

  // Analytics
  async createAnalytic(analytic: InsertAnalytics): Promise<Analytics> {
    const result = await db.insert(analytics).values(analytic).returning();
    return result[0];
  }

  async getAnalytics(): Promise<Analytics[]> {
    return await db.select().from(analytics).orderBy(desc(analytics.createdAt));
  }

  async getAnalyticsByPostId(postId: string): Promise<Analytics[]> {
    return await db.select().from(analytics).where(eq(analytics.postId, postId));
  }

  // Site settings
  async getSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings).orderBy(siteSettings.key);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
    return result[0];
  }

  async setSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const existing = await this.getSiteSetting(setting.key);
    if (existing) {
      const result = await db.update(siteSettings)
        .set({ ...setting, updatedAt: new Date() })
        .where(eq(siteSettings.key, setting.key))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(siteSettings).values(setting).returning();
      return result[0];
    }
  }

  // Webhooks
  async getWebhooks(): Promise<Webhook[]> {
    return await db.select().from(webhooks).orderBy(desc(webhooks.createdAt));
  }

  async createWebhook(webhook: InsertWebhook): Promise<Webhook> {
    const result = await db.insert(webhooks).values(webhook).returning();
    return result[0];
  }

  async updateWebhook(id: string, webhook: Partial<InsertWebhook>): Promise<Webhook | undefined> {
    const result = await db.update(webhooks)
      .set(webhook)
      .where(eq(webhooks.id, id))
      .returning();
    return result[0];
  }

  async deleteWebhook(id: string): Promise<boolean> {
    const result = await db.delete(webhooks).where(eq(webhooks.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();