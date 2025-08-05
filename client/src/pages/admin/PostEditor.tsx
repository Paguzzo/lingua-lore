
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
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye, Globe, Search, Image } from 'lucide-react';

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
    metaTitle: '',
    metaDescription: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    readTime: 5,
  });

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
    mutationFn: async (publish = false) => {
      if (!postData.title.trim() || !postData.content.trim()) {
        throw new Error('Título e conteúdo são obrigatórios.');
      }

      const saveData = {
        ...postData,
        isPublished: publish || postData.isPublished,
        authorName: user?.email?.split('@')[0] || 'Admin',
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
    onSuccess: (_, publish) => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: publish ? 'Post publicado' : 'Post salvo',
        description: `O post foi ${publish ? 'publicado' : 'salvo como rascunho'} com sucesso.`,
      });
      navigate('/admin/posts');
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível salvar o post.',
        variant: 'destructive',
      });
    }
  });

  const handleSave = (publish = false) => {
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
              {id ? 'Editar Post' : 'Novo Post'}
            </h1>
            <p className="text-muted-foreground">
              {id ? 'Modifique as informações do post' : 'Crie um novo artigo para o blog'}
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
                  placeholder="Digite o título do post"
                />
              </div>

              <div>
                <Label htmlFor="slug">URL (Slug)</Label>
                <Input
                  id="slug"
                  value={postData.slug}
                  onChange={(e) => setPostData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-do-post"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  value={postData.excerpt}
                  onChange={(e) => setPostData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Breve descrição do post"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={postData.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Escreva o conteúdo do post em Markdown"
                  rows={20}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Você pode usar Markdown para formatar o texto. Tempo de leitura estimado: {postData.readTime} min
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={postData.isPublished}
                  onCheckedChange={(checked) => setPostData(prev => ({ ...prev, isPublished: checked }))}
                />
                <Label htmlFor="isPublished">Publicado</Label>
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
    </div>
  );
}
