import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  published: boolean;
  publishedAt?: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function Posts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  interface PostsResponse {
    posts: Post[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  }

  const { data: postsData, isLoading } = useQuery<PostsResponse>({
    queryKey: ['/api/posts'],
  });
  
  const posts = postsData?.posts || [];

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (!response.ok) throw new Error('Erro ao deletar post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Post deletado",
        description: "O post foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível deletar o post.",
        variant: "destructive",
      });
    },
  });

  const handleDeletePost = (postId: string) => {
    if (confirm('Tem certeza que deseja deletar este post?')) {
      deletePostMutation.mutate(postId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground">
            Gerencie seus posts do blog
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Post
        </Button>
      </div>

      <div className="grid gap-4">
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription>
                    {post.excerpt || 'Sem descrição'}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Slug: {post.slug}</span>
                    {post.category && (
                      <Badge variant="secondary">{post.category.name}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Publicado" : "Rascunho"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Criado em: {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                  {post.publishedAt && (
                    <span className="ml-4">
                      Publicado em: {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deletePostMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Nenhum post encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            Comece criando seu primeiro post
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Criar Post
          </Button>
        </div>
      )}
    </div>
  );
}