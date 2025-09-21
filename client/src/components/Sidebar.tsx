import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Youtube, Instagram, Mail } from "lucide-react";
import PostCard from "./PostCard";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const subscribeToNewsletter = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'sidebar'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t('sidebar.newsletter.errorSubscription'));
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('sidebar.newsletter.successTitle'),
        description: t('sidebar.newsletter.successDescription'),
      });
      setEmail("");
      setIsSubmitting(false);
    },
    onError: (error: Error) => {
      toast({
        title: t('sidebar.newsletter.errorTitle'),
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    subscribeToNewsletter.mutate(email);
  };

  // Artigos populares
  const popularArticles = [
    {
      id: 1,
      title: t('sidebar.popularArticles.article1.title'),
      excerpt: t('sidebar.popularArticles.article1.excerpt'),
      author: t('sidebar.popularArticles.article1.author'),
      publishedAt: "2024-01-10",
      readTime: t('sidebar.popularArticles.article1.readTime'),
      category: t('sidebar.popularArticles.article1.category'),
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&h=300",
      slug: "10-ferramentas-ia-criador"
    },
    {
      id: 2,
      title: t('sidebar.popularArticles.article2.title'),
      excerpt: t('sidebar.popularArticles.article2.excerpt'),
      author: t('sidebar.popularArticles.article2.author'),
      publishedAt: "2024-01-08",
      readTime: t('sidebar.popularArticles.article2.readTime'),
      category: t('sidebar.popularArticles.article2.category'),
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&h=300",
      slug: "chatgpt-vs-claude-qual-escolher"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Google Ads Space */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xs text-muted-foreground">{t('sidebar.advertisement')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t('sidebar.googleAdsSpace')}
              <br />
              300x250px
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Newsletter */}
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Mail className="h-5 w-5" />
            {t('sidebar.newsletter.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-100 mb-4">
            {t('sidebar.newsletter.description')}
          </p>
          <form onSubmit={handleNewsletterSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder={t('sidebar.newsletter.placeholderEmail')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/20 border-white/30 text-white placeholder:text-purple-200"
            />
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-white text-purple-600 hover:bg-purple-50 disabled:opacity-50"
            >
              {isSubmitting ? t('sidebar.newsletter.submitting') : t('sidebar.newsletter.subscribe')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Posts Populares */}
      <Card>
        <CardHeader>
          <CardTitle>{t('sidebar.popularPosts')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {popularArticles.map((post) => (
            <div key={post.id} className="flex gap-3 pb-4 border-b border-border last:border-b-0 last:pb-0">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-tight mb-1 line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {post.readTime} • {post.publishedAt.split('-')[2]}/{post.publishedAt.split('-')[1]}/{post.publishedAt.split('-')[0]}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Second Google Ads Space */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xs text-muted-foreground">{t('sidebar.advertisement')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t('sidebar.googleAdsSpace')}
              <br />
              300x600px
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Siga-nos */}
      <Card>
        <CardHeader>
          <CardTitle>{t('sidebar.followUs')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <Facebook className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">25.7k</div>
              <div className="text-xs text-muted-foreground">{t('sidebar.socialMedia.facebook')}</div>
            </div>
            <div className="text-center">
              <Twitter className="h-8 w-8 mx-auto mb-2 text-blue-400" />
              <div className="text-sm font-medium">39.3k</div>
              <div className="text-xs text-muted-foreground">{t('sidebar.socialMedia.twitter')}</div>
            </div>
            <div className="text-center">
              <Youtube className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <div className="text-sm font-medium">65.4k</div>
              <div className="text-xs text-muted-foreground">{t('sidebar.socialMedia.youtube')}</div>
            </div>
            <div className="text-center">
              <Instagram className="h-8 w-8 mx-auto mb-2 text-pink-600" />
              <div className="text-sm font-medium">23.9k</div>
              <div className="text-xs text-muted-foreground">Instagram</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;