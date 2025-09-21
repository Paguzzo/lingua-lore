import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog-uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ],
  } as any,
});

// Create multer upload middleware
export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Function to delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
};

// Function to get optimized image URL
export const getOptimizedImageUrl = (publicId: string, options: {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
} = {}): string => {
  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  let transformation = `q_${quality},f_${format}`;
  
  if (width && height) {
    transformation += `,w_${width},h_${height},c_fill`;
  } else if (width) {
    transformation += `,w_${width},c_scale`;
  } else if (height) {
    transformation += `,h_${height},c_scale`;
  }
  
  return cloudinary.url(publicId, {
    transformation: transformation
  });
};

// Check if Cloudinary is configured
export const isCloudinaryConfigured = (): boolean => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // Check if all variables exist and are not placeholder values
  return !!(cloudName &&
           apiKey &&
           apiSecret &&
           cloudName !== 'your-cloudinary-cloud-name' &&
           apiKey !== 'your-cloudinary-api-key' &&
           apiSecret !== 'your-cloudinary-api-secret');
};

export { cloudinary };