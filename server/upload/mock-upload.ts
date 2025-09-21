import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `upload-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Mock upload for development when Cloudinary is not configured
export const mockUpload = {
  single: (fieldName: string) => {
    return upload.single(fieldName);
  },

  array: (fieldName: string, maxCount: number) => {
    return upload.array(fieldName, maxCount);
  }
};

export const mockDeleteImage = async (publicId: string): Promise<boolean> => {
  // Mock deletion - always successful
  console.log(`🗑️ Mock: Deleted image ${publicId}`);
  return true;
};

export const mockGetOptimizedImageUrl = (publicId: string, options: any): string => {
  // Return optimized mock URL
  return `https://picsum.photos/800/600?random=${publicId}`;
};

export const isMockConfigured = (): boolean => {
  return true;
};