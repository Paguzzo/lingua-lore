
import { useQuery } from '@tanstack/react-query';
import PostCard from "./PostCard";
import { apiRequest } from "@/lib/queryClient";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  authorName: string;
  publishedAt: string;
  readTime: number;
  categories?: { name: string; color: string };
  featuredImage: string;
  slug: string;
  isPopular?: boolean;
}

const PostsGrid = () => {
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
    queryFn: () => apiRequest('/api/posts?published=true'),
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Artigos Recentes</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-32 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-muted h-4 rounded w-3/4"></div>
                  <div className="bg-muted h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Artigos Recentes</h2>
          <p className="text-muted-foreground">Nenhum post publicado ainda.</p>
        </div>
      </div>
    );
  }

  // Separar posts por categoria/tipo
  const featuredPosts = posts.slice(0, 1); // Primeiro post como destaque
  const recentPosts = posts.slice(1, 4); // Próximos 3 como recentes
  const popularPosts = posts.slice(4, 7); // Próximos 3 como populares

  return (
    <div className="space-y-12">
      {/* Post em Destaque */}
      {featuredPosts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Post em Destaque</h2>
          <PostCard post={{
            id: parseInt(featuredPosts[0].id),
            title: featuredPosts[0].title,
            excerpt: featuredPosts[0].excerpt || '',
            author: featuredPosts[0].authorName,
            publishedAt: featuredPosts[0].publishedAt,
            readTime: `${featuredPosts[0].readTime} min`,
            category: featuredPosts[0].categories?.name || 'Geral',
            imageUrl: featuredPosts[0].featuredImage || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&h=400',
            slug: featuredPosts[0].slug,
            isPopular: true
          }} />
        </div>
      )}

      {/* Artigos Recentes */}
      {recentPosts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Artigos Recentes</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {recentPosts.map((post) => (
              <PostCard 
                key={post.id}
                variant="horizontal"
                post={{
                  id: parseInt(post.id),
                  title: post.title,
                  excerpt: post.excerpt || '',
                  author: post.authorName,
                  publishedAt: post.publishedAt,
                  readTime: `${post.readTime} min`,
                  category: post.categories?.name || 'Geral',
                  imageUrl: post.featuredImage || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&h=400',
                  slug: post.slug
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Posts Populares */}
      {popularPosts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Posts Populares</h2>
          <div className="space-y-4">
            {popularPosts.map((post) => (
              <PostCard 
                key={post.id}
                variant="minimal"
                post={{
                  id: parseInt(post.id),
                  title: post.title,
                  excerpt: post.excerpt || '',
                  author: post.authorName,
                  publishedAt: post.publishedAt,
                  readTime: `${post.readTime} min`,
                  category: post.categories?.name || 'Geral',
                  imageUrl: post.featuredImage || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&h=400',
                  slug: post.slug,
                  isPopular: true
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsGrid;
