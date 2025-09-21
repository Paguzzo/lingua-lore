import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'blog';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = 'https://images.unsplash.com/photo-167744213619-21780ecad995?auto=format&fit=crop&w=1200&h=630',
  url = 'https://criativeai.com',
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags
}) => {
  const { t } = useTranslation();
  
  // Use default values if not provided
  const finalTitle = title || t('seo.defaultTitle');
  const finalDescription = description || t('seo.defaultDescription');
  const finalKeywords = keywords || t('seo.defaultKeywords');
  
  useEffect(() => {
    // Update document title
    document.title = finalTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', finalDescription);
    updateMetaTag('keywords', finalKeywords);
    if (author) updateMetaTag('author', author);

    // Open Graph tags
    updateMetaTag('og:title', finalTitle, true);
    updateMetaTag('og:description', finalDescription, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', t('seo.siteName'), true);
    updateMetaTag('og:locale', 'pt_BR', true);

    // Article specific Open Graph tags
    if (type === 'article') {
      if (author) updateMetaTag('article:author', author, true);
      if (publishedTime) updateMetaTag('article:published_time', publishedTime, true);
      if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime, true);
      if (section) updateMetaTag('article:section', section, true);
      if (tags) {
        // Remove existing article:tag meta tags
        const existingTags = document.querySelectorAll('meta[property="article:tag"]');
        existingTags.forEach(tag => tag.remove());
        
        // Add new tags
        tags.forEach(tag => {
          const meta = document.createElement('meta');
          meta.setAttribute('property', 'article:tag');
          meta.setAttribute('content', tag);
          document.head.appendChild(meta);
        });
      }
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:image:alt', `${finalTitle} - ${t('seo.siteName')}`);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // JSON-LD Structured Data
    const updateStructuredData = () => {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      let structuredData: any = {
        '@context': 'https://schema.org',
        '@type': type === 'article' ? 'BlogPosting' : 'WebSite',
        name: finalTitle,
        description: finalDescription,
        url: url,
        image: image,
        publisher: {
          '@type': 'Organization',
          name: t('seo.siteName'),
          logo: {
            '@type': 'ImageObject',
            url: 'https://criativeai.com/logo.png'
          }
        }
      };

      if (type === 'article') {
        structuredData = {
          ...structuredData,
          '@type': 'BlogPosting',
          headline: finalTitle,
          author: {
            '@type': 'Person',
            name: author || t('seo.siteName')
          },
          datePublished: publishedTime,
          dateModified: modifiedTime || publishedTime,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url
          }
        };

        if (tags) {
          structuredData.keywords = tags.join(', ');
        }
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    };

    updateStructuredData();

    // Cleanup function to remove added meta tags when component unmounts
    return () => {
      // Note: In a real application, you might want to restore original meta tags
      // For now, we'll leave them as they are since this is typically used for page-level SEO
    };
  }, [finalTitle, finalDescription, finalKeywords, image, url, type, author, publishedTime, modifiedTime, section, tags, t]);

  return null; // This component doesn't render anything
};

export default SEO;