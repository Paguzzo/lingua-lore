import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

const API_BASE = '';

// Generic API request function
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Default query function for React Query
export const defaultQueryFn = async ({ queryKey }: { queryKey: string[] }) => {
  const [url] = queryKey;
  return apiRequest(url);
};

// Set the default query function
queryClient.setQueryDefaults([], {
  queryFn: defaultQueryFn,
});