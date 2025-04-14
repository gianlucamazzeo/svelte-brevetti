import { json, error } from '@sveltejs/kit';
import { API_BASE_URL } from '$lib/config/env';

export async function GET({ request, fetch }) {
  try {
    const authHeader = request.headers.get('Authorization');
    console.log('Tentativo')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw error(401, {
        message: 'Token non valido'
      });
    }
    
    const token = authHeader.substring(7);
    
    // Verifica il token con il backend NestJS
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw error(401, {
        message: 'Token non valido o scaduto'
      });
    }
    
    const userData = await response.json();
    return json(userData);
    
  } catch (err:unknown) {
    console.log('tentativo in catch')
    // Gestisci i casi in cui l'errore è già stato creato con la funzione 'error'
    const errorMessage = error instanceof Error ? error.message : 'Errore durante il login';
    if (errorMessage) {
      throw err;
    }
    
    console.error('Errore durante la verifica del token:', err);
    throw error(500, {
      message: 'Errore durante la verifica del token'
    });
  }
}