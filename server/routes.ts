import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emailService } from "./email-service";
import { imageService } from "./image-service";
import { aiService } from "./ai-service";
import { upload } from "./upload/cloudinary";

// Import route modules
import authRoutes from "./routes/auth";
import categoriesRoutes from "./routes/categories";
import postsRoutes from "./routes/posts";
import uploadRoutes from "./routes/upload";
import aiRoutes from "./routes/ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register route modules
  app.use("/api/auth", authRoutes);
  app.use("/api/categories", categoriesRoutes);
  app.use("/api/posts", postsRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/ai", aiRoutes);

  // Note: Image upload routes are now handled by the dedicated upload router at line 21

  // Buscar imagens no Pexels
  app.get("/api/images/pexels/search", async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Query de busca é obrigatória" });
      }

      const images = await imageService.searchPexelsImages(query);
      res.json(images);
    } catch (error) {
      console.error('Erro ao buscar imagens no Pexels:', error);
      res.status(500).json({ error: "Falha ao buscar imagens no Pexels" });
    }
  });

  // Gerar imagem com OpenAI
  app.post("/api/images/generate/openai", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: "Prompt é obrigatório" });
      }

      const optimizedPrompt = imageService.optimizePrompt(prompt);
      const imageUrl = await imageService.generateImageOpenAI(optimizedPrompt);
      
      res.json({ url: imageUrl });
    } catch (error) {
      console.error('Erro ao gerar imagem com OpenAI:', error);
      res.status(500).json({ error: "Falha ao gerar imagem com OpenAI" });
    }
  });

  // Gerar imagem com Freepik
  app.post("/api/images/generate/freepik", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: "Prompt é obrigatório" });
      }

      const optimizedPrompt = imageService.optimizePrompt(prompt);
      const imageUrl = await imageService.generateImageFreepik(optimizedPrompt);
      
      res.json({ url: imageUrl });
    } catch (error) {
      console.error('Erro ao gerar imagem com Freepik:', error);
      res.status(500).json({ error: "Falha ao gerar imagem com Freepik" });
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

  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // AI routes are handled by the dedicated AI router at line 22

  // Dashboard stats route
  app.get("/api/dashboard/stats", async (req, res) => {
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

  // Analytics dashboard route
  app.get("/api/analytics/dashboard", async (req, res) => {
    try {
      const [analytics, posts] = await Promise.all([
        storage.getAnalytics(),
        storage.getPublishedPosts()
      ]);

      // Calculate total views
      const pageViews = analytics.filter(a => a.eventType === 'page_view');
      const totalViews = pageViews.length;

      // Calculate unique visitors (based on IP addresses)
      const uniqueIPs = new Set(pageViews.map(a => a.ipAddress).filter(Boolean));
      const uniqueVisitors = uniqueIPs.size;

      // Calculate average time on site (mock calculation)
      const avgTimeOnSite = '3m 42s'; // This would need proper tracking

      // Calculate bounce rate (mock calculation)
      const bounceRate = '32%'; // This would need proper session tracking

      // Get top posts by views
      const postViews = pageViews.reduce((acc, view) => {
        if (view.postId) {
          acc[view.postId] = (acc[view.postId] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const topPosts = Object.entries(postViews)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([postId, views]) => {
          const post = posts.find(p => p.id === postId);
          return {
            title: post?.title || 'Post não encontrado',
            views,
            slug: post?.slug || ''
          };
        });

      // Get views over time (last 5 days)
      const now = new Date();
      const viewsOverTime = [];
      for (let i = 4; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const dayViews = pageViews.filter(view => {
          const viewDate = new Date(view.createdAt);
          return viewDate >= dayStart && viewDate <= dayEnd;
        }).length;

        viewsOverTime.push({
          date: dayStart.toISOString().split('T')[0],
          views: dayViews
        });
      }

      res.json({
        totalViews,
        uniqueVisitors,
        avgTimeOnSite,
        bounceRate,
        topPosts,
        viewsOverTime
      });
    } catch (error) {
      console.error('Error fetching analytics dashboard:', error);
      res.status(500).json({ error: "Failed to fetch analytics dashboard" });
    }
  });

  // Newsletter Subscribers routes
  app.get("/api/subscribers", async (req, res) => {
    try {
      const subscribers = await storage.getSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  });

  app.post("/api/subscribers", async (req, res) => {
    try {
      const { email, name, source = 'newsletter' } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Check if email already exists
      const existingSubscriber = await storage.getSubscriberByEmail(email);
      if (existingSubscriber) {
        return res.status(409).json({ error: "Email already subscribed" });
      }

      const subscriber = await storage.createSubscriber({
        email,
        name,
        source,
        isActive: true,
        emailVerified: false
      });

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(email, name);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the subscription if email fails
      }

      res.json({ success: true, subscriber });
    } catch (error) {
      console.error("Error creating subscriber:", error);
      res.status(400).json({ error: "Failed to subscribe" });
    }
  });

  app.delete("/api/subscribers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteSubscriber(id);

      if (!success) {
        return res.status(404).json({ error: "Subscriber not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete subscriber" });
    }
  });

  app.patch("/api/subscribers/:id/unsubscribe", async (req, res) => {
    try {
      const { id } = req.params;
      const subscriber = await storage.updateSubscriber(id, {
        isActive: false,
        unsubscribedAt: new Date()
      });

      if (!subscriber) {
        return res.status(404).json({ error: "Subscriber not found" });
      }

      res.json({ success: true, subscriber });
    } catch (error) {
      res.status(500).json({ error: "Failed to unsubscribe" });
    }
  });

  // Test email configuration
  app.post('/api/subscribers/test-email', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
      }
      
      if (!emailService.isConfigured()) {
        return res.status(400).json({ error: 'Serviço de email não está configurado' });
      }
      
      await emailService.sendTestEmail(email);
      
      res.json({ success: true, message: 'Email de teste enviado com sucesso' });
    } catch (error) {
      console.error('Error sending test email:', error);
      res.status(500).json({ error: 'Erro ao enviar email de teste: ' + error.message });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}