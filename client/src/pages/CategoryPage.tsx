import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import PostCard from '@/components/PostCard';
import { PageHeader } from '@/components/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  imageUrl: string;
  slug: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);

  // Buscar todas as categorias
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: () => apiRequest('/api/categories'),
  });

  interface PostsResponse {
    posts: Post[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  }

  // Buscar posts da categoria específica
  const { data: postsData, isLoading: postsLoading, error } = useQuery<PostsResponse>({
    queryKey: ['/api/posts', { category: slug, published: true }],
    queryFn: () => apiRequest(`/api/posts?category=${slug}&published=true`),
    enabled: !!slug,
  });
  
  const posts = postsData?.posts || [];

  // Encontrar a categoria atual pelo slug
  useEffect(() => {
    if (!categoriesLoading && categories.length > 0 && slug) {
      const currentCategory = categories.find(cat => cat.slug === slug);
      if (currentCategory) {
        setCategory(currentCategory);
      }
    }
  }, [categories, categoriesLoading, slug]);

  // Usar diretamente os posts retornados da API, que já estão filtrados pelo slug da categoria
  const filteredPosts = posts;

  // Mapear posts para o formato esperado pelo PostCard
  const formattedPosts = filteredPosts.map(post => ({
    id: typeof post.id === 'string' ? parseInt(post.id) : post.id,
    title: post.title,
    excerpt: post.excerpt,
    author: post.author || 'Admin',
    publishedAt: post.publishedAt || new Date().toISOString(),
    readTime: post.readTime || '5 min',
    category: category?.name || 'Geral',
    imageUrl: post.imageUrl || '/placeholder.jpg',
    slug: post.slug,
    isPopular: false
  }));

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Não foi possível carregar os posts desta categoria. Por favor, tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      {categoriesLoading || !category ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-6 w-full max-w-[600px]" />
        </div>
      ) : (
        <PageHeader
          title={category.name}
          description={category.description || `Todos os artigos sobre ${category.name}`}
          color={category.color}
        />
      )}

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postsLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))
        ) : formattedPosts.length > 0 ? (
          formattedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <h3 className="text-xl font-medium mb-2">Nenhum artigo encontrado</h3>
            <p className="text-muted-foreground">
              Ainda não há artigos publicados nesta categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}