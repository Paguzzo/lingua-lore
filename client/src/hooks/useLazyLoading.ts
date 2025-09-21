import { useEffect, useRef, useState } from 'react';

/**
 * Hook para lazy loading de imagens
 * Melhora a performance carregando imagens apenas quando necessário
 */
export const useLazyLoading = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setImageSrc(placeholder || '');
        setIsLoaded(false);
      };
      img.src = src;
    }
  }, [isInView, src, placeholder]);

  return { imageSrc, isLoaded, imgRef };
};

/**
 * Hook para detectar se um elemento está visível na tela
 * Útil para lazy loading de componentes
 */
export const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting && !hasBeenInView) {
          setHasBeenInView(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasBeenInView, options]);

  return { isInView, hasBeenInView, elementRef };
};

/**
 * Hook para preload de recursos críticos
 */
export const usePreloadResources = (resources: string[]) => {
  useEffect(() => {
    resources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      
      // Detectar tipo de recurso
      if (resource.match(/\.(woff2?|ttf|eot)$/)) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      } else if (resource.match(/\.(jpg|jpeg|png|webp|svg)$/)) {
        link.as = 'image';
      } else if (resource.match(/\.(css)$/)) {
        link.as = 'style';
      } else if (resource.match(/\.(js)$/)) {
        link.as = 'script';
      }
      
      document.head.appendChild(link);
    });
  }, [resources]);
};