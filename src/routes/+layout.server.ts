import { redirect, type Cookies } from '@sveltejs/kit';
import { PUBLIC_ROUTES, AUTH_COOKIE_NAME } from '$lib/config/env';

export async function load({ cookies, url, fetch }: { 
  cookies: Cookies; 
  url: URL; 
  fetch: typeof globalThis.fetch 
}) {
  const isPublicRoute = PUBLIC_ROUTES.includes(url.pathname);
  const isAuthRoute = url.pathname.startsWith('/auth/');

  // Se l'utente sta accedendo a una route che richiede autenticazione
  if (!isPublicRoute && !isAuthRoute) {
    // Verifica se esiste un token di autenticazione nei cookies
    const token = cookies.get(AUTH_COOKIE_NAME);
    
    if (!token) {
      // Se non c'è un token, reindirizza alla pagina di login
      throw redirect(302, '/auth/login');
    }
    
    try {
      // Verifica la validità del token con una chiamata al backend
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Se il token non è valido, reindirizza alla pagina di login
        throw redirect(302, '/auth/login');
      }
      
      // Passa le informazioni dell'utente al client
      const userData = await response.json();
      
      return {
        user: userData,
        isAuthenticated: true
      };
    } catch (error) {
      console.error('Errore durante la verifica del token:', error);
      throw redirect(302, '/auth/login');
    }
  }
  
  // Per le route pubbliche, non serve verificare l'autenticazione
  return {
    user: null,
    isAuthenticated: false
  };
}