import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin, MessageCircle, Mail, Phone, Send, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard';
import { extractYouTubeVideoId, getYouTubeEmbedUrl } from '@/lib/youtube';
import { useAnalytics } from '@/hooks/useAnalytics';
import SEO from '@/components/SEO';
import { validateAndFixImageUrl } from '@/lib/imageUtils';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  videoUrl?: string;
  isPublished: boolean;
  createdAt: string;
  publishedAt: string;
  authorName: string;
  readTime: number;
  category?: { name: string; color: string };
}

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  const { trackPageView } = useAnalytics();

  const { data, isLoading } = useQuery({
    queryKey: ['/api/posts/slug', slug],
    queryFn: () => apiRequest(`/api/posts/slug/${slug}`),
    enabled: !!slug,
  });
  
  const post = data?.post;

  // Track page view when post is loaded
  useEffect(() => {
    if (post?.id) {
      trackPageView(post.id);
    }
  }, [post?.id, trackPageView]);

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
      <SEO 
        title={`${post.title} - CriativeIA`}
        description={post.excerpt || (post.content ? post.content.substring(0, 160) : '')}
        image={validateAndFixImageUrl(post.featuredImage, post.title)}
        url={shareUrl}
        type="article"
        author={post.authorName}
        publishedTime={post.publishedAt || post.createdAt}
        modifiedTime={post.createdAt}
        section={post.category?.name}
        tags={post.category ? [post.category.name] : undefined}
      />
      {/* Hero Section with Blue Background */}
      <div className="relative h-80 overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900">
        {/* Blue gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/90 to-purple-900/90" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-4">
          <Link to="/" className="absolute top-6 left-6">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>

          <div className="max-w-6xl mx-auto w-full">
            {/* Title and Meta centered */}
            <div className="text-white text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-4xl mx-auto">
                {post.title}
              </h1>

              <div className="flex items-center justify-center gap-6 text-sm text-white/80 mb-6">
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

              {post.category && (
                <div className="flex justify-center">
                  <Badge
                    variant="outline"
                    style={{ borderColor: post.category.color, color: post.category.color }}
                    className="text-sm bg-white/10"
                  >
                    {post.category.name}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Social Share Bar */}
        <div className="flex justify-center py-6 border-b border-border mb-8">
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

        {/* Article Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className="prose prose-lg max-w-none">
              {/* Featured Image/Video at the start of the article */}
              <div className="mb-8">
                {post.videoUrl && extractYouTubeVideoId(post.videoUrl) ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      src={getYouTubeEmbedUrl(extractYouTubeVideoId(post.videoUrl)!)}
                      title={post.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <img
                    src={validateAndFixImageUrl(post.featuredImage, post.title)}
                    alt={post.title}
                    className="w-full h-80 object-cover rounded-xl shadow-lg"
                  />
                )}
              </div>

              <div className="space-y-6">
                {/* Article meta info */}
                <div className="space-y-4 pb-6 border-b border-border">
                  <div className="flex items-center space-x-6 text-muted-foreground text-sm">
                    <div className="flex items-center space-x-2">
                      <span>Por {post.authorName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime} min de leitura</span>
                    </div>
                  </div>

                  {post.excerpt && (
                    <p className="text-lg text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-4">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                {/* Google Ads - Top of content */}
                <div className="my-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    PUBLICIDADE
                    <br />
                    Espaço para Google Ads - 728x90px
                  </p>
                </div>

                {/* Article content */}
                <div
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Google Ads - Bottom of content */}
                <div className="my-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    PUBLICIDADE
                    <br />
                    Espaço para Google Ads - 728x90px
                  </p>
                </div>
              </div>
            </article>
          </div>
          <div className="hidden lg:block">
            {/* Google Ads - Sidebar */}
            <div className="sticky top-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground">
                PUBLICIDADE
                <br />
                Espaço para Google Ads - 300x600px
              </p>
            </div>
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

        {/* Contact Section */}
        <ContactSection />

        {/* Related Articles */}
        <RelatedArticles currentPostId={post.id} />
      </div>
    </div>
  );
}

// Contact Section Component
function ContactSection() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria o envio do formulário
    // Processing contact form
    setContactForm({ name: '', email: '', message: '' });
  };

  const whatsappNumber = "5511999999999"; // Isso viria das configurações
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de entrar em contato.')}`;

  return (
    <div className="mt-12 pt-8 border-t bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Entre em Contato</h3>
        <p className="text-muted-foreground">Tem alguma dúvida ou gostaria de conversar sobre este artigo?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* WhatsApp Contact */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Contato Direto</h4>
          <Button
            asChild
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Falar no WhatsApp
            </a>
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Resposta rápida e direta!
          </p>
        </div>

        {/* Contact Form */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Formulário de Contato</h4>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Label htmlFor="contact-name">Nome</Label>
              <Input
                id="contact-name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="contact-message">Mensagem</Label>
              <Textarea
                id="contact-message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={4}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Enviar Mensagem
            </Button>
          </form>
        </div>
      </div>

      <div className="text-center mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground">Até o próximo!</p>
      </div>
    </div>
  );
}

// Related Articles Component
function RelatedArticles({ currentPostId }: { currentPostId: string }) {
  interface PostsResponse {
    posts: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  }

  const { data: relatedData } = useQuery<PostsResponse>({
    queryKey: ['/api/posts/related', currentPostId],
    queryFn: () => apiRequest(`/api/posts?published=true&limit=3&exclude=${currentPostId}`),
  });
  
  const relatedPosts = relatedData?.posts || [];

  if (relatedPosts.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t">
      <h3 className="text-2xl font-bold mb-6 text-center">Artigos Relacionados</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {relatedPosts.map((post: any) => (
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
              slug: post.slug
            }}
          />
        ))}
      </div>
    </div>
  );
}