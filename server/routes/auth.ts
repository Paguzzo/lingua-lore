import express from 'express';
import { z } from 'zod';
import { loginUser, registerUser, refreshToken, authenticateToken, type AuthenticatedRequest } from '../auth/jwt';

const router = express.Router();

// Validation schemas
const loginSchema = z.object({
  username: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
  username: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const refreshSchema = z.object({
  token: z.string().min(1, 'Token is required')
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const { username, password } = validation.data;
    const result = await loginUser(username, password);

    if (!result) {
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    res.json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    console.error('Login route error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const { username, password } = validation.data;
    const result = await registerUser(username, password);

    if (!result) {
      return res.status(409).json({
        error: 'User already exists',
        code: 'USER_EXISTS'
      });
    }

    res.status(201).json({
      message: 'Registration successful',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    console.error('Registration route error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const validation = refreshSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const { token } = validation.data;
    const newToken = await refreshToken(token);

    if (!newToken) {
      return res.status(401).json({
        error: 'Invalid or expired token',
        code: 'TOKEN_INVALID'
      });
    }

    res.json({
      message: 'Token refreshed successfully',
      token: newToken
    });
  } catch (error) {
    console.error('Token refresh route error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'User not authenticated',
        code: 'NOT_AUTHENTICATED'
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = req.user;
    
    res.json({
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the token from storage. However, we can log the event.
    console.log(`User ${req.user?.username} logged out`);
    
    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout route error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/auth/check - Check if token is valid
router.get('/check', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    res.json({
      valid: true,
      user: {
        id: req.user?.id,
        username: req.user?.username
      }
    });
  } catch (error) {
    console.error('Token check error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;