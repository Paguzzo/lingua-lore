import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import PostCard from './PostCard';
import { Skeleton } from './ui/skeleton';
import { apiRequest } from '@/lib/queryClient';

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

interface CategoriesResponse {
  categories: Category[];
}

interface Props {
  categorySlug: string;
}

export default function CategoryPostList({ categorySlug }: Props) {
  const { data: categoriesData, isLoading: catLoading } = useQuery<CategoriesResponse>({
    queryKey: ['/api/categories'],
    queryFn: () => apiRequest('/api/categories'),
    staleTime: 60000, // 1 minuto
  });
  
  const categories = categoriesData?.categories || [];

  interface PostsResponse {
    posts: Post[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  }

  const { data: postsData, isLoading: postsLoading } = useQuery<PostsResponse>({
    queryKey: ['/api/posts', { category: categorySlug, published: true }],
    queryFn: () => apiRequest(`/api/posts?category=${categorySlug}&published=true`),
    enabled: !!categorySlug,
  });
  
  const posts = postsData?.posts || [];

  const category = categories.find(cat => cat.slug === categorySlug);

  // Ordenar posts por data de publicação (mais recentes primeiro)
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt || 0);
    const dateB = new Date(b.publishedAt || b.createdAt || 0);
    return dateB.getTime() - dateA.getTime();
  });

  const formattedPosts = sortedPosts.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    author: post.author || 'Admin',
    publishedAt: post.publishedAt,
    readTime: post.readTime || '5 min',
    category: category?.name || 'Geral',
    imageUrl: post.imageUrl || '/placeholder.jpg',
    slug: post.slug,
    isPopular: false
  }));

  if (catLoading || postsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!category) {
    return <p className="text-center py-10">Categoria não encontrada.</p>;
  }

  if (formattedPosts.length === 0) {
    return (
      <div className="col-span-full text-center py-10">
        <h3 className="text-xl font-medium mb-2">Nenhum artigo encontrado</h3>
        <p className="text-muted-foreground">Ainda não há artigos publicados nesta categoria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {formattedPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}