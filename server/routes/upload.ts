import { Router } from 'express';
import { upload, deleteImage, getOptimizedImageUrl, isCloudinaryConfigured } from '../upload/cloudinary';
import { mockUpload, mockDeleteImage, mockGetOptimizedImageUrl, isMockConfigured } from '../upload/mock-upload';
import { authenticateToken } from '../auth/jwt';
import { storage } from '../storage';

// Choose upload strategy based on configuration
const useCloudinary = isCloudinaryConfigured();
const uploadStrategy = useCloudinary ? upload : mockUpload;
const deleteStrategy = useCloudinary ? deleteImage : mockDeleteImage;
const optimizeStrategy = useCloudinary ? getOptimizedImageUrl : mockGetOptimizedImageUrl;

const router = Router();

// Check if upload service is configured
router.get('/config', (req, res) => {
  res.json({
    configured: useCloudinary || isMockConfigured(),
    service: useCloudinary ? 'cloudinary' : 'mock'
  });
});

// Upload featured image (não salva na tabela media)
router.post('/featured-image', authenticateToken, uploadStrategy.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
    }

    const file = req.file as any;

    // Generate proper URL for the uploaded file
    let fileUrl: string;
    if (useCloudinary) {
      // Cloudinary path
      fileUrl = file.path;
    } else {
      // Local file path - create URL relative to server
      const protocol = req.protocol;
      const host = req.get('host');
      fileUrl = `${protocol}://${host}/uploads/${file.filename}`;
    }

    console.log('Featured image uploaded successfully:', {
      originalName: file.originalname,
      filename: file.filename,
      url: fileUrl,
      size: file.size
    });

    res.json({
      success: true,
      url: fileUrl,
      filename: file.originalname,
      size: file.size
    });
  } catch (error) {
    console.error('Error uploading featured image:', error);
    res.status(500).json({
      error: 'Erro ao fazer upload da imagem destacada',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Upload content image (salva na tabela media com postId)
router.post('/image', authenticateToken, uploadStrategy.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
    }

    const file = req.file as any;

    // Generate proper URL for the uploaded file
    let fileUrl: string;
    if (useCloudinary) {
      // Cloudinary path
      fileUrl = file.path;
    } else {
      // Local file path - create URL relative to server
      const protocol = req.protocol;
      const host = req.get('host');
      fileUrl = `${protocol}://${host}/uploads/${file.filename}`;
    }

    // Save media record to database with optional postId and position
    const { postId, positionInContent } = req.body;
    const media = await storage.createMedia({
      fileName: file.originalname,
      fileUrl: fileUrl,
      fileType: file.mimetype,
      fileSize: file.size,
      altText: '',
      caption: '',
      postId: postId || null,
      positionInContent: positionInContent ? parseInt(positionInContent) : null
    });

    console.log('Image uploaded successfully:', {
      originalName: file.originalname,
      filename: file.filename,
      url: fileUrl,
      size: file.size
    });

    res.json({
      success: true,
      media: {
        id: media.id,
        url: media.fileUrl,
        publicId: file.filename,
        filename: media.fileName,
        mimeType: media.fileType,
        size: media.fileSize
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      error: 'Erro ao fazer upload da imagem',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Upload multiple images
router.post('/images', authenticateToken, uploadStrategy.array('images', 5), async (req, res) => {
  try {
    const files = req.files as any[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
    }

    const mediaRecords = [];
    
    for (const file of files) {
      const media = await storage.createMedia({
        fileName: file.originalname,
        fileUrl: file.path,
        fileType: file.mimetype,
        fileSize: file.size,
        altText: '',
        caption: ''
      });

      mediaRecords.push({
        id: media.id,
        url: media.fileUrl,
        publicId: file.filename,
        filename: media.fileName,
        mimeType: media.fileType,
        size: media.fileSize
      });
    }

    res.json({
      success: true,
      media: mediaRecords
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ 
      error: 'Erro ao fazer upload das imagens',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Get optimized image URL
router.get('/optimize/:publicId', (req, res) => {
  try {
    const { publicId } = req.params;
    const { width, height, quality, format } = req.query;

    const optimizedUrl = optimizeStrategy(publicId, {
      width: width ? parseInt(width as string) : undefined,
      height: height ? parseInt(height as string) : undefined,
      quality: quality as string,
      format: format as string
    });

    res.json({
      success: true,
      url: optimizedUrl
    });
  } catch (error) {
    console.error('Error generating optimized URL:', error);
    res.status(500).json({ error: 'Erro ao gerar URL otimizada' });
  }
});

// Delete image
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get media record
    const allMedia = await storage.getMedia();
    const media = allMedia.find(m => m.id === id);
    if (!media) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }

    // Delete from service (Cloudinary or mock)
    if (media.fileName) {
      const deleted = await deleteStrategy(media.fileName);
      if (!deleted) {
        console.warn(`Failed to delete image: ${media.fileName}`);
      }
    }
    
    // Delete from database
    const success = await storage.deleteMedia(id);
    if (!success) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Erro ao deletar imagem' });
  }
});

// Get all media files
router.get('/', authenticateToken, async (req, res) => {
  try {
    const media = await storage.getMedia();
    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Erro ao buscar arquivos de mídia' });
  }
});

// Get single media file
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const allMedia = await storage.getMedia();
    const media = allMedia.find(m => m.id === id);

    if (!media) {
      return res.status(404).json({ error: 'Arquivo de mídia não encontrado' });
    }

    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Erro ao buscar arquivo de mídia' });
  }
});

export default router;