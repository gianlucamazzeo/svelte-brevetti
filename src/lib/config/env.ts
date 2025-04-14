

// Rotte pubbliche che non richiedono autenticazione
export const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password'
];

// Nome del cookie di autenticazione
export const AUTH_COOKIE_NAME = 'auth-token';

// Durata del token di autenticazione in giorni
export const AUTH_TOKEN_DURATION_DAYS = 7;

// URL base dell'API (usa la variabile d'ambiente se disponibile)
export const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

// Timeout per le richieste API in millisecondi
export const API_TIMEOUT = 30000;

// Percorso di reindirizzamento dopo il login riuscito
export const POST_LOGIN_REDIRECT = '/';

// Percorso di reindirizzamento dopo il logout
export const POST_LOGOUT_REDIRECT = '/auth/login';