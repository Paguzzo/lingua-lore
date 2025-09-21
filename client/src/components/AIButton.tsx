import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';

interface AIButtonProps {
  content: string;
  onContentUpdate: (newContent: string) => void;
  disabled?: boolean;
}

const AI_PROMPT = `Você é um especialista em redação de posts para blogs, com foco em conteúdos sobre IA, criatividade, criação de conteúdo inteligente, ferramentas de automação e tutoriais, no estilo do blog "CriativelA: Inteligência Criativa". Seu objetivo é transformar transcrições de vídeos em artigos prontos para publicação, abstraindo os elementos essenciais de forma concisa, envolvente e otimizada para SEO e leitura rápida.

Aqui está a transcrição completa de um vídeo: [INSIRA A TRANSCRIÇÃO AQUI]

Analise a transcrição e crie um post de blog completo e pronto para ser publicado no blog CriativelA. Siga estas diretrizes rigorosamente:

Abstração do Conteúdo:

Identifique o objetivo principal do vídeo: O que o vídeo busca ensinar ou discutir? Resuma em 1-2 parágrafos introdutórios.
Extraia as sacadas chave (insights inovadores ou pontos surpreendentes): Foque em ideias criativas, revelações sobre IA ou criatividade que impactam o leitor.
Extraia as dicas práticas: Liste dicas acionáveis, passo a passo, que o leitor possa aplicar imediatamente.
Resuma a conclusão: Destaque as lições finais, chamadas para ação ou perspectivas futuras.

Formatação do Post:

Título Principal: Crie um título atrativo, otimizado para SEO, com 50-70 caracteres, incorporando palavras-chave como "IA", "criatividade", "conteúdo inteligente" ou relacionadas ao tema do vídeo. Exemplo: "Como a IA Revoluciona a Criação de Conteúdo: Insights de [Tema do Vídeo]".
Subtítulos (H2 e H3): Use subtítulos para seções claras, como "Objetivo do Vídeo", "Sacadas Principais", "Dicas Práticas", "Conclusão e Próximos Passos".
Bullet Points e Listas: Use bullets para listas de sacadas, dicas e pontos chave, tornando o texto escaneável.
Comprimento Ideal: Mantenha o post entre 800-1200 palavras, com parágrafos curtos (3-5 linhas cada), linguagem conversacional em português brasileiro, e tom motivador e experto.
Elementos Visuais: Sugira placeholders para imagens ou chamadas, como "[Insira imagem ilustrativa de IA em ação]" ou "[Adicione call-to-action para inscrição na newsletter]".
SEO e Engajamento: Inclua palavras-chave naturais, perguntas retóricas para envolver o leitor, e uma chamada final para comentários ou compartilhamento.
Rodapé: Adicione tags como "IA & Criatividade", tempo de leitura estimado (ex: "5 min de leitura") e autor como "Equipe CriativelA".

Garanta que o post seja original, não copie a transcrição verbatim, mas reescreva tudo de forma fluida e valorosa. O resultado deve ser um artigo completo, pronto para copiar e colar no blog, sem necessidade de edições adicionais.`;

export function AIButton({ content, onContentUpdate, disabled = false }: AIButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const handleAIImprovement = async () => {
    if (!content.trim()) {
      toast({
        title: 'Conteúdo vazio',
        description: 'Por favor, adicione algum conteúdo antes de usar a IA.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setShowDialog(true);

    try {
      // Substituir [INSIRA A TRANSCRIÇÃO AQUI] pelo conteúdo atual
      const promptWithContent = AI_PROMPT.replace('[INSIRA A TRANSCRIÇÃO AQUI]', content);
      
      // Obter o token de autenticação
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      
      const response = await axios.post('/api/ai/improve-content', 
        {
          prompt: promptWithContent,
          content: content,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Resposta recebida com sucesso
      
      if (response.data && response.data.improvedContent) {
        onContentUpdate(response.data.improvedContent);
        toast({
          title: 'Conteúdo melhorado!',
          description: 'A IA GROK processou seu texto com sucesso.',
        });
      } else {
        throw new Error('Resposta inválida da IA GROK');
      }
    } catch (error: any) {
      console.error('Erro na API de IA:', error.message);
      
      let errorMessage = 'Não foi possível processar o conteúdo com a IA GROK. Tente novamente.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Usuário não autenticado. Faça login novamente.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Token de autenticação inválido. Faça login novamente.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setShowDialog(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAIImprovement}
        disabled={disabled || isLoading}
        className="text-purple-600 border-purple-200 hover:bg-purple-50"
        title="Melhorar conteúdo com IA GROK"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        IA GROK
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Processando com IA GROK
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-muted-foreground">
                A IA está analisando e melhorando seu conteúdo...
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Isso pode levar alguns segundos.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}