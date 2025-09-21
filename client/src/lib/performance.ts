/**
 * Utilitários para otimização de performance e Core Web Vitals
 */

// Função para medir e reportar Core Web Vitals
export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onINP(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

// Função para preload de recursos críticos
export const preloadCriticalResources = () => {
  const criticalResources = [
    '/fonts/inter-var.woff2',
    '/images/hero-bg.webp',
  ];

  criticalResources.forEach((resource) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    
    if (resource.includes('.woff')) {
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
    } else if (resource.includes('.webp') || resource.includes('.jpg') || resource.includes('.png')) {
      link.as = 'image';
    }
    
    document.head.appendChild(link);
  });
};

// Função para otimizar imagens com base no dispositivo
export const getOptimizedImageUrl = (baseUrl: string, width?: number, quality = 80) => {
  if (!baseUrl) return '';
  
  // Se a URL já contém parâmetros de otimização, retorna como está
  if (baseUrl.includes('?') && (baseUrl.includes('w=') || baseUrl.includes('q='))) {
    return baseUrl;
  }
  
  const devicePixelRatio = window.devicePixelRatio || 1;
  const optimizedWidth = width ? Math.round(width * devicePixelRatio) : undefined;
  
  // Para URLs do Unsplash ou similares
  if (baseUrl.includes('unsplash.com')) {
    const params = new URLSearchParams();
    if (optimizedWidth) params.set('w', optimizedWidth.toString());
    params.set('q', quality.toString());
    params.set('fm', 'webp');
    return `${baseUrl}?${params.toString()}`;
  }
  
  // Para outras URLs, retorna como está (pode ser expandido para outros serviços)
  return baseUrl;
};

// Função para detectar conexão lenta
export const isSlowConnection = (): boolean => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
  }
  return false;
};

// Função para reduzir qualidade de imagens em conexões lentas
export const getImageQualityForConnection = (): number => {
  if (isSlowConnection()) {
    return 60; // Qualidade reduzida para conexões lentas
  }
  return 80; // Qualidade padrão
};

// Debounce para otimizar eventos de scroll e resize
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle para limitar execução de funções
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Função para medir performance de componentes
export const measureComponentPerformance = (componentName: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${componentName} render time: ${end - start}ms`);
  }
};

// Função para detectar se o usuário prefere movimento reduzido
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Função para otimizar animações baseado na preferência do usuário
export const getAnimationDuration = (defaultDuration: number): number => {
  return prefersReducedMotion() ? 0 : defaultDuration;
};