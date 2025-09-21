import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { apiRequest } from '@/lib/queryClient';
import { PageHeader } from '@/components/PageHeader';
import CategoryPostList from '@/components/CategoryPostList';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
}

const CATEGORY_SLUG = 'ia-criativa';

export default function IaCriativa() {
  const { data: category, isLoading } = useQuery<Category>({
    queryKey: ['category', CATEGORY_SLUG],
    queryFn: () => apiRequest(`/api/categories?slug=${CATEGORY_SLUG}`).then(res => res[0]),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {isLoading || !category ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-6 w-full max-w-[600px]" />
          </div>
        ) : (
          <PageHeader
            title={category.name}
            description={category.description || `Descubra os melhores artigos sobre ${category.name.toLowerCase()}`}
            color={category.color}
          />
        )}

        <div className="mt-12 md:mt-16">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Artigos Recentes</h2>
            <p className="text-muted-foreground">Explore nosso conteúdo mais recente sobre esta categoria</p>
          </div>
          <CategoryPostList categorySlug={CATEGORY_SLUG} />
        </div>
      </div>
    </div>
  );
}