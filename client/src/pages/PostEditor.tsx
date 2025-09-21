import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Save, ArrowLeft, Eye, FileText, Tag, Calendar, User } from "lucide-react";
import ImageSelector from "@/components/ImageSelector";

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  status: 'draft' | 'published';
  categoryId: string;
  authorId: string;
  tags: string[];
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function PostEditor() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/posts/edit/:id");
  const [isNewPost] = useRoute("/posts/new");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const postId = params?.id;
  const isEditing = match && postId;
  
  const [post, setPost] = useState<Partial<Post>>({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    status: 'draft',
    categoryId: '',
    tags: [],
    featuredImage: ''
  });
  
  const [newTag, setNewTag] = useState('');

  // Buscar post existente se estiver editando
  const { data: existingPost, isLoading: isLoadingPost } = useQuery<Post>({
    queryKey: [`/api/posts/${postId}`],
    queryFn: () => {
      // Simulando busca de post
      return Promise.resolve({
        id: postId || '1',
        title: 'Post de Exemplo',
        content: 'Conteúdo do post...',
        excerpt: 'Resumo do post',
        slug: 'post-exemplo',
        status: 'draft' as const,
        categoryId: '1',
        authorId: '1',
        tags: ['exemplo', 'blog'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    },
    enabled: !!isEditing
  });

  // Buscar categorias
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: () => {
      // Simulando busca de categorias
      return Promise.resolve([
        { id: '1', name: 'Tecnologia', slug: 'tecnologia' },
        { id: '2', name: 'Cultura', slug: 'cultura' },
        { id: '3', name: 'Linguagens', slug: 'linguagens' }
      ]);
    }
  });

  // Carregar dados do post existente
  useEffect(() => {
    if (existingPost) {
      setPost(existingPost);
    }
  }, [existingPost]);

  // Mutation para salvar post
  const savePostMutation = useMutation({
    mutationFn: async (postData: Partial<Post>) => {
      // Simulando salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { ...postData, id: postId || Date.now().toString() };
    },
    onSuccess: (savedPost) => {
      toast({
        title: "Post salvo",
        description: `O post "${savedPost.title}" foi salvo com sucesso.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      if (isNewPost) {
        setLocation(`/posts/edit/${savedPost.id}`);
      }
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o post.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!post.title || !post.content) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e conteúdo são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    // Gerar slug automaticamente se não existir
    const slug = post.slug || post.title?.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    savePostMutation.mutate({ ...post, slug });
  };

  const handleInputChange = (field: keyof Post, value: any) => {
    setPost(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !post.tags?.includes(newTag.trim())) {
      setPost(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (isLoadingPost) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Editar Post' : 'Novo Post'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Edite as informações do post' : 'Crie um novo post para o blog'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setLocation('/posts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={handleSave} disabled={savePostMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {savePostMutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conteúdo Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Conteúdo do Post
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={post.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Digite o título do post"
                  className="text-lg font-medium"
                />
              </div>
              
              <div>
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  value={post.excerpt || ''}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Breve descrição do post"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="content">Conteúdo *</Label>
                <Textarea
                  id="content"
                  value={post.content || ''}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Escreva o conteúdo do post aqui..."
                  rows={15}
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status e Publicação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Publicação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Status</Label>
                <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                  {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="published">Publicar</Label>
                <Switch
                  id="published"
                  checked={post.status === 'published'}
                  onCheckedChange={(checked) => 
                    handleInputChange('status', checked ? 'published' : 'draft')
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Categoria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={post.categoryId || ''}
                onValueChange={(value) => handleInputChange('categoryId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Adicione tags para organizar o post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nova tag"
                  className="flex-1"
                />
                <Button size="sm" onClick={addTag}>
                  Adicionar
                </Button>
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Metadados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={post.slug || ''}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="url-do-post"
                />
              </div>
              
              <ImageSelector
                currentImage={post.featuredImage}
                onImageSelect={(imageUrl) => handleInputChange('featuredImage', imageUrl)}
                placeholder="Selecione uma imagem em destaque"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}