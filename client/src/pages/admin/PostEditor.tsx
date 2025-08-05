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
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
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

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPost = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setPostData({
        title: data.title || '',
        slug: data.slug || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        featured_image: data.featured_image || '',
        category_id: data.category_id || '',
        is_published: data.is_published || false,
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        og_title: data.og_title || '',
        og_description: data.og_description || '',
        og_image: data.og_image || '',
        read_time: data.read_time || 5,
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o post.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
      meta_title: prev.meta_title || title,
      og_title: prev.og_title || title,
    }));
  };

  const handleContentChange = (content: string) => {
    const readTime = calculateReadTime(content);
    setPostData(prev => ({
      ...prev,
      content,
      read_time: readTime,
    }));
  };

  const handleSave = async (publish = false) => {
    if (!postData.title.trim() || !postData.content.trim()) {
      toast({
        title: 'Erro',
        description: 'Título e conteúdo são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const saveData = {
        ...postData,
        is_published: publish || postData.is_published,
        author_name: user?.email?.split('@')[0] || 'Admin',
        published_at: publish && !id ? new Date().toISOString() : undefined,
      };

      if (id) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update(saveData)
          .eq('id', id);

        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase
          .from('posts')
          .insert([saveData]);

        if (error) throw error;
      }

      toast({
        title: publish ? 'Post publicado' : 'Post salvo',
        description: `O post foi ${publish ? 'publicado' : 'salvo como rascunho'} com sucesso.`,
      });

      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o post.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === postData.category_id);

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
          <Button variant="outline" onClick={() => handleSave(false)} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Rascunho
          </Button>
          <Button onClick={() => handleSave(true)} disabled={loading}>
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
                  Você pode usar Markdown para formatar o texto. Tempo de leitura estimado: {postData.read_time} min
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
                    <Label htmlFor="meta_title">Meta Título</Label>
                    <Input
                      id="meta_title"
                      value={postData.meta_title}
                      onChange={(e) => setPostData(prev => ({ ...prev, meta_title: e.target.value }))}
                      placeholder="Título para mecanismos de busca"
                      maxLength={60}
                    />
                    <p className="text-sm text-muted-foreground">
                      {postData.meta_title.length}/60 caracteres
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="meta_description">Meta Descrição</Label>
                    <Textarea
                      id="meta_description"
                      value={postData.meta_description}
                      onChange={(e) => setPostData(prev => ({ ...prev, meta_description: e.target.value }))}
                      placeholder="Descrição para mecanismos de busca"
                      maxLength={160}
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">
                      {postData.meta_description.length}/160 caracteres
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
                    <Label htmlFor="og_title">Título para Redes Sociais</Label>
                    <Input
                      id="og_title"
                      value={postData.og_title}
                      onChange={(e) => setPostData(prev => ({ ...prev, og_title: e.target.value }))}
                      placeholder="Título para compartilhamento"
                    />
                  </div>

                  <div>
                    <Label htmlFor="og_description">Descrição para Redes Sociais</Label>
                    <Textarea
                      id="og_description"
                      value={postData.og_description}
                      onChange={(e) => setPostData(prev => ({ ...prev, og_description: e.target.value }))}
                      placeholder="Descrição para compartilhamento"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="og_image">Imagem para Redes Sociais</Label>
                    <Input
                      id="og_image"
                      value={postData.og_image}
                      onChange={(e) => setPostData(prev => ({ ...prev, og_image: e.target.value }))}
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
                <Select value={postData.category_id} onValueChange={(value) => setPostData(prev => ({ ...prev, category_id: value }))}>
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
                <Label htmlFor="featured_image">Imagem Destacada</Label>
                <Input
                  id="featured_image"
                  value={postData.featured_image}
                  onChange={(e) => setPostData(prev => ({ ...prev, featured_image: e.target.value }))}
                  placeholder="URL da imagem"
                />
              </div>

              <div>
                <Label htmlFor="read_time">Tempo de Leitura (minutos)</Label>
                <Input
                  id="read_time"
                  type="number"
                  min="1"
                  value={postData.read_time}
                  onChange={(e) => setPostData(prev => ({ ...prev, read_time: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={postData.is_published}
                  onCheckedChange={(checked) => setPostData(prev => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="is_published">Publicado</Label>
              </div>
            </CardContent>
          </Card>

          {postData.featured_image && (
            <Card>
              <CardHeader>
                <CardTitle>Preview da Imagem</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={postData.featured_image}
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