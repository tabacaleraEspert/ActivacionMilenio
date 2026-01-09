/**
 * Valida el formato de un email
 * Validación simple sin verificación DNS (no requiere backend)
 */

interface EmailValidationResult {
  isValid: boolean;
  message: string;
}

export async function validateEmailExists(
  email: string
): Promise<EmailValidationResult> {
  // Validar formato básico
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: "Ingresá un email válido",
    };
  }

  // Validación adicional: verificar que tenga al menos un punto después del @
  const parts = email.split("@");
  if (parts.length !== 2 || !parts[1].includes(".")) {
    return {
      isValid: false,
      message: "Ingresá un email válido",
    };
  }

  // Si pasa todas las validaciones, es válido
  return {
    isValid: true,
    message: "",
  };
}
