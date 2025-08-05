import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, Calendar, User, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  authorName: string;
  readTime: number;
  categories?: { name: string; color: string };
}

export default function Posts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading: loading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/posts/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: 'Post excluído',
        description: 'O post foi removido com sucesso.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o post.',
        variant: 'destructive',
      });
    }
  });

  const handleDeletePost = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    deletePostMutation.mutate(id);
  };

  const toggleStatusMutation = useMutation({
    mutationFn: async (post: Post) => {
      const newStatus = !post.isPublished;
      return apiRequest(`/api/posts/${post.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          isPublished: newStatus,
          publishedAt: newStatus ? new Date().toISOString() : null
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: 'Status atualizado',
        description: 'O status do post foi alterado com sucesso.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status do post.',
        variant: 'destructive',
      });
    }
  });

  const togglePublishStatus = (post: Post) => {
    toggleStatusMutation.mutate(post);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Posts</h1>
            <p className="text-muted-foreground">Gerencie seus artigos</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Posts</h1>
          <p className="text-muted-foreground">Gerencie seus artigos</p>
        </div>
        <Link to="/admin/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Post
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum post encontrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece criando seu primeiro post para o blog.
            </p>
            <Link to="/admin/posts/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <Badge variant={post.isPublished ? "default" : "secondary"}>
                        {post.isPublished ? "Publicado" : "Rascunho"}
                      </Badge>
                      {post.categories && (
                        <Badge 
                          variant="outline" 
                          style={{ borderColor: post.categories.color }}
                        >
                          {post.categories.name}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {post.excerpt || 'Sem descrição disponível'}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.authorName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(post.createdAt), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.readTime} min de leitura
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublishStatus(post)}
                    >
                      {post.isPublished ? 'Despublicar' : 'Publicar'}
                    </Button>
                    <Link to={`/admin/posts/edit/${post.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}