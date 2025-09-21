import { useQuery } from '@tanstack/react-query';
import PostCard from "./PostCard";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from 'react-i18next';
import { validateAndFixImageUrl } from '@/lib/imageUtils';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  authorName: string;
  publishedAt: string;
  readTime: number;
  category?: { name: string; color: string };
  featuredImage: string;
  slug: string;
  isPopular?: boolean;
  position?: 'featured' | 'recent' | 'popular';
  isFeatured?: boolean;
}

interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const PostsGrid = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery<PostsResponse>({
    queryKey: ['/api/posts'],
    queryFn: () => apiRequest('/api/posts?published=true'),
  });
  
  const posts = data?.posts || [];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">{t('postsGrid.recentArticles')}</h2>
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
          <h2 className="text-2xl font-bold mb-6">{t('postsGrid.recentArticles')}</h2>
          <p className="text-muted-foreground">{t('postsGrid.noPostsYet')}</p>
        </div>
      </div>
    );
  }

  // Separar posts por categoria/tipo usando o campo position
  const featuredPosts = posts.filter(post => post.position === 'featured' || post.isFeatured);
  const recentPosts = posts.filter(post => post.position === 'recent');
  const popularPosts = posts.filter(post => post.position === 'popular');

  // Se não houver posts com posições específicas, usar fallback
  const allOtherPosts = posts.filter(post => 
    !featuredPosts.includes(post) && 
    !recentPosts.includes(post) && 
    !popularPosts.includes(post)
  );

  // Se não há posts em destaque, usar o primeiro como fallback
  const finalFeaturedPosts = featuredPosts.length > 0 ? featuredPosts.slice(0, 1) : allOtherPosts.slice(0, 1);
  
  // Se não há posts recentes suficientes, preencher com outros
  const finalRecentPosts = recentPosts.length > 0 ? recentPosts.slice(0, 3) : 
    (featuredPosts.length > 0 ? allOtherPosts.slice(0, 3) : allOtherPosts.slice(1, 4));
  
  // Se não há posts populares suficientes, preencher com os restantes
  const finalPopularPosts = popularPosts.length > 0 ? popularPosts.slice(0, 3) : 
    allOtherPosts.filter(post => 
      !finalFeaturedPosts.includes(post) && 
      !finalRecentPosts.includes(post)
    ).slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Post em Destaque */}
      {finalFeaturedPosts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">{t('postsGrid.featuredPost')}</h2>
          <PostCard post={{
            id: parseInt(finalFeaturedPosts[0].id),
            title: finalFeaturedPosts[0].title,
            excerpt: finalFeaturedPosts[0].excerpt || '',
            author: finalFeaturedPosts[0].authorName,
            publishedAt: finalFeaturedPosts[0].publishedAt,
            readTime: `${finalFeaturedPosts[0].readTime} min`,
            category: finalFeaturedPosts[0].category?.name || 'Geral',
            imageUrl: validateAndFixImageUrl(finalFeaturedPosts[0].featuredImage, finalFeaturedPosts[0].title),
            slug: finalFeaturedPosts[0].slug,
            isPopular: false
          }} />
        </div>
      )}

      {/* Artigos Recentes */}
      {finalRecentPosts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">{t('postsGrid.recentArticles')}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {finalRecentPosts.map((post) => (
              <PostCard 
                key={post.id}
                post={{
                  id: parseInt(post.id),
                  title: post.title,
                  excerpt: post.excerpt || '',
                  author: post.authorName,
                  publishedAt: post.publishedAt,
                  readTime: `${post.readTime} min`,
                  category: post.category?.name || 'Geral',
                  imageUrl: validateAndFixImageUrl(post.featuredImage, post.title),
                  slug: post.slug
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Posts Populares */}
      {finalPopularPosts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">{t('postsGrid.popularPosts')}</h2>
          <div className="space-y-4">
            {finalPopularPosts.map((post) => (
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
                  category: post.category?.name || 'Geral',
                  imageUrl: validateAndFixImageUrl(post.featuredImage, post.title),
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