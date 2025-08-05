import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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
  is_published: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  author_name: string;
  read_time: number;
  categories?: { name: string; color: string };
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (
            name,
            color
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os posts.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPosts(posts.filter(post => post.id !== id));
      toast({
        title: 'Post excluído',
        description: 'O post foi removido com sucesso.',
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o post.',
        variant: 'destructive',
      });
    }
  };

  const togglePublishStatus = async (post: Post) => {
    try {
      const newStatus = !post.is_published;
      const updateData: any = {
        is_published: newStatus,
      };

      if (newStatus && !post.published_at) {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', post.id);

      if (error) throw error;

      setPosts(posts.map(p => 
        p.id === post.id 
          ? { ...p, is_published: newStatus, published_at: updateData.published_at || p.published_at }
          : p
      ));

      toast({
        title: newStatus ? 'Post publicado' : 'Post despublicado',
        description: `O post foi ${newStatus ? 'publicado' : 'removido da publicação'} com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating post status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status do post.',
        variant: 'destructive',
      });
    }
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
                      <Badge variant={post.is_published ? "default" : "secondary"}>
                        {post.is_published ? "Publicado" : "Rascunho"}
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
                        {post.author_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(post.created_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.read_time} min de leitura
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublishStatus(post)}
                    >
                      {post.is_published ? 'Despublicar' : 'Publicar'}
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