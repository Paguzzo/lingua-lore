import express from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { authenticateToken, optionalAuth, type AuthenticatedRequest } from '../auth/jwt';
import { nanoid } from 'nanoid';

const router = express.Router();

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
});

const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long').optional(),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color').optional()
});

// GET /api/categories - Get all categories (public)
router.get('/', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const categories = await storage.getCategories();
    
    res.json({
      categories,
      total: categories.length
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      code: 'FETCH_ERROR'
    });
  }
});

// GET /api/categories/:id - Get category by ID (public)
router.get('/:id', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const category = await storage.getCategory(id);
    
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        code: 'CATEGORY_NOT_FOUND'
      });
    }
    
    res.json({ category });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      error: 'Failed to fetch category',
      code: 'FETCH_ERROR'
    });
  }
});

// GET /api/categories/slug/:slug - Get category by slug (public)
router.get('/slug/:slug', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { slug } = req.params;
    const category = await storage.getCategoryBySlug(slug);
    
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        code: 'CATEGORY_NOT_FOUND'
      });
    }
    
    res.json({ category });
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({
      error: 'Failed to fetch category',
      code: 'FETCH_ERROR'
    });
  }
});

// POST /api/categories - Create new category (authenticated)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const validation = createCategorySchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const { name, slug, description, color } = validation.data;
    
    // Check if slug already exists
    const existingCategory = await storage.getCategoryBySlug(slug);
    if (existingCategory) {
      return res.status(409).json({
        error: 'Category with this slug already exists',
        code: 'SLUG_EXISTS'
      });
    }

    const newCategory = await storage.createCategory({
      id: nanoid(),
      name,
      slug,
      description,
      color,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'Category created successfully',
      category: newCategory
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      error: 'Failed to create category',
      code: 'CREATE_ERROR'
    });
  }
});

// PUT /api/categories/:id - Update category (authenticated)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const validation = updateCategorySchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const updateData = validation.data;
    
    // Check if category exists
    const existingCategory = await storage.getCategory(id);
    if (!existingCategory) {
      return res.status(404).json({
        error: 'Category not found',
        code: 'CATEGORY_NOT_FOUND'
      });
    }
    
    // Check if new slug already exists (if slug is being updated)
    if (updateData.slug && updateData.slug !== existingCategory.slug) {
      const categoryWithSlug = await storage.getCategoryBySlug(updateData.slug);
      if (categoryWithSlug) {
        return res.status(409).json({
          error: 'Category with this slug already exists',
          code: 'SLUG_EXISTS'
        });
      }
    }

    const updatedCategory = await storage.updateCategory(id, {
      ...updateData,
      updatedAt: new Date()
    });

    if (!updatedCategory) {
      return res.status(404).json({
        error: 'Category not found',
        code: 'CATEGORY_NOT_FOUND'
      });
    }

    res.json({
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      error: 'Failed to update category',
      code: 'UPDATE_ERROR'
    });
  }
});

// DELETE /api/categories/:id - Delete category (authenticated)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const existingCategory = await storage.getCategory(id);
    if (!existingCategory) {
      return res.status(404).json({
        error: 'Category not found',
        code: 'CATEGORY_NOT_FOUND'
      });
    }
    
    // Check if category has posts
    const postsInCategory = await storage.getPosts({ categoryId: id, limit: 1 });
    if (postsInCategory.length > 0) {
      return res.status(409).json({
        error: 'Cannot delete category with existing posts',
        code: 'CATEGORY_HAS_POSTS'
      });
    }

    const deleted = await storage.deleteCategory(id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Category not found',
        code: 'CATEGORY_NOT_FOUND'
      });
    }

    res.json({
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      error: 'Failed to delete category',
      code: 'DELETE_ERROR'
    });
  }
});

export default router;