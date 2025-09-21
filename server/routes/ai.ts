import express from 'express';
import { z } from 'zod';
import { authenticateToken, type AuthenticatedRequest } from '../auth/jwt';
import { aiService } from '../ai-service';

const router = express.Router();

// Validation schema
const improveContentSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  content: z.string().min(1, 'Content is required')
});

// POST /api/ai/improve-content - Improve content using AI
router.post('/improve-content', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    console.log('🤖 Recebida requisição de melhoria de IA');
    
    const validation = improveContentSchema.safeParse(req.body);
    
    if (!validation.success) {
      console.error('❌ Erro de validação IA:', validation.error.errors);
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const { prompt, content } = validation.data;
    
    console.log(`📝 Processando conteúdo de ${content.length} caracteres...`);

    const improvedContent = await aiService.improveContent(prompt, content);
    
    console.log(`✅ Conteúdo processado com sucesso! Novo tamanho: ${improvedContent.length} caracteres`);

    res.json({
      message: 'Content improved successfully',
      improvedContent: improvedContent
    });

  } catch (error: any) {
    console.error('❌ Erro no serviço de IA:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to improve content with AI',
      code: 'AI_SERVICE_ERROR'
    });
  }
});

// POST /api/ai/generate-content - Generate content using AI
router.post('/generate-content', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    console.log('🤖 Recebida requisição de geração de conteúdo com IA');
    
    const validation = z.object({
      prompt: z.string().min(1, 'Prompt is required'),
      type: z.string().optional().default('article')
    }).safeParse(req.body);
    
    if (!validation.success) {
      console.error('❌ Erro de validação IA:', validation.error.errors);
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const { prompt, type } = validation.data;
    
    console.log(`📝 Gerando conteúdo do tipo: ${type}`);

    // Criar prompt específico baseado no tipo de conteúdo
    let systemPrompt = '';
    switch (type) {
      case 'article':
        systemPrompt = 'Você é um escritor especializado em criar artigos informativos e envolventes. Crie um artigo completo, bem estruturado, com introdução, desenvolvimento e conclusão.';
        break;
      case 'blog':
        systemPrompt = 'Você é um blogger experiente. Crie um post de blog conversacional, com tom pessoal e dicas práticas.';
        break;
      case 'social':
        systemPrompt = 'Você é um especialista em redes sociais. Crie conteúdo otimizado para engajamento em redes sociais.';
        break;
      default:
        systemPrompt = 'Você é um escritor versátil. Crie conteúdo de alta qualidade baseado no prompt fornecido.';
    }

    const generatedContent = await aiService.improveContent(systemPrompt, prompt);
    
    console.log(`✅ Conteúdo gerado com sucesso! Tamanho: ${generatedContent.length} caracteres`);

    res.json({
      message: 'Content generated successfully',
      content: generatedContent,
      type: type
    });

  } catch (error: any) {
    console.error('❌ Erro no serviço de geração de IA:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to generate content with AI',
      code: 'AI_SERVICE_ERROR'
    });
  }
});

export default router;