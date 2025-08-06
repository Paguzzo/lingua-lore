import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye, Globe, Search, Image, Link } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface PostData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  categoryId: string;
  isPublished: boolean;
  isFeatured: boolean;
  position: 'featured' | 'recent' | 'popular';
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  readTime: number;
}

export default function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [postData, setPostData] = useState<PostData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    categoryId: '',
    isPublished: false,
    isFeatured: false,
    position: 'recent',
    metaTitle: '',
    metaDescription: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    readTime: 5,
  });

  const [selectedText, setSelectedText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    retry: 3,
  });

  if (categoriesError) {
    console.error('Error loading categories:', categoriesError);
  }

  const { data: post, isLoading } = useQuery({
    queryKey: ['/api/posts', id],
    queryFn: () => apiRequest(`/api/posts/${id}`),
    enabled: !!id,
  });

  useEffect(() => {
    if (post) {
      setPostData({
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        featuredImage: post.featuredImage || '',
        categoryId: post.categoryId || '',
        isPublished: post.isPublished || false,
        isFeatured: post.isFeatured || false,
        position: post.position || 'recent',
        metaTitle: post.metaTitle || '',
        metaDescription: post.metaDescription || '',
        ogTitle: post.ogTitle || '',
        ogDescription: post.ogDescription || '',
        ogImage: post.ogImage || '',
        readTime: post.readTime || 5,
      });
    }
  }, [post]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute) || 1;
  };

  const handleTitleChange = (title: string) => {
    const slug = generateSlug(title);
    setPostData(prev => ({
      ...prev,
      title,
      slug,
      metaTitle: prev.metaTitle || title,
      ogTitle: prev.ogTitle || title,
    }));
  };

  const handleContentChange = (content: string) => {
    const readTime = calculateReadTime(content);
    setPostData(prev => ({
      ...prev,
      content,
      readTime: readTime,
    }));
  };

  const savePostMutation = useMutation({
    mutationFn: async (publish: boolean = false) => {
      if (!postData.title.trim() || !postData.content.trim()) {
        throw new Error('Título e conteúdo são obrigatórios.');
      }

      const saveData = {
        ...postData,
        isPublished: publish || postData.isPublished,
        authorName: user?.username || 'Admin',
        publishedAt: publish && !id ? new Date().toISOString() : undefined,
      };

      if (id) {
        return apiRequest(`/api/posts/${id}`, {
          method: 'PUT',
          body: JSON.stringify(saveData)
        });
      } else {
        return apiRequest('/api/posts', {
          method: 'POST',
          body: JSON.stringify(saveData)
        });
      }
    },
    onSuccess: (_, publish: boolean) => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: publish ? 'Artigo publicado' : 'Artigo salvo',
        description: `O artigo foi ${publish ? 'publicado' : 'salvo como rascunho'} com sucesso.`,
      });
      navigate('/admin/posts');
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível salvar o artigo.',
        variant: 'destructive',
      });
    }
  });

  const handleSave = (publish: boolean = false) => {
    if (!postData.title.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'O título é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    if (!postData.content.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'O conteúdo é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    if (publish && !postData.categoryId) {
      toast({
        title: 'Erro de validação',
        description: 'É necessário selecionar uma categoria para publicar.',
        variant: 'destructive',
      });
      return;
    }

    savePostMutation.mutate(publish);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString());
    }
  };

  const handleAddLink = () => {
    if (selectedText) {
      setShowLinkDialog(true);
    } else {
      toast({
        title: 'Erro',
        description: 'Selecione um texto primeiro para adicionar um link.',
        variant: 'destructive',
      });
    }
  };

  const insertLink = () => {
    if (selectedText && linkUrl) {
      const linkHtml = `<a href="${linkUrl}" target="_blank" style="color: #3b82f6; text-decoration: underline;">${selectedText}</a>`;
      const newContent = postData.content.replace(selectedText, linkHtml);
      setPostData(prev => ({ ...prev, content: newContent }));
      setShowLinkDialog(false);
      setLinkUrl('');
      setSelectedText('');
      toast({
        title: 'Link adicionado',
        description: 'O link foi inserido no texto com sucesso.',
      });
    }
  };

  const formatText = (format: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (!selectedText) {
      toast({
        title: 'Erro',
        description: 'Selecione um texto primeiro para formatar.',
        variant: 'destructive',
      });
      return;
    }

    let formattedText = '';
    switch (format) {
      case 'h1':
        formattedText = `<h1 style="font-size: 2rem; font-weight: bold; margin: 1rem 0;">${selectedText}</h1>`;
        break;
      case 'h2':
        formattedText = `<h2 style="font-size: 1.5rem; font-weight: bold; margin: 0.8rem 0;">${selectedText}</h2>`;
        break;
      case 'bold':
        formattedText = `<strong style="font-weight: bold;">${selectedText}</strong>`;
        break;
      case 'bullet':
        const lines = selectedText.split('\n').filter(line => line.trim());
        const listItems = lines.map(line => `<li style="margin: 0.2rem 0;">${line.trim()}</li>`).join('');
        formattedText = `<ul style="margin: 1rem 0; padding-left: 1.5rem;">${listItems}</ul>`;
        break;
    }

    const newContent = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    setPostData(prev => ({ ...prev, content: newContent }));
    
    toast({
      title: 'Formatação aplicada',
      description: `Texto formatado como ${format.toUpperCase()} com sucesso.`,
    });
  };

  const selectedCategory = categories.find(cat => cat.id === postData.categoryId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/posts')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {id ? 'Editar Artigo' : 'Novo Artigo'}
            </h1>
            <p className="text-muted-foreground">
              {id ? 'Modifique as informações do artigo' : 'Crie um novo artigo para o blog'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={savePostMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Rascunho
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={savePostMutation.isPending}
          >
            <Globe className="mr-2 h-4 w-4" />
            Publicar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo Principal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={postData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Digite o título do artigo"
                />
              </div>

              <div>
                <Label htmlFor="slug">URL (Slug)</Label>
                <Input
                  id="slug"
                  value={postData.slug}
                  onChange={(e) => setPostData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-do-artigo"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  value={postData.excerpt}
                  onChange={(e) => setPostData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Breve descrição do artigo"
                  rows={3}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="content">Conteúdo</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => formatText('h1')}
                      title="Título H1"
                    >
                      H1
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => formatText('h2')}
                      title="Título H2"
                    >
                      H2
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => formatText('bold')}
                      title="Negrito"
                    >
                      <strong>B</strong>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => formatText('bullet')}
                      title="Lista com marcadores"
                    >
                      •
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddLink}
                      className="text-blue-600"
                    >
                      <Link className="h-4 w-4 mr-2" />
                      Link
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="content"
                  value={postData.content}
                  onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
                  onMouseUp={handleTextSelection}
                  className="min-h-[300px]"
                  placeholder="Escreva o conteúdo do artigo..."
                />
                <p className="text-sm text-muted-foreground">
                  Dica: Selecione um texto e use os botões acima para formatar (H1, H2, Negrito, Lista) ou adicionar links.
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="seo" className="w-full">
            <TabsList>
              <TabsTrigger value="seo">
                <Search className="mr-2 h-4 w-4" />
                SEO
              </TabsTrigger>
              <TabsTrigger value="social">
                <Globe className="mr-2 h-4 w-4" />
                Redes Sociais
              </TabsTrigger>
            </TabsList>

            <TabsContent value="seo">
              <Card>
                <CardHeader>
                  <CardTitle>Otimização para Buscadores (SEO)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Título</Label>
                    <Input
                      id="metaTitle"
                      value={postData.metaTitle}
                      onChange={(e) => setPostData(prev => ({ ...prev, metaTitle: e.target.value }))}
                      placeholder="Título para mecanismos de busca"
                      maxLength={60}
                    />
                    <p className="text-sm text-muted-foreground">
                      {postData.metaTitle.length}/60 caracteres
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="metaDescription">Meta Descrição</Label>
                    <Textarea
                      id="metaDescription"
                      value={postData.metaDescription}
                      onChange={(e) => setPostData(prev => ({ ...prev, metaDescription: e.target.value }))}
                      placeholder="Descrição para mecanismos de busca"
                      maxLength={160}
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">
                      {postData.metaDescription.length}/160 caracteres
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle>Open Graph (Redes Sociais)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="ogTitle">Título para Redes Sociais</Label>
                    <Input
                      id="ogTitle"
                      value={postData.ogTitle}
                      onChange={(e) => setPostData(prev => ({ ...prev, ogTitle: e.target.value }))}
                      placeholder="Título para compartilhamento"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ogDescription">Descrição para Redes Sociais</Label>
                    <Textarea
                      id="ogDescription"
                      value={postData.ogDescription}
                      onChange={(e) => setPostData(prev => ({ ...prev, ogDescription: e.target.value }))}
                      placeholder="Descrição para compartilhamento"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ogImage">Imagem para Redes Sociais</Label>
                    <Input
                      id="ogImage"
                      value={postData.ogImage}
                      onChange={(e) => setPostData(prev => ({ ...prev, ogImage: e.target.value }))}
                      placeholder="URL da imagem para compartilhamento"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={postData.categoryId} onValueChange={(value) => setPostData(prev => ({ ...prev, categoryId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCategory && (
                  <Badge variant="outline" className="mt-2" style={{ borderColor: selectedCategory.color }}>
                    {selectedCategory.name}
                  </Badge>
                )}
              </div>

              <div>
                <Label htmlFor="featuredImage">Imagem Destacada</Label>
                <Input
                  id="featuredImage"
                  value={postData.featuredImage}
                  onChange={(e) => setPostData(prev => ({ ...prev, featuredImage: e.target.value }))}
                  placeholder="URL da imagem"
                />
              </div>

              <div>
                <Label htmlFor="readTime">Tempo de Leitura (minutos)</Label>
                <Input
                  id="readTime"
                  type="number"
                  min="1"
                  value={postData.readTime}
                  onChange={(e) => setPostData(prev => ({ ...prev, readTime: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublished"
                    checked={postData.isPublished}
                    onCheckedChange={(checked) => setPostData(prev => ({ ...prev, isPublished: checked }))}
                  />
                  <Label htmlFor="isPublished">Publicar</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    checked={postData.isFeatured || false}
                    onCheckedChange={(checked) => setPostData(prev => ({ ...prev, isFeatured: checked }))}
                  />
                  <Label htmlFor="isFeatured">Artigo em Destaque</Label>
                </div>

                <div>
                  <Label htmlFor="position">Posição na Homepage</Label>
                  <select
                    id="position"
                    value={postData.position || 'recent'}
                    onChange={(e) => setPostData(prev => ({ ...prev, position: e.target.value as 'featured' | 'recent' | 'popular' }))}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md"
                  >
                    <option value="featured">Artigo em Destaque</option>
                    <option value="recent">Artigos Recentes</option>
                    <option value="popular">Artigos Populares</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {postData.featuredImage && (
            <Card>
              <CardHeader>
                <CardTitle>Preview da Imagem</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={postData.featuredImage}
                  alt="Featured"
                  className="w-full h-32 object-cover rounded-md"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="linkUrl">URL do Link</Label>
            <Input
              id="linkUrl"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
            />
            <p className="text-sm text-muted-foreground">
              Você está adicionando um link para: "{selectedText}"
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>Cancelar</Button>
            <Button onClick={insertLink}>Adicionar Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}