/**
 * Extrai o ID do vídeo do YouTube de uma URL
 * @param url - URL do vídeo do YouTube
 * @returns ID do vídeo ou null se inválido
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Gera URL de embed do YouTube
 * @param videoId - ID do vídeo do YouTube
 * @returns URL de embed
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&modestbranding=1`;
}

/**
 * Gera URL de thumbnail do YouTube
 * @param videoId - ID do vídeo do YouTube
 * @param quality - Qualidade da thumbnail (default, mqdefault, hqdefault, sddefault, maxresdefault)
 * @returns URL da thumbnail
 */
export function getYouTubeThumbnail(videoId: string, quality: string = 'hqdefault'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Verifica se uma URL é um vídeo do YouTube válido
 * @param url - URL para verificar
 * @returns true se for um vídeo do YouTube válido
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}