import express from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { authenticateToken, optionalAuth, type AuthenticatedRequest } from '../auth/jwt';
import { nanoid } from 'nanoid';

const router = express.Router();

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove multiple hyphens
}

// Validation schemas - SIMPLIFICADO para evitar erro 400
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  videoUrl: z.string().optional(),
  categoryId: z.string().optional(),
  isPublished: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  position: z.string().optional(),
  readTime: z.number().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  authorName: z.string().optional(),
  publishedAt: z.string().optional()
}).passthrough(); // Permite campos extras sem validação

const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long').optional(),
  slug: z.string().optional(),
  content: z.string().min(1, 'Content is required').optional(),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt too long').optional(),
  featuredImage: z.string().optional().refine(val => !val || val === "" || z.string().url().safeParse(val).success, {
    message: "Must be a valid URL or empty"
  }),
  videoUrl: z.string().optional().refine(val => !val || val === "" || z.string().url().safeParse(val).success, {
    message: "Must be a valid URL or empty"
  }),
  categoryId: z.string().min(1, 'Category is required').optional(),
  authorName: z.string().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  position: z.string().optional(),
  readTime: z.number().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  publishedAt: z.string().datetime().optional().or(z.date().optional())
});

const querySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  published: z.string().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined),
  featured: z.string().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined),
  categoryId: z.string().optional(),
  search: z.string().optional()
});

// GET /api/posts - Get all posts with pagination and filters
router.get('/', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const validation = querySchema.safeParse(req.query);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: validation.error.errors
      });
    }

    const { page, limit, published, featured, categoryId, search } = validation.data;
    const offset = (page - 1) * limit;

    let posts;
    
    if (search) {
      posts = await storage.searchPosts(search);
      // Apply additional filters to search results
      posts = posts.filter(post => {
        if (published !== undefined && post.isPublished !== published) return false;
        if (featured !== undefined && post.isFeatured !== featured) return false;
        if (categoryId && post.categoryId !== categoryId) return false;
        return true;
      });
      // Apply pagination to filtered results
      posts = posts.slice(offset, offset + limit);
    } else {
      posts = await storage.getPosts({
        limit,
        offset,
        published,
        featured,
        categoryId
      });
    }

    // Get categories for each post
    const postsWithCategories = await Promise.all(
      posts.map(async (post) => {
        const category = await storage.getCategory(post.categoryId);
        return {
          ...post,
          category
        };
      })
    );

    res.json({
      posts: postsWithCategories,
      pagination: {
        page,
        limit,
        total: posts.length
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      error: 'Failed to fetch posts',
      code: 'FETCH_ERROR'
    });
  }
});

// GET /api/posts/:id - Get post by ID
router.get('/:id', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const post = await storage.getPost(id);
    
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    // Get category
    const category = await storage.getCategory(post.categoryId);
    
    // Get related media, affiliate links, and CTAs
    const [media, affiliateLinks, ctas] = await Promise.all([
      storage.getMedia(id),
      storage.getAffiliateLinks(id),
      storage.getCtas(id)
    ]);
    
    res.json({
      post: {
        ...post,
        category,
        media,
        affiliateLinks,
        ctas
      }
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      error: 'Failed to fetch post',
      code: 'FETCH_ERROR'
    });
  }
});

// GET /api/posts/slug/:slug - Get post by slug
router.get('/slug/:slug', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { slug } = req.params;
    const post = await storage.getPostBySlug(slug);
    
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    // Increment view count
    await storage.updatePost(post.id, {
      viewCount: post.viewCount + 1
    });

    // Get category
    const category = await storage.getCategory(post.categoryId);
    
    // Get related media, affiliate links, and CTAs
    const [media, affiliateLinks, ctas] = await Promise.all([
      storage.getMedia(post.id),
      storage.getAffiliateLinks(post.id),
      storage.getCtas(post.id)
    ]);
    
    res.json({
      post: {
        ...post,
        viewCount: post.viewCount + 1,
        category,
        media,
        affiliateLinks,
        ctas
      }
    });
  } catch (error) {
    console.error('Get post by slug error:', error);
    res.status(500).json({
      error: 'Failed to fetch post',
      code: 'FETCH_ERROR'
    });
  }
});

// POST /api/posts - Create new post (authenticated)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    console.log('📝 Dados recebidos para novo post:', JSON.stringify(req.body, null, 2));
    
    const validation = createPostSchema.safeParse(req.body);
    
    if (!validation.success) {
      console.error('❌ Erro de validação do post:', validation.error.errors);
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const { 
      title, 
      slug: providedSlug, 
      content, 
      excerpt, 
      featuredImage, 
      videoUrl,
      categoryId, 
      isPublished, 
      isFeatured, 
      position,
      readTime,
      metaTitle,
      metaDescription,
      ogTitle,
      ogDescription,
      ogImage,
      publishedAt 
    } = validation.data;
    
    // Generate slug if not provided
    const slug = providedSlug || generateSlug(title);
    
    // Check if slug already exists
    const existingPost = await storage.getPostBySlug(slug);
    if (existingPost) {
      return res.status(409).json({
        error: 'Post with this slug already exists',
        code: 'SLUG_EXISTS'
      });
    }

    // Verify category exists (if provided) - com fallback para primeira categoria
    let category = null;
    let finalCategoryId = categoryId;
    
    if (categoryId) {
      category = await storage.getCategory(categoryId);
      if (!category) {
        console.warn(`⚠️ Categoria não encontrada: ${categoryId}, usando primeira categoria disponível`);
        
        // Buscar primeira categoria disponível como fallback
        const allCategories = await storage.getCategories();
        if (allCategories && allCategories.length > 0) {
          category = allCategories[0];
          finalCategoryId = category.id;
          console.log(`📁 Usando categoria fallback: ${category.name} (${category.id})`);
        } else {
          finalCategoryId = null; // Sem categoria
          console.log('📁 Nenhuma categoria disponível, post será criado sem categoria');
        }
      }
    }

    // Calculate reading time
    const finalReadTime = readTime || calculateReadingTime(content);
    
    console.log(`📊 Calculado tempo de leitura: ${finalReadTime} minutos`);

    // Valores seguros para todos os campos
    const postData = {
      id: nanoid(),
      title: title,
      slug: slug,
      content: content,
      excerpt: excerpt || '',
      featuredImage: featuredImage || '',
      videoUrl: videoUrl || '',
      categoryId: finalCategoryId || null,
      authorName: req.user?.username || 'Admin',
      isPublished: Boolean(isPublished),
      isFeatured: Boolean(isFeatured),
      position: position || 'recent',
      readTime: finalReadTime,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt || '',
      ogTitle: ogTitle || title,
      ogDescription: ogDescription || excerpt || '',
      ogImage: ogImage || featuredImage || '',
      publishedAt: (isPublished && !publishedAt) ? new Date() : (publishedAt ? new Date(publishedAt) : null),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('📝 Dados finais do post:', JSON.stringify(postData, null, 2));
    
    const newPost = await storage.createPost(postData);
    
    console.log('✅ Post criado com sucesso:', newPost.title);

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        ...newPost,
        category
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      error: 'Failed to create post',
      code: 'CREATE_ERROR'
    });
  }
});

// PUT /api/posts/:id - Update post (authenticated)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    console.log('📝 Dados recebidos para atualização:', JSON.stringify(req.body, null, 2));

    const validation = updatePostSchema.safeParse(req.body);

    if (!validation.success) {
      console.log('❌ Erro de validação:', validation.error.errors);
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const updateData = validation.data;
    
    // Check if post exists
    const existingPost = await storage.getPost(id);
    if (!existingPost) {
      return res.status(404).json({
        error: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }
    
    // Generate slug if title is being updated and no slug provided
    if (updateData.title && !updateData.slug) {
      updateData.slug = generateSlug(updateData.title);
    }
    
    // Check if new slug already exists (if slug is being updated)
    if (updateData.slug && updateData.slug !== existingPost.slug) {
      const postWithSlug = await storage.getPostBySlug(updateData.slug);
      if (postWithSlug) {
        return res.status(409).json({
          error: 'Post with this slug already exists',
          code: 'SLUG_EXISTS'
        });
      }
    }

    // Verify category exists if being updated
    if (updateData.categoryId) {
      const category = await storage.getCategory(updateData.categoryId);
      if (!category) {
        return res.status(400).json({
          error: 'Category not found',
          code: 'CATEGORY_NOT_FOUND'
        });
      }
    }

    // Recalculate reading time if content is being updated
    if (updateData.content) {
      updateData.readingTime = calculateReadingTime(updateData.content);
    }

    // Set publishedAt if publishing for the first time
    if (updateData.isPublished && !existingPost.isPublished && !updateData.publishedAt) {
      updateData.publishedAt = new Date().toISOString();
    }

    const updatedPost = await storage.updatePost(id, {
      ...updateData,
      publishedAt: updateData.publishedAt ? new Date(updateData.publishedAt) : undefined,
      updatedAt: new Date()
    });

    if (!updatedPost) {
      return res.status(404).json({
        error: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    // Get category for response
    const category = await storage.getCategory(updatedPost.categoryId);

    res.json({
      message: 'Post updated successfully',
      post: {
        ...updatedPost,
        category
      }
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      error: 'Failed to update post',
      code: 'UPDATE_ERROR'
    });
  }
});

// DELETE /api/posts/:id - Delete post (authenticated)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    
    // Check if post exists
    const existingPost = await storage.getPost(id);
    if (!existingPost) {
      return res.status(404).json({
        error: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    const deleted = await storage.deletePost(id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    res.json({
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      error: 'Failed to delete post',
      code: 'DELETE_ERROR'
    });
  }
});

export default router;