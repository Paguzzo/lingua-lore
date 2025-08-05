import { pgTable, text, serial, integer, boolean, uuid, timestamp, jsonb, inet, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enum for user roles
export const appRoleEnum = pgEnum("app_role", ["admin", "editor", "author"]);

// Users table (for basic authentication)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Profiles table
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  role: appRoleEnum("role").default("author"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  color: text("color"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Posts table
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  categoryId: uuid("category_id"),
  authorName: text("author_name").notNull().default("Admin"),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  readTime: integer("read_time").default(5),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  schemaMarkup: jsonb("schema_markup"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Media table
export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  altText: text("alt_text"),
  caption: text("caption"),
  positionInContent: integer("position_in_content"),
  postId: uuid("post_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Affiliate Links table
export const affiliateLinks = pgTable("affiliate_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  price: text("price"),
  discount: text("discount"),
  ctaText: text("cta_text"),
  imageUrl: text("image_url"),
  positionInContent: integer("position_in_content"),
  clickCount: integer("click_count").default(0),
  postId: uuid("post_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// CTAs table
export const ctas = pgTable("ctas", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  buttonText: text("button_text").notNull(),
  buttonUrl: text("button_url"),
  type: text("type").notNull(),
  style: text("style"),
  position: text("position"),
  isActive: boolean("is_active").default(true),
  conversionCount: integer("conversion_count").default(0),
  postId: uuid("post_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Analytics table
export const analytics = pgTable("analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventType: text("event_type").notNull(),
  eventData: jsonb("event_data"),
  postId: uuid("post_id"),
  userAgent: text("user_agent"),
  ipAddress: inet("ip_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Site Settings table
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: text("value"),
  type: text("type"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Webhooks table
export const webhooks = pgTable("webhooks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  eventType: text("event_type").notNull(),
  headers: jsonb("headers"),
  payloadTemplate: jsonb("payload_template"),
  isActive: boolean("is_active").default(true),
  lastTriggeredAt: timestamp("last_triggered_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Relations
export const postsRelations = relations(posts, ({ one, many }) => ({
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  media: many(media),
  affiliateLinks: many(affiliateLinks),
  ctas: many(ctas),
  analytics: many(analytics),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  post: one(posts, {
    fields: [media.postId],
    references: [posts.id],
  }),
}));

export const affiliateLinksRelations = relations(affiliateLinks, ({ one }) => ({
  post: one(posts, {
    fields: [affiliateLinks.postId],
    references: [posts.id],
  }),
}));

export const ctasRelations = relations(ctas, ({ one }) => ({
  post: one(posts, {
    fields: [ctas.postId],
    references: [posts.id],
  }),
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  post: one(posts, {
    fields: [analytics.postId],
    references: [posts.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMediaSchema = createInsertSchema(media).omit({ id: true, createdAt: true });
export const insertAffiliateLinkSchema = createInsertSchema(affiliateLinks).omit({ id: true, createdAt: true });
export const insertCtaSchema = createInsertSchema(ctas).omit({ id: true, createdAt: true });
export const insertAnalyticsSchema = createInsertSchema(analytics).omit({ id: true, createdAt: true });
export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertWebhookSchema = createInsertSchema(webhooks).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;
export type InsertAffiliateLink = z.infer<typeof insertAffiliateLinkSchema>;
export type AffiliateLink = typeof affiliateLinks.$inferSelect;
export type InsertCta = z.infer<typeof insertCtaSchema>;
export type Cta = typeof ctas.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertWebhook = z.infer<typeof insertWebhookSchema>;
export type Webhook = typeof webhooks.$inferSelect;
