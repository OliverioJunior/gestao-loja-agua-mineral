/**
 * Utilitários de validação centralizados
 *
 * Este módulo contém todas as funções de validação utilizadas no sistema,
 * garantindo consistência nas regras de negócio e facilitando manutenção.
 */

/**
 * Valida se um email possui formato válido
 *
 * @param email - Email a ser validado
 * @returns true se o email for válido, false caso contrário
 *
 * @example
 * validateEmail("user@example.com") // true
 * validateEmail("invalid-email") // false
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
};

/**
 * Valida se um telefone brasileiro possui formato válido
 *
 * @param phone - Telefone a ser validado
 * @returns true se o telefone for válido, false caso contrário
 *
 * @example
 * validatePhone("11987654321") // true
 * validatePhone("1133334444") // true
 * validatePhone("123") // false
 */
export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  // Aceita telefones com 10 dígitos (fixo) ou 11 dígitos (celular)
  return cleaned.length === 10 || cleaned.length === 11;
};

/**
 * Valida se um CPF possui formato válido (apenas formato, não verifica dígitos)
 *
 * @param cpf - CPF a ser validado
 * @returns true se o formato for válido, false caso contrário
 *
 * @example
 * validateCPFFormat("123.456.789-00") // true
 * validateCPFFormat("12345678900") // true
 * validateCPFFormat("123") // false
 */
export const validateCPFFormat = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, "");
  return cleaned.length === 11;
};

/**
 * Valida se um CNPJ possui formato válido (apenas formato, não verifica dígitos)
 *
 * @param cnpj - CNPJ a ser validado
 * @returns true se o formato for válido, false caso contrário
 *
 * @example
 * validateCNPJFormat("12.345.678/0001-00") // true
 * validateCNPJFormat("12345678000100") // true
 * validateCNPJFormat("123") // false
 */
export const validateCNPJFormat = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/\D/g, "");
  return cleaned.length === 14;
};

/**
 * Valida se um CEP possui formato válido
 *
 * @param cep - CEP a ser validado
 * @returns true se o formato for válido, false caso contrário
 *
 * @example
 * validateCEP("12345-678") // true
 * validateCEP("12345678") // true
 * validateCEP("123") // false
 */
export const validateCEP = (cep: string): boolean => {
  const cleaned = cep.replace(/\D/g, "");
  return cleaned.length === 8;
};

/**
 * Valida se um valor monetário é válido
 *
 * @param value - Valor a ser validado
 * @returns true se o valor for válido, false caso contrário
 *
 * @example
 * validateCurrency("15,50") // true
 * validateCurrency("15.50") // true
 * validateCurrency("abc") // false
 */
export const validateCurrency = (value: string): boolean => {
  const regex = /^\d+([,.])\d{1,2}?$/;
  return regex.test(value);
};

/**
 * Valida se uma senha atende aos critérios mínimos de segurança
 *
 * @param password - Senha a ser validada
 * @param minLength - Comprimento mínimo (padrão: 8)
 * @returns Objeto com resultado da validação e mensagens de erro
 *
 * @example
 * validatePassword("MinhaSenh@123") // { isValid: true, errors: [] }
 * validatePassword("123") // { isValid: false, errors: ["Senha deve ter pelo menos 8 caracteres"] }
 */
export const validatePassword = (
  password: string,
  minLength: number = 8
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < minLength) {
    errors.push(`Senha deve ter pelo menos ${minLength} caracteres`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Senha deve conter pelo menos uma letra maiúscula");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Senha deve conter pelo menos uma letra minúscula");
  }

  if (!/\d/.test(password)) {
    errors.push("Senha deve conter pelo menos um número");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Senha deve conter pelo menos um caractere especial");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida se um campo obrigatório não está vazio
 *
 * @param value - Valor a ser validado
 * @param fieldName - Nome do campo para mensagem de erro
 * @returns Objeto com resultado da validação
 *
 * @example
 * validateRequired("João", "Nome") // { isValid: true, error: null }
 * validateRequired("", "Nome") // { isValid: false, error: "Nome é obrigatório" }
 */
export const validateRequired = (
  value: string | null | undefined,
  fieldName: string
): { isValid: boolean; error: string | null } => {
  const isValid =
    value !== null && value !== undefined && value.trim().length > 0;
  return {
    isValid,
    error: isValid ? null : `${fieldName} é obrigatório`,
  };
};

/**
 * Valida se um número está dentro de um intervalo específico
 *
 * @param value - Valor a ser validado
 * @param min - Valor mínimo (inclusivo)
 * @param max - Valor máximo (inclusivo)
 * @returns true se o valor estiver no intervalo, false caso contrário
 *
 * @example
 * validateNumberRange(5, 1, 10) // true
 * validateNumberRange(15, 1, 10) // false
 */
export const validateNumberRange = (
  value: number,
  min: number,
  max: number
): boolean => {
  return value >= min && value <= max;
};

/**
 * Valida se uma string tem comprimento dentro do intervalo especificado
 *
 * @param value - String a ser validada
 * @param minLength - Comprimento mínimo
 * @param maxLength - Comprimento máximo
 * @returns Objeto com resultado da validação
 *
 * @example
 * validateStringLength("João", 2, 50) // { isValid: true, error: null }
 * validateStringLength("A", 2, 50) // { isValid: false, error: "Deve ter entre 2 e 50 caracteres" }
 */
export const validateStringLength = (
  value: string,
  minLength: number,
  maxLength: number
): { isValid: boolean; error: string | null } => {
  const length = value.trim().length;
  const isValid = length >= minLength && length <= maxLength;

  return {
    isValid,
    error: isValid
      ? null
      : `Deve ter entre ${minLength} e ${maxLength} caracteres`,
  };
};
