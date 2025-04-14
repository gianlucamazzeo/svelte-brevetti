
// $lib/utils/auth-loggers.ts
import { logger } from '$lib/utils/logger';

// Logger specifico per le operazioni di login
export const loginLogger = logger.withPrefix('Auth:Login');

// Logger per operazioni generali di autenticazione
export const authLogger = logger.withPrefix('Auth');

// Logger per API di autenticazione
export const authApiLogger = logger.withPrefix('Auth:API');