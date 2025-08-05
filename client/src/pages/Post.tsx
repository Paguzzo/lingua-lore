
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  isPublished: boolean;
  createdAt: string;
  publishedAt: string;
  authorName: string;
  readTime: number;
  categories?: { name: string; color: string };
}

export default function Post() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ['/api/posts/slug', slug],
    queryFn: () => apiRequest(`/api/posts/slug/${slug}`),
    enabled: !!slug,
  });

  const shareUrl = window.location.href;
  const shareTitle = post?.title || '';

  const socialShareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="animate-pulse">
          <div className="h-64 bg-muted"></div>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
          <Link to="/">
            <Button>Voltar para o início</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative h-96 overflow-hidden">
        {/* Blurred Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
          style={{ backgroundImage: `url(${post.featuredImage})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4">
          <Link to="/" className="absolute top-6 left-6">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            {/* Featured Image Overlay */}
            <div className="inline-block">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="max-w-sm md:max-w-md rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Meta + Social Share Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 border-b border-border mb-8">
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min de leitura</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Compartilhe:</span>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={socialShareLinks.facebook} target="_blank" rel="noopener noreferrer">
                <Facebook className="h-4 w-4 text-blue-600" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={socialShareLinks.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4 text-blue-400" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={socialShareLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4 text-blue-700" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={socialShareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 text-green-600" />
              </a>
            </Button>
          </div>
        </div>

        {/* Category Badge */}
        {post.categories && (
          <div className="mb-6">
            <Badge 
              variant="outline" 
              style={{ borderColor: post.categories.color }}
              className="text-sm"
            >
              {post.categories.name}
            </Badge>
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          
          <div className="whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </div>

        {/* Author Info */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
              {post.authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{post.authorName}</p>
              <p className="text-sm text-muted-foreground">Autor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
