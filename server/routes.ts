import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertPostSchema, insertProfileSchema, insertUserSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

// Middleware for authentication
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const hashedPassword = bcrypt.hashSync(userData.password, 10);

      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(400).json({ error: "Registration failed" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", authenticateToken, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: "Failed to create category" });
    }
  });

  app.put("/api/categories/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, categoryData);

      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      res.status(400).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCategory(id);

      if (!success) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Posts routes
  app.get("/api/posts", async (req, res) => {
    try {
      const { published } = req.query;
      const posts = published === 'true'
        ? await storage.getPublishedPosts()
        : await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.getPostById(id);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.get("/api/posts/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getPostBySlug(slug);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.post("/api/posts", authenticateToken, async (req, res) => {
    try {
      const rawData = req.body;

      // Convert publishedAt string to Date if it exists
      if (rawData.publishedAt && typeof rawData.publishedAt === 'string') {
        rawData.publishedAt = new Date(rawData.publishedAt);
      }

      // Handle empty categoryId
      if (!rawData.categoryId || rawData.categoryId === '') {
        rawData.categoryId = null;
      }

      const postData = insertPostSchema.parse(rawData);
      const post = await storage.createPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(400).json({ error: "Failed to create post", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.put("/api/posts/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const rawData = req.body;

      // Convert publishedAt string to Date if it exists
      if (rawData.publishedAt && typeof rawData.publishedAt === 'string') {
        rawData.publishedAt = new Date(rawData.publishedAt);
      }

      const postData = insertPostSchema.partial().parse(rawData);
      const post = await storage.updatePost(id, postData);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(400).json({ error: "Failed to update post", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.patch("/api/posts/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const rawData = req.body;

      // Convert publishedAt string to Date if it exists
      if (rawData.publishedAt && typeof rawData.publishedAt === 'string') {
        rawData.publishedAt = new Date(rawData.publishedAt);
      }

      const postData = insertPostSchema.partial().parse(rawData);
      const post = await storage.updatePost(id, postData);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(400).json({ error: "Failed to update post", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.delete("/api/posts/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deletePost(id);

      if (!success) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // Analytics routes
  app.post("/api/analytics", async (req, res) => {
    try {
      const { eventType, eventData, postId } = req.body;
      const analytic = await storage.createAnalytic({
        eventType,
        eventData,
        postId,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      });
      res.json(analytic);
    } catch (error) {
      res.status(400).json({ error: "Failed to create analytic" });
    }
  });

  app.get("/api/analytics", authenticateToken, async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Dashboard stats route
  app.get("/api/dashboard/stats", authenticateToken, async (req, res) => {
    try {
      const [totalPosts, publishedPosts, analytics] = await Promise.all([
        storage.getPosts(),
        storage.getPublishedPosts(),
        storage.getAnalytics()
      ]);

      const pageViews = analytics.filter(a => a.eventType === 'page_view').length;

      res.json({
        totalPosts: totalPosts.length,
        publishedPosts: publishedPosts.length,
        totalViews: pageViews,
        totalUsers: 1 // Since we don't have a proper user management system yet
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}