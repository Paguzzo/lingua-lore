import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import type { User } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key-for-development-only';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET not set in environment variables. Using fallback secret.');
}

export interface JwtPayload {
  userId: number;
  username: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Generate JWT token
export function generateToken(user: User): string {
  const payload: JwtPayload = {
    userId: user.id,
    username: user.username
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Authentication middleware
export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'TOKEN_MISSING'
      });
    }

    const decoded = verifyToken(token);
    const user = await storage.getUser(decoded.userId);

    if (!user) {
      return res.status(401).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ 
      error: 'Invalid or expired token',
      code: 'TOKEN_INVALID'
    });
  }
}

// Optional authentication middleware (doesn't fail if no token)
export async function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      const user = await storage.getUser(decoded.userId);
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Silently continue without authentication
    next();
  }
}

// Login function
export async function loginUser(username: string, password: string): Promise<{ user: User; token: string } | null> {
  try {
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return null;
    }

    const token = generateToken(user);
    console.log('✅ Login successful for user:', username);
    
    // Remove password from user object before returning
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword as User,
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

// Register function
export async function registerUser(username: string, password: string): Promise<{ user: User; token: string } | null> {
  try {
    // Check if user already exists
    const existingUser = await storage.getUserByUsername(username);
    
    if (existingUser) {
      return null;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const newUser = await storage.createUser({
      username,
      password: hashedPassword
    });

    const token = generateToken(newUser);
    
    // Remove password from user object before returning
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      user: userWithoutPassword as User,
      token
    };
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
}

// Refresh token function
export async function refreshToken(oldToken: string): Promise<string | null> {
  try {
    const decoded = verifyToken(oldToken);
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return null;
    }

    return generateToken(user);
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}