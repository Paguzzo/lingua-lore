-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"bio" text,
	"avatar" varchar(255),
	"social_links" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS "categories" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"color" varchar(7) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);

-- Create posts table
CREATE TABLE IF NOT EXISTS "posts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text NOT NULL,
	"featured_image" varchar(255),
	"is_published" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"category_id" varchar(255) NOT NULL,
	"author_id" varchar(255) NOT NULL,
	"reading_time" integer DEFAULT 0 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);

-- Create media table
CREATE TABLE IF NOT EXISTS "media" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"post_id" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"alt" varchar(255) NOT NULL,
	"caption" text,
	"type" varchar(10) NOT NULL,
	"position_in_content" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Create affiliate_links table
CREATE TABLE IF NOT EXISTS "affiliate_links" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"post_id" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"text" varchar(255) NOT NULL,
	"description" text,
	"position_in_content" integer NOT NULL,
	"click_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Create ctas table
CREATE TABLE IF NOT EXISTS "ctas" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"post_id" varchar(255) NOT NULL,
	"text" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"style" varchar(20) NOT NULL,
	"position_in_content" integer NOT NULL,
	"click_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS "analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"post_id" varchar(255),
	"event" varchar(255) NOT NULL,
	"data" jsonb,
	"user_agent" text,
	"ip_address" varchar(45),
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS "site_settings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text NOT NULL,
	"type" varchar(20) DEFAULT 'string' NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_key_unique" UNIQUE("key")
);

-- Create webhooks table
CREATE TABLE IF NOT EXISTS "webhooks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"url" varchar(255) NOT NULL,
	"events" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"secret" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS "subscribers" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"source" varchar(255) DEFAULT 'website' NOT NULL,
	"subscribed_at" timestamp DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp,
	"email_verified" boolean DEFAULT false NOT NULL,
	"verification_token" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);

-- Add foreign key constraints
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE restrict ON UPDATE cascade;
ALTER TABLE "media" ADD CONSTRAINT "media_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE cascade ON UPDATE cascade;
ALTER TABLE "affiliate_links" ADD CONSTRAINT "affiliate_links_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE cascade ON UPDATE cascade;
ALTER TABLE "ctas" ADD CONSTRAINT "ctas_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE cascade ON UPDATE cascade;
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE cascade ON UPDATE cascade;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_posts_category_id" ON "posts" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_posts_author_id" ON "posts" ("author_id");
CREATE INDEX IF NOT EXISTS "idx_posts_published" ON "posts" ("is_published");
CREATE INDEX IF NOT EXISTS "idx_posts_featured" ON "posts" ("is_featured");
CREATE INDEX IF NOT EXISTS "idx_posts_created_at" ON "posts" ("created_at");
CREATE INDEX IF NOT EXISTS "idx_media_post_id" ON "media" ("post_id");
CREATE INDEX IF NOT EXISTS "idx_affiliate_links_post_id" ON "affiliate_links" ("post_id");
CREATE INDEX IF NOT EXISTS "idx_ctas_post_id" ON "ctas" ("post_id");
CREATE INDEX IF NOT EXISTS "idx_analytics_post_id" ON "analytics" ("post_id");
CREATE INDEX IF NOT EXISTS "idx_analytics_event" ON "analytics" ("event");
CREATE INDEX IF NOT EXISTS "idx_analytics_created_at" ON "analytics" ("created_at");