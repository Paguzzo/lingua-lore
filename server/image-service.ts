import OpenAI from 'openai';

// Use global fetch (available in Node.js 18+) or import node-fetch
const fetch = globalThis.fetch || require('node-fetch');

// Configuração das APIs
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY;

// Verificar configuração das APIs
const isPexelsConfigured = PEXELS_API_KEY && 
  PEXELS_API_KEY !== 'your-pexels-api-key' && 
  PEXELS_API_KEY.length > 10;

const isFreepikConfigured = FREEPIK_API_KEY && 
  FREEPIK_API_KEY !== 'your-freepik-api-key' && 
  FREEPIK_API_KEY.length > 10;

// Função para obter instância do OpenAI
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não configurada');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface PexelsSearchResponse {
  photos: Array<{
    id: number;
    url: string;
    photographer: string;
    src: {
      medium: string;
      large: string;
      original: string;
    };
  }>;
}

interface FreepikGenerateResponse {
  data: Array<{
    url: string;
  }>;
}

export class ImageService {
  // Buscar imagens no Pexels
  async searchPexelsImages(query: string, perPage: number = 15): Promise<PexelsSearchResponse> {
    console.log('🖼️ Buscando imagens no Pexels...');
    
    if (!isPexelsConfigured) {
      const error = 'Pexels API key não configurada. Configure PEXELS_API_KEY no arquivo .env';
      console.error('❌', error);
      throw new Error(error);
    }

    try {
      console.log(`📸 Buscando "${query}" no Pexels (${perPage} imagens)...`);
      
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
        {
          headers: {
            'Authorization': PEXELS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro Pexels:', response.status, errorText);
        throw new Error(`Erro na API do Pexels (${response.status}): ${errorText}`);
      }

      const data = await response.json() as PexelsSearchResponse;
      console.log(`✅ Encontradas ${data.photos?.length || 0} imagens no Pexels`);
      return data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar imagens no Pexels:', error.message);
      throw new Error(`Falha ao buscar imagens no Pexels: ${error.message}`);
    }
  }

  // Gerar imagem com OpenAI DALL-E
  async generateImageOpenAI(prompt: string): Promise<string> {
    console.log('🎨 Gerando imagem com OpenAI DALL-E...');
    
    try {
      const openai = getOpenAIClient();
      console.log(`🖼️ Prompt: "${prompt}"`);
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      });

      if (!response.data || !response.data[0]?.url) {
        throw new Error('Resposta inválida da OpenAI');
      }

      console.log('✅ Imagem gerada com sucesso!');
      return response.data[0].url;
    } catch (error: any) {
      console.error('❌ Erro ao gerar imagem com OpenAI:', error.message);
      throw new Error(`Falha ao gerar imagem com OpenAI: ${error.message}`);
    }
  }

  // Gerar imagem com Freepik AI
  async generateImageFreepik(prompt: string): Promise<string> {
    console.log('🎨 Tentando gerar imagem com Freepik AI...');
    
    if (!isFreepikConfigured) {
      const error = 'Freepik API key não configurada. Configure FREEPIK_API_KEY no arquivo .env';
      console.error('❌', error);
      throw new Error(error);
    }

    try {
      console.log(`🖼️ Prompt Freepik: "${prompt}"`);
      
      // NOTA: Freepik AI ainda está em desenvolvimento
      // Este endpoint pode não estar disponível ou requer configuração especial
      // Verificar documentação oficial: https://freepik.com/api
      
      console.warn('⚠️ Freepik AI ainda está em desenvolvimento - implementação experimental');
      
      const response = await fetch('https://api.freepik.com/v1/ai/text-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Freepik-API-Key': FREEPIK_API_KEY,
        },
        body: JSON.stringify({
          prompt: prompt,
          num_images: 1,
          image_size: '1024x1024',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro Freepik:', response.status, errorText);
        
        // Se é erro 404 ou serviço não disponível, dar uma mensagem mais clara
        if (response.status === 404) {
          throw new Error('Freepik AI ainda não está disponível. Use OpenAI DALL-E ou Pexels para imagens.');
        }
        
        throw new Error(`Erro na API do Freepik (${response.status}): ${errorText}`);
      }

      const data = await response.json() as FreepikGenerateResponse;
      
      if (!data.data || !data.data[0]?.url) {
        throw new Error('Resposta inválida do Freepik');
      }

      console.log('✅ Imagem gerada com Freepik!');
      return data.data[0].url;
    } catch (error: any) {
      console.error('❌ Erro ao gerar imagem com Freepik:', error.message);
      throw new Error(`Falha ao gerar imagem com Freepik: ${error.message}`);
    }
  }

  // Validar URL de imagem
  async validateImageUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok && response.headers.get('content-type')?.startsWith('image/');
    } catch {
      return false;
    }
  }

  // Otimizar prompt para geração de imagem
  optimizePrompt(prompt: string, context?: string): string {
    let optimizedPrompt = prompt.trim();
    
    // Adicionar contexto se fornecido
    if (context) {
      optimizedPrompt = `${context}. ${optimizedPrompt}`;
    }
    
    // Adicionar qualificadores para melhor qualidade
    if (!optimizedPrompt.includes('high quality') && !optimizedPrompt.includes('detailed')) {
      optimizedPrompt += ', high quality, detailed, professional';
    }
    
    return optimizedPrompt;
  }
}

export const imageService = new ImageService();