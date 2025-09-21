/**
 * Extrai a URL direta de uma imagem do Google Images ou outras fontes
 */
export function extractDirectImageUrl(url: string): string {
  if (!url) return '';
  
  try {
    // Se já é uma URL direta, retorna como está
    if (isDirectImageUrl(url)) {
      return url;
    }
    
    // Tenta extrair da URL do Google Images
    if (url.includes('google.com/imgres')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const imgurl = urlParams.get('imgurl');
      if (imgurl) {
        return decodeURIComponent(imgurl);
      }
    }
    
    // Tenta extrair de outros parâmetros comuns
    if (url.includes('imgurl=')) {
      const match = url.match(/imgurl=([^&]+)/);
      if (match) {
        return decodeURIComponent(match[1]);
      }
    }
    
    // Se não conseguir extrair, retorna a URL original
    return url;
  } catch (error) {
    console.warn('Erro ao extrair URL da imagem:', error);
    return url;
  }
}

/**
 * Verifica se uma URL aponta diretamente para uma imagem
 */
export function isDirectImageUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname.toLowerCase();
    
    // Verifica extensões de imagem comuns
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    return imageExtensions.some(ext => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

/**
 * Gera uma URL de fallback para imagens quebradas
 */
export function getImageFallback(title?: string): string {
  // Use a diverse set of tech/AI related images from Unsplash
  const fallbackImages = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&h=400&q=80',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&h=400&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=600&h=400&q=80',
    'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=600&h=400&q=80',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&h=400&q=80'
  ];
  
  // Use title hash to consistently select the same image for the same title
  const titleHash = title ? 
    title.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0) : 0;
  const imageIndex = Math.abs(titleHash) % fallbackImages.length;
  
  return fallbackImages[imageIndex];
}

/**
 * Valida e corrige URLs de imagem
 */
export function validateAndFixImageUrl(url: string, fallbackTitle?: string): string {
  if (!url) return getImageFallback(fallbackTitle);
  
  const directUrl = extractDirectImageUrl(url);
  
  // Se a URL extraída parece válida, usa ela
  if (isDirectImageUrl(directUrl)) {
    return directUrl;
  }
  
  // Se ainda não é uma URL direta mas parece ser uma imagem, tenta usar como está
  if (directUrl.includes('http') && !directUrl.includes('google.com/imgres')) {
    return directUrl;
  }
  
  // Caso contrário, usa fallback
  return getImageFallback(fallbackTitle);
}