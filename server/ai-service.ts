// Serviço de IA para integração com APIs GROK e OpenAI
import axios from 'axios';
import dotenv from 'dotenv';

// Garantir que as variáveis de ambiente sejam carregadas
dotenv.config();

// Configurações GROK
const GROK_API_URL = process.env.GROK_API_URL || 'https://api.x.ai/v1/chat/completions';
const GROK_API_KEY = process.env.GROK_API_KEY || 'your-grok-api-key';

// Configurações OpenAI
const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-openai-api-key';

// Verificação das variáveis de ambiente

// Debug das API keys
console.log('🔑 Debug API Keys:');
console.log('GROK_API_KEY length:', GROK_API_KEY ? GROK_API_KEY.length : 0);
console.log('GROK_API_KEY prefix:', GROK_API_KEY ? GROK_API_KEY.substring(0, 10) + '...' : 'undefined');
console.log('OPENAI_API_KEY length:', OPENAI_API_KEY ? OPENAI_API_KEY.length : 0);
console.log('OPENAI_API_KEY prefix:', OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 10) + '...' : 'undefined');

// Verificar quais APIs estão configuradas
const isGrokConfigured = GROK_API_KEY && 
  GROK_API_KEY !== 'your-grok-api-key' && 
  GROK_API_KEY.length > 10 &&
  !GROK_API_KEY.includes('your-');

const isOpenAIConfigured = OPENAI_API_KEY && 
  OPENAI_API_KEY !== 'your-openai-api-key' && 
  OPENAI_API_KEY.length > 10 &&
  !OPENAI_API_KEY.includes('your-');

console.log('🤖 API Status:');
console.log('GROK configured:', isGrokConfigured);
console.log('OpenAI configured:', isOpenAIConfigured);

// APIs configuradas: GROK e OpenAI

// Função para tentar melhorar conteúdo com GROK
async function tryGrokAPI(prompt: string, content: string): Promise<string> {
  if (!isGrokConfigured) {
    throw new Error('API GROK não configurada ou chave inválida');
  }

  console.log('📡 Enviando requisição para GROK API...');
  
  try {
    const response = await axios.post(
      GROK_API_URL,
      {
        model: "grok-3",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: content }
        ],
        temperature: 0.7,
        max_tokens: 4000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROK_API_KEY}`
        },
        timeout: 30000 // 30 seconds timeout
      }
    );
    
    console.log('✅ Resposta GROK recebida');
    
    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Resposta inválida da API GROK');
    }
    
    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('❌ Erro na API GROK:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      throw new Error(`Erro GROK API (${error.response.status}): ${error.response.data?.error?.message || 'Erro desconhecido'}`);
    }
    throw new Error(`Erro GROK API: ${error.message}`);
  }
}

// Função para tentar melhorar conteúdo com OpenAI
async function tryOpenAIAPI(prompt: string, content: string): Promise<string> {
  if (!isOpenAIConfigured) {
    throw new Error('API OpenAI não configurada ou chave inválida');
  }

  console.log('📡 Enviando requisição para OpenAI API...');
  
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: content }
        ],
        temperature: 0.7,
        max_tokens: 4000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        timeout: 30000 // 30 seconds timeout
      }
    );
    
    console.log('✅ Resposta OpenAI recebida');
    
    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Resposta inválida da API OpenAI');
    }
    
    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('❌ Erro na API OpenAI:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      throw new Error(`Erro OpenAI API (${error.response.status}): ${error.response.data?.error?.message || 'Erro desconhecido'}`);
    }
    throw new Error(`Erro OpenAI API: ${error.message}`);
  }
}

export const aiService = {
  async improveContent(prompt: string, content: string): Promise<string> {
    console.log('🤖 Iniciando processamento com IA...');
    console.log(`📋 APIs disponíveis: OpenAI=${isOpenAIConfigured}, GROK=${isGrokConfigured}`);
    
    // Verificar se pelo menos uma API está configurada
    if (!isGrokConfigured && !isOpenAIConfigured) {
      const error = 'Nenhuma API de IA configurada. Configure GROK_API_KEY ou OPENAI_API_KEY no arquivo .env.';
      console.error('❌', error);
      throw new Error(error);
    }

    // Tentar OpenAI primeiro, depois GROK como fallback
    if (isOpenAIConfigured) {
      try {
        console.log('🎯 Tentando OpenAI API primeiro...');
        const result = await tryOpenAIAPI(prompt, content);
        console.log('✅ Sucesso com OpenAI!');
        return result;
      } catch (error: any) {
        console.warn('⚠️ OpenAI falhou, tentando GROK como fallback:', error.message);
        
        // Se GROK também estiver configurada, tentar como fallback
        if (isGrokConfigured) {
          try {
            console.log('🎯 Tentando GROK API como fallback...');
            const result = await tryGrokAPI(prompt, content);
            console.log('✅ Sucesso com GROK!');
            return result;
          } catch (grokError: any) {
            console.error('❌ GROK fallback também falhou:', grokError.message);
            throw new Error(`Ambas as APIs falharam. OpenAI: ${error.message}. GROK: ${grokError.message}`);
          }
        } else {
          // Se só OpenAI está configurada e falhou
          console.error('❌ Apenas OpenAI configurada e falhou');
          throw new Error(`API OpenAI falhou: ${error.message}`);
        }
      }
    } else if (isGrokConfigured) {
      // Se só GROK está configurada
      try {
        console.log('🎯 Usando apenas GROK API...');
        const result = await tryGrokAPI(prompt, content);
        console.log('✅ Sucesso com GROK!');
        return result;
      } catch (error: any) {
        console.error('❌ GROK falhou:', error.message);
        throw new Error(`API GROK falhou: ${error.message}`);
      }
    }

    throw new Error('Erro inesperado no serviço de IA');
  }
};

// Função auxiliar para formatar o conteúdo melhorado (simulação)
function formatImprovedContent(originalContent: string): string {
  // Extrair algumas palavras-chave do conteúdo original
  const keywords = extractKeywords(originalContent);
  
  // Criar um título baseado nas palavras-chave
  const title = `# Como a IA Revoluciona a ${keywords[0] || 'Criação de Conteúdo'}: Insights de ${keywords[1] || 'Especialistas'}`;
  
  // Criar uma introdução
  const intro = `
## Objetivo do Vídeo

Este vídeo tem como objetivo principal explorar como a inteligência artificial está transformando a maneira como criamos e consumimos conteúdo digital. Em apenas alguns minutos, o apresentador consegue sintetizar anos de evolução tecnológica e mostrar aplicações práticas que qualquer criador de conteúdo pode implementar hoje mesmo.

`;

  // Criar seção de sacadas principais
  const insights = `
## Sacadas Principais

* **Democratização das ferramentas de IA**: Não é mais necessário ser um especialista em programação para utilizar IA na criação de conteúdo.
* **Personalização em escala**: A IA permite criar conteúdo personalizado para diferentes audiências simultaneamente.
* **Análise preditiva de tendências**: Algoritmos podem prever quais tópicos terão maior engajamento antes mesmo de você criar o conteúdo.
* **Colaboração homem-máquina**: Os melhores resultados vêm quando a criatividade humana é potencializada pela eficiência da IA.

`;

  // Criar seção de dicas práticas
  const tips = `
## Dicas Práticas

1. **Comece com ferramentas simples**: Existem diversas plataformas de IA que não exigem conhecimento técnico.
2. **Defina objetivos claros**: Antes de usar a IA, tenha clareza sobre o que deseja alcançar.
3. **Refine os prompts**: A qualidade do seu input determina a qualidade do output da IA.
4. **Revise e humanize**: Sempre revise o conteúdo gerado por IA para adicionar seu toque pessoal.
5. **Experimente diferentes modelos**: Cada ferramenta de IA tem suas particularidades e pontos fortes.

[Insira imagem ilustrativa de ferramentas de IA para criação de conteúdo]

`;

  // Criar conclusão
  const conclusion = `
## Conclusão e Próximos Passos

A inteligência artificial não veio para substituir criadores de conteúdo, mas para potencializar suas capacidades. Ao dominar essas ferramentas, você consegue produzir mais, com maior qualidade e em menos tempo. O futuro pertence àqueles que souberem combinar a criatividade humana com o poder computacional da IA.

Não espere para começar - as ferramentas estão disponíveis agora e a curva de aprendizado é mais suave do que você imagina. Comece com pequenos projetos e vá expandindo conforme ganha confiança.

[Adicione call-to-action para inscrição na newsletter]

---

**Tags**: IA & Criatividade, Produtividade, Ferramentas Digitais  
**Tempo de leitura**: 5 min  
**Autor**: Equipe CriativelA
`;

  // Combinar todas as seções
  return `${title}\n\n${intro}${insights}${tips}${conclusion}`;
}

// Função auxiliar para extrair palavras-chave do conteúdo original
function extractKeywords(content: string): string[] {
  const words = content.split(/\s+/);
  const filteredWords = words.filter(word => 
    word.length > 4 && 
    !['como', 'para', 'isso', 'então', 'muito', 'também', 'porque'].includes(word.toLowerCase())
  );
  
  // Pegar algumas palavras aleatórias do conteúdo
  const keywords = [];
  for (let i = 0; i < 3; i++) {
    if (filteredWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      keywords.push(filteredWords[randomIndex]);
      filteredWords.splice(randomIndex, 1);
    }
  }
  
  return keywords;
}