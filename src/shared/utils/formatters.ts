/**
 * Utilitários de formatação centralizados
 *
 * Este módulo contém todas as funções de formatação utilizadas no sistema,
 * garantindo consistência e facilitando manutenção.
 */

/**
 * Formata um valor numérico como moeda brasileira (R$)
 *
 * @param value - Valor em centavos a ser formatado
 * @returns String formatada como moeda brasileira
 *
 * @example
 * formatCurrency(1500) // "R$ 15,00"
 * formatCurrency(0) // "R$ 0,00"
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100); // Converter de centavos para reais
};

/**
 * Formata uma data para o padrão brasileiro (dd/mm/aaaa)
 *
 * @param date - Data como Date object ou string ISO
 * @returns String formatada no padrão brasileiro
 *
 * @example
 * formatDate(new Date()) // "25/01/2024"
 * formatDate("2024-01-25T10:30:00Z") // "25/01/2024"
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR").format(dateObj);
};

/**
 * Formata uma data e hora completa para o padrão brasileiro (dd/mm/aaaa hh:mm:ss)
 *
 * @param date - Data como Date object ou string ISO
 * @returns String formatada no padrão brasileiro com data e hora completa
 *
 * @example
 * formatDateTime(new Date()) // "25/01/2024 14:30:45"
 * formatDateTime("2024-01-25T14:30:45Z") // "25/01/2024 14:30:45"
 */
export const formatDateTime = (date: Date | string): string => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(dateObj);
};

/**
 * Formata uma data para input HTML do tipo date (yyyy-mm-dd)
 *
 * @param date - Data como Date object ou string ISO
 * @returns String no formato yyyy-mm-dd
 *
 * @example
 * formatDateForInput(new Date()) // "2024-01-25"
 */
export const formatDateForInput = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().split("T")[0];
};

/**
 * Formata um número de telefone brasileiro
 *
 * @param phone - Número de telefone como string
 * @returns String formatada como telefone brasileiro
 *
 * @example
 * formatPhone("11987654321") // "(11) 98765-4321"
 * formatPhone("1133334444") // "(11) 3333-4444"
 */
export const formatPhone = (phone: string): string => {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, "");

  // Aplica formatação baseada no tamanho
  if (cleaned.length === 11) {
    // Celular: (XX) 9XXXX-XXXX
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    // Fixo: (XX) XXXX-XXXX
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  // Retorna o número original se não conseguir formatar
  return phone;
};

/**
 * Converte valor de reais para centavos
 *
 * @param value - Valor em reais como string ou number
 * @returns Valor em centavos como number
 *
 * @example
 * convertToCents("15,50") // 1550
 * convertToCents(15.5) // 1550
 */
export const convertToCents = (value: string | number): number => {
  const numValue =
    typeof value === "string" ? parseFloat(value.replace(",", ".")) : value;
  return Math.round(numValue * 100);
};

/**
 * Converte valor de centavos para reais
 *
 * @param value - Valor em centavos
 * @returns String formatada em reais com vírgula
 *
 * @example
 * convertToReais(1550) // "15,50"
 */
export const convertToReais = (value: number): string => {
  return (value / 100).toFixed(2).replace(".", ",");
};

/**
 * Formata um preço para exibição (usado em produtos)
 *
 * @param price - Preço em centavos
 * @returns String formatada como moeda
 *
 * @example
 * formatPrice(2500) // "R$ 25,00"
 */
export const formatPrice = (price: number): string => {
  return formatCurrency(price);
};

/**
 * Calcula percentual de um valor em relação ao total
 *
 * @param value - Valor parcial
 * @param total - Valor total
 * @returns Percentual arredondado
 *
 * @example
 * calculatePercentage(25, 100) // 25
 * calculatePercentage(33, 100) // 33
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};
