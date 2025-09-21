import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Link, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void;
  currentImageUrl?: string;
  placeholder?: string;
  label?: string;
  accept?: string;
  postId?: string;
  positionInContent?: number;
}

export function ImageUpload({
  onImageSelected,
  currentImageUrl = '',
  placeholder = 'URL da imagem ou selecione um arquivo',
  label = 'Imagem',
  accept = 'image/*',
  postId,
  positionInContent
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(currentImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Sincronizar o estado local com o prop quando ele mudar
  React.useEffect(() => {
    setImageUrl(currentImageUrl);
  }, [currentImageUrl]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione apenas arquivos de imagem.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'A imagem deve ter no máximo 10MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Adiciona postId e positionInContent se fornecidos
      if (postId) {
        formData.append('postId', postId);
      }
      if (positionInContent !== undefined) {
        formData.append('positionInContent', positionInContent.toString());
      }

      // Create a custom request for file upload using FormData
      const token = localStorage.getItem('auth_token');

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData, // Don't set Content-Type for FormData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Upload response data:', data);

      if (data.success && data.media?.url) {
        const uploadedImageUrl = data.media.url;
        console.log('Image uploaded successfully:', uploadedImageUrl);

        // Atualizar o estado local primeiro
        setImageUrl(uploadedImageUrl);

        // Depois notificar o componente pai
        onImageSelected(uploadedImageUrl);

        toast({
          title: 'Sucesso',
          description: 'Imagem enviada com sucesso!',
        });
      } else {
        console.error('Invalid server response:', data);
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Erro no upload',
        description: error instanceof Error ? error.message : 'Erro desconhecido ao enviar imagem.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onImageSelected(imageUrl.trim());
      setShowUrlInput(false);
      toast({
        title: 'URL da imagem',
        description: 'URL da imagem definida com sucesso!',
      });
    }
  };

  const handleClear = () => {
    setImageUrl('');
    onImageSelected('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {/* Preview da imagem atual */}
      {imageUrl && (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-32 object-cover rounded-md border"
            onError={(e) => {
              // Se a imagem falhar ao carregar, esconder o preview
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        {/* Upload de arquivo */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            id={`file-upload-${Math.random()}`}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Enviando...' : 'Selecionar Arquivo'}
          </Button>
        </div>

        {/* Toggle para URL */}
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowUrlInput(!showUrlInput)}
        >
          <Link className="mr-2 h-4 w-4" />
          URL
        </Button>
      </div>

      {/* Input de URL */}
      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder={placeholder}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleUrlSubmit();
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleUrlSubmit}
            disabled={!imageUrl.trim()}
          >
            OK
          </Button>
        </div>
      )}
    </div>
  );
}