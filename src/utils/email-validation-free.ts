/**
 * Validación de email GRATIS sin API externa
 * 
 * Cómo funcionan las empresas que cobran:
 * 1. Verifican formato (regex) ✅ Podemos hacerlo
 * 2. Verifican DNS/MX records ✅ Podemos hacerlo (desde backend)
 * 3. Verifican SMTP (conectan al servidor) ⚠️ Difícil desde frontend
 * 4. Detectan emails desechables ✅ Podemos hacerlo (lista)
 * 5. Rate limiting y IPs confiables ⚠️ Requiere infraestructura
 * 
 * LIMITACIONES de hacerlo gratis:
 * - No podemos verificar SMTP desde el navegador (CORS/seguridad)
 * - Los servidores SMTP bloquean conexiones de IPs desconocidas
 * - Menos preciso que servicios profesionales
 * 
 * Esta versión hace validación básica sin API:
 * - Formato válido
 * - Dominio existe (DNS check - requiere backend)
 * - Lista de emails desechables
 */

interface EmailValidationResult {
  isValid: boolean;
  message: string;
}

// Lista de dominios de emails desechables/temporales
const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com',
  'tempmail.com',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
  'temp-mail.org',
  'getnada.com',
  'mohmal.com',
  'yopmail.com',
  'maildrop.cc',
  'trashmail.com',
  'sharklasers.com',
  'getairmail.com',
  'mintemail.com',
  'mytrashmail.com',
  'fakeinbox.com',
  'dispostable.com',
  'emailondeck.com',
  'mailcatch.com',
  'spamgourmet.com',
  // Agregar más según necesidad
];

/**
 * Valida formato de email
 */
function isValidFormat(email: string): boolean {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

/**
 * Verifica si el dominio es desechable
 */
function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return DISPOSABLE_EMAIL_DOMAINS.includes(domain || '');
}

/**
 * Valida email usando solo verificación local (sin API)
 * 
 * Esta función hace validación básica:
 * - Formato válido
 * - No es email desechable
 * 
 * Para verificación completa de DNS/MX, necesitarías un backend
 * que haga la consulta DNS (los navegadores no pueden hacerlo directamente)
 */
export async function validateEmailFree(
  email: string
): Promise<EmailValidationResult> {
  // 1. Validar formato
  if (!isValidFormat(email)) {
    return {
      isValid: false,
      message: "Ingresá un email válido",
    };
  }

  // 2. Verificar si es email desechable
  if (isDisposableEmail(email)) {
    return {
      isValid: false,
      message: "No se permiten emails temporales. Por favor, usá un email real.",
    };
  }

  // 3. Validaciones adicionales básicas
  const domain = email.split('@')[1]?.toLowerCase();
  
  // Verificar que el dominio no sea muy corto (probablemente inválido)
  if (domain && domain.length < 4) {
    return {
      isValid: false,
      message: "El dominio del email parece inválido",
    };
  }

  // Verificar que no tenga caracteres sospechosos
  if (domain && /[^a-z0-9.-]/.test(domain)) {
    return {
      isValid: false,
      message: "El dominio del email contiene caracteres inválidos",
    };
  }

  // Si pasó todas las validaciones básicas, aceptar
  // NOTA: No podemos verificar DNS/MX desde el frontend sin backend
  return {
    isValid: true,
    message: "",
  };
}

/**
 * Función para verificar DNS/MX desde un backend
 * 
 * Si tenés un backend, podés crear un endpoint que haga esto:
 * 
 * Node.js ejemplo:
 * ```javascript
 * const dns = require('dns').promises;
 * 
 * async function checkMX(domain) {
 *   try {
 *     const records = await dns.resolveMx(domain);
 *     return records.length > 0;
 *   } catch {
 *     return false;
 *   }
 * }
 * ```
 * 
 * Luego llamar desde el frontend:
 * ```typescript
 * const response = await fetch('/api/verify-email', {
 *   method: 'POST',
 *   body: JSON.stringify({ email })
 * });
 * ```
 */
export async function validateEmailWithBackend(
  email: string,
  backendUrl?: string
): Promise<EmailValidationResult> {
  // Primero validación local
  const localValidation = await validateEmailFree(email);
  if (!localValidation.isValid) {
    return localValidation;
  }

  // Si hay backend configurado, verificar DNS/MX
  if (backendUrl) {
    try {
      const response = await fetch(`${backendUrl}/api/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        // Si falla el backend, permitir el email
        return { isValid: true, message: '' };
      }

      const data = await response.json();
      if (!data.valid) {
        return {
          isValid: false,
          message: "No se encontró casilla de mail. Por favor, ingresá un email válido y real.",
        };
      }

      return { isValid: true, message: '' };
    } catch (error) {
      // Si hay error, permitir el email
      console.error('Error verificando email en backend:', error);
      return { isValid: true, message: '' };
    }
  }

  return { isValid: true, message: '' };
}
