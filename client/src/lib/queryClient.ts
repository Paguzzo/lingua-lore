import { QueryClient } from '@tanstack/react-query';

const API_BASE = '';

// Generic API request function
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  
  // Debug log para verificar token
  if (endpoint.includes('/api/posts') || endpoint.includes('/api/upload')) {
    console.log(`🔐 API Request to ${endpoint}:`, {
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 10)}...` : 'No token',
      method: options.method || 'GET'
    });
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const url = `${API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, config);
    
    // API request successful
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Default query function for React Query
export const defaultQueryFn = async (context: any) => {
  const [url] = context.queryKey;
  
  // Executing query request
  const token = localStorage.getItem('auth_token');
  
  // Garante que a requisição seja feita com o token de autenticação
  return apiRequest(url);
};

// Configuração do QueryClient com defaultQueryFn
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});