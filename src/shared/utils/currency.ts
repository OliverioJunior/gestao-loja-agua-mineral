/**
 * Utilitários específicos para formatação de moeda
 * 
 * Este módulo contém funções especializadas para formatação de valores monetários
 * onde cada dígito digitado representa centavos.
 */

/**
 * Formata valor monetário onde cada dígito representa centavos
 * 
 * @param value - String com apenas dígitos
 * @returns String formatada como moeda brasileira
 * 
 * @example
 * formatCurrencyFromCents("1") // "0,01"
 * formatCurrencyFromCents("100") // "1,00"
 * formatCurrencyFromCents("1000000") // "10.000,00"
 */
export const formatCurrencyFromCents = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const numericValue = value.replace(/\D/g, "");
  
  if (!numericValue) return "";
  
  // Converte para número (cada dígito é um centavo)
  const cents = parseInt(numericValue, 10);
  
  // Converte centavos para reais (divide por 100)
  const reais = cents / 100;
  
  // Formata como moeda brasileira
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(reais);
};

/**
 * Converte valor formatado de volta para centavos (inteiro)
 * 
 * @param formattedValue - Valor formatado (ex: "10.000,50")
 * @returns Número inteiro representando centavos
 * 
 * @example
 * convertFormattedToCents("0,01") // 1
 * convertFormattedToCents("1,00") // 100
 * convertFormattedToCents("10.000,00") // 1000000
 */
export const convertFormattedToCents = (formattedValue: string): number => {
  if (!formattedValue) return 0;
  
  // Remove pontos (separadores de milhares) e substitui vírgula por ponto
  const normalizedValue = formattedValue
    .replace(/\./g, "") // Remove pontos
    .replace(",", "."); // Substitui vírgula por ponto
  
  const reais = parseFloat(normalizedValue) || 0;
  
  // Converte reais para centavos (multiplica por 100)
  return Math.round(reais * 100);
};

/**
 * Formata valor para exibição no input durante a digitação
 * Cada dígito digitado representa um centavo
 * 
 * @param currentValue - Valor atual do input
 * @param newDigit - Novo dígito digitado
 * @returns Valor formatado para exibição
 * 
 * @example
 * formatCurrencyInput("", "1") // "0,01"
 * formatCurrencyInput("0,01", "0") // "0,10"
 * formatCurrencyInput("0,10", "0") // "1,00"
 */
export const formatCurrencyInput = (currentValue: string, newDigit: string): string => {
  // Remove formatação atual para obter apenas dígitos
  const currentDigits = currentValue.replace(/\D/g, "");
  
  // Adiciona o novo dígito
  const newDigits = currentDigits + newDigit;
  
  // Formata o novo valor
  return formatCurrencyFromCents(newDigits);
};

/**
 * Remove o último dígito do valor formatado
 * 
 * @param formattedValue - Valor formatado atual
 * @returns Valor formatado sem o último dígito
 * 
 * @example
 * removeCurrencyDigit("1,23") // "0,12"
 * removeCurrencyDigit("0,01") // ""
 */
export const removeCurrencyDigit = (formattedValue: string): string => {
  // Remove formatação para obter apenas dígitos
  const digits = formattedValue.replace(/\D/g, "");
  
  if (digits.length <= 1) return "";
  
  // Remove o último dígito
  const newDigits = digits.slice(0, -1);
  
  // Formata o novo valor
  return formatCurrencyFromCents(newDigits);
};

/**
 * Valida se um valor formatado é válido
 * 
 * @param value - Valor a ser validado
 * @returns true se válido, false caso contrário
 */
export const isValidCurrencyValue = (value: string): boolean => {
  if (!value) return true; // Valor vazio é válido
  
  // Verifica se contém apenas dígitos, pontos, vírgulas e espaços
  const regex = /^[\d\s.,]+$/;
  return regex.test(value);
};