import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Upload, Search, Sparkles, Image as ImageIcon, Loader2, Download } from "lucide-react";

interface ImageSelectorProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
  placeholder?: string;
  isFeaturedImage?: boolean;
  postId?: string;
}

interface PexelsImage {
  id: number;
  url: string;
  photographer: string;
  src: {
    medium: string;
    large: string;
    original: string;
  };
}

interface GeneratedImage {
  url: string;
  prompt: string;
  provider: 'openai' | 'freepik';
}

export default function ImageSelector({ onImageSelect, currentImage, placeholder = "Selecione uma imagem", isFeaturedImage = false, postId }: ImageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [isLoading, setIsLoading] = useState(false);
  const [pexelsImages, setPexelsImages] = useState<PexelsImage[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [generatePrompt, setGeneratePrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Upload de arquivo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "O arquivo deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Adiciona postId se não for imagem destacada
      if (!isFeaturedImage && postId) {
        formData.append('postId', postId);
      }

      // Use direct fetch for file upload since we need FormData
      const token = localStorage.getItem('auth_token');
      const endpoint = isFeaturedImage ? '/api/upload/featured-image' : '/api/upload/image';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Falha no upload');
      }

      const data = await response.json();
      onImageSelect(data.url);
      setIsOpen(false);
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar imagens no Pexels
  const searchPexelsImages = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Erro",
        description: "Digite um termo de busca.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiRequest(`/api/images/pexels/search?query=${encodeURIComponent(searchQuery)}`);
      setPexelsImages(data.photos || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao buscar imagens. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gerar imagem com OpenAI
  const generateImageOpenAI = async () => {
    if (!generatePrompt.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma descrição para gerar a imagem.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiRequest('/api/images/generate/openai', {
        method: 'POST',
        body: JSON.stringify({ prompt: generatePrompt }),
      });
      const newImage: GeneratedImage = {
        url: data.url,
        prompt: generatePrompt,
        provider: 'openai'
      };
      setGeneratedImages(prev => [newImage, ...prev]);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao gerar imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gerar imagem com Freepik
  const generateImageFreepik = async () => {
    if (!generatePrompt.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma descrição para gerar a imagem.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiRequest('/api/images/generate/freepik', {
        method: 'POST',
        body: JSON.stringify({ prompt: generatePrompt }),
      });
      const newImage: GeneratedImage = {
        url: data.url,
        prompt: generatePrompt,
        provider: 'freepik'
      };
      setGeneratedImages(prev => [newImage, ...prev]);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao gerar imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectImage = (imageUrl: string) => {
    onImageSelect(imageUrl);
    setIsOpen(false);
    toast({
      title: "Sucesso",
      description: "Imagem selecionada com sucesso!",
    });
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Imagem em Destaque</Label>
      
      {/* Preview da imagem atual */}
      {currentImage && (
        <div className="relative">
          <img
            src={currentImage}
            alt="Imagem atual"
            className="w-full max-w-sm h-32 object-cover rounded-lg border"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => onImageSelect('')}
          >
            Remover
          </Button>
        </div>
      )}
      
      {/* Área principal de seleção */}
      <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <ImageIcon className="h-12 w-12 mx-auto text-primary/60" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Selecione uma Imagem</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Escolha entre upload, busca no Pexels, geração com IA ou insira uma URL
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
               <Dialog open={isOpen} onOpenChange={setIsOpen}>
                 <DialogTrigger asChild>
                   <Button className="flex-1">
                     <ImageIcon className="h-4 w-4 mr-2" />
                     Explorar Opções
                   </Button>
                 </DialogTrigger>
                 
                 <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                   <DialogHeader>
                     <DialogTitle>Selecionar Imagem</DialogTitle>
                   </DialogHeader>
                   
                   <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="pexels" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Pexels
                </TabsTrigger>
                <TabsTrigger value="openai" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  OpenAI
                </TabsTrigger>
                <TabsTrigger value="freepik" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Freepik
                </TabsTrigger>
              </TabsList>

              {/* Upload Tab */}
              <TabsContent value="upload" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Fazer Upload de Imagem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">Clique para selecionar uma imagem</p>
                      <p className="text-sm text-gray-500 mb-4">PNG, JPG, GIF até 5MB</p>
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Selecionar Arquivo
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pexels Tab */}
              <TabsContent value="pexels" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Buscar no Pexels</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Digite o que você está procurando..."
                        onKeyPress={(e) => e.key === 'Enter' && searchPexelsImages()}
                        className="flex-1"
                      />
                      <Button onClick={searchPexelsImages} disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {pexelsImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                        {pexelsImages.map((image) => (
                          <div key={image.id} className="relative group cursor-pointer" onClick={() => selectImage(image.src.large)}>
                            <img
                              src={image.src.medium}
                              alt={`Foto por ${image.photographer}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Download className="h-4 w-4 mr-2" />
                                Selecionar
                              </Button>
                            </div>
                            <Badge className="absolute bottom-2 left-2 text-xs">
                              {image.photographer}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* OpenAI Tab */}
              <TabsContent value="openai" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Gerar com OpenAI DALL-E</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="openai-prompt">Descrição da imagem</Label>
                      <Textarea
                        id="openai-prompt"
                        value={generatePrompt}
                        onChange={(e) => setGeneratePrompt(e.target.value)}
                        placeholder="Descreva a imagem que você quer gerar..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={generateImageOpenAI} disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      Gerar Imagem
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Freepik Tab */}
              <TabsContent value="freepik" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Gerar com Freepik AI</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="freepik-prompt">Descrição da imagem</Label>
                      <Textarea
                        id="freepik-prompt"
                        value={generatePrompt}
                        onChange={(e) => setGeneratePrompt(e.target.value)}
                        placeholder="Descreva a imagem que você quer gerar..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={generateImageFreepik} disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ImageIcon className="h-4 w-4 mr-2" />
                      )}
                      Gerar Imagem
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Imagens Geradas */}
              {generatedImages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Imagens Geradas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                      {generatedImages.map((image, index) => (
                        <div key={index} className="relative group cursor-pointer" onClick={() => selectImage(image.url)}>
                          <img
                            src={image.url}
                            alt={image.prompt}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Download className="h-4 w-4 mr-2" />
                              Selecionar
                            </Button>
                          </div>
                          <Badge className="absolute bottom-2 left-2 text-xs capitalize">
                            {image.provider}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </Tabs>
          </DialogContent>
               </Dialog>
                 
               {/* Campo de URL como opção secundária */}
               <div className="flex gap-2 flex-1">
                 <Input
                   value={currentImage || ''}
                   onChange={(e) => onImageSelect(e.target.value)}
                   placeholder="Ou cole uma URL de imagem"
                   className="flex-1"
                 />
               </div>
             </div>
          </div>
        </CardContent>
      </Card>
        
      {currentImage && (
        <div className="mt-2">
          <img
            src={currentImage}
            alt="Imagem selecionada"
            className="w-full max-w-xs h-32 object-cover rounded-lg border"
          />
        </div>
      )}
    </div>
  );
}