import React from 'react';
import { useLazyLoading } from '@/hooks/useLazyLoading';
import { cn } from '@/lib/utils';
import { getOptimizedImageUrl, getImageQualityForConnection, getAnimationDuration } from '@/lib/performance';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  fallback?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  className,
  fallback = '/placeholder-image.svg',
  aspectRatio = 'auto',
  ...props
}) => {
  // Otimizar URL da imagem baseado na conexão
  const quality = getImageQualityForConnection();
  const optimizedSrc = getOptimizedImageUrl(src, undefined, quality);
  const { imageSrc, isLoaded, imgRef } = useLazyLoading(optimizedSrc, placeholder);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: '',
  };

  return (
    <div className={cn('relative overflow-hidden', aspectRatioClasses[aspectRatio])}>
      <img
        ref={imgRef}
        src={imageSrc || fallback}
        alt={alt}
        className={cn(
          'object-cover w-full h-full',
          `transition-opacity duration-${getAnimationDuration(300)}`,
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        loading="lazy"
        decoding="async"
        {...props}
      />
      
      {/* Skeleton loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      )}
      
      {/* Blur placeholder */}
      {placeholder && !isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110 opacity-50"
          style={{ backgroundImage: `url(${placeholder})` }}
        />
      )}
    </div>
  );
};

export default LazyImage;