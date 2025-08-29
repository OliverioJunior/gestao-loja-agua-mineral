import {
  CategoriaDespesa,
  FormaPagamentoDespesa,
} from "@/infrastructure/generated/prisma";
import { CategoriaOption, FormaPagamentoOption } from "./types";

// Formatação de moeda
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100); // Converter de centavos para reais
};

// Formatação de data
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR").format(dateObj);
};

// Formatação de data para input
export const formatDateForInput = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().split("T")[0];
};

// Converter valor de reais para centavos
export const convertToCents = (value: string | number): number => {
  const numValue =
    typeof value === "string" ? parseFloat(value.replace(",", ".")) : value;
  return Math.round(numValue * 100);
};

// Converter valor de centavos para reais
export const convertToReais = (value: number): string => {
  return (value / 100).toFixed(2).replace(".", ",");
};

// Obter texto da categoria
export const getCategoriaText = (categoria: CategoriaDespesa): string => {
  const categoriaMap: Record<CategoriaDespesa, string> = {
    OPERACIONAL: "Operacional",
    ADMINISTRATIVA: "Administrativa",
    MARKETING: "Marketing",
    MANUTENCAO: "Manutenção",
    TRANSPORTE: "Transporte",
    FORNECEDORES: "Fornecedores",
    IMPOSTOS: "Impostos",
    OUTRAS: "Outras",
  };
  return categoriaMap[categoria] || categoria;
};

// Obter cor da categoria
export const getCategoriaColor = (categoria: CategoriaDespesa): string => {
  const colorMap: Record<CategoriaDespesa, string> = {
    OPERACIONAL: "bg-blue-100 text-blue-800",
    ADMINISTRATIVA: "bg-purple-100 text-purple-800",
    MARKETING: "bg-pink-100 text-pink-800",
    MANUTENCAO: "bg-orange-100 text-orange-800",
    TRANSPORTE: "bg-green-100 text-green-800",
    FORNECEDORES: "bg-yellow-100 text-yellow-800",
    IMPOSTOS: "bg-red-100 text-red-800",
    OUTRAS: "bg-gray-100 text-gray-800",
  };
  return colorMap[categoria] || "bg-gray-100 text-gray-800";
};

// Obter texto da forma de pagamento
export const getFormaPagamentoText = (
  formaPagamento: FormaPagamentoDespesa
): string => {
  const formaPagamentoMap: Record<FormaPagamentoDespesa, string> = {
    DINHEIRO: "Dinheiro",
    PIX: "PIX",
    CARTAO_DEBITO: "Cartão de Débito",
    CARTAO_CREDITO: "Cartão de Crédito",
    TRANSFERENCIA: "Transferência",
    BOLETO: "Boleto",
    CHEQUE: "Cheque",
  };
  return formaPagamentoMap[formaPagamento] || formaPagamento;
};

// Obter cor da forma de pagamento
export const getFormaPagamentoColor = (
  formaPagamento: FormaPagamentoDespesa
): string => {
  const colorMap: Record<FormaPagamentoDespesa, string> = {
    DINHEIRO: "bg-green-100 text-green-800",
    PIX: "bg-purple-100 text-purple-800",
    CARTAO_DEBITO: "bg-blue-100 text-blue-800",
    CARTAO_CREDITO: "bg-orange-100 text-orange-800",
    TRANSFERENCIA: "bg-cyan-100 text-cyan-800",
    BOLETO: "bg-yellow-100 text-yellow-800",
    CHEQUE: "bg-gray-100 text-gray-800",
  };
  return colorMap[formaPagamento] || "bg-gray-100 text-gray-800";
};

// Opções de categoria para select
export const categoriaOptions: CategoriaOption[] = [
  { value: "TODAS", label: "Todas as Categorias" },
  { value: "OPERACIONAL", label: "Operacional" },
  { value: "ADMINISTRATIVA", label: "Administrativa" },
  { value: "MARKETING", label: "Marketing" },
  { value: "MANUTENCAO", label: "Manutenção" },
  { value: "TRANSPORTE", label: "Transporte" },
  { value: "FORNECEDORES", label: "Fornecedores" },
  { value: "IMPOSTOS", label: "Impostos" },
  { value: "OUTRAS", label: "Outras" },
];

// Opções de forma de pagamento para select
export const formaPagamentoOptions: FormaPagamentoOption[] = [
  { value: "TODAS", label: "Todas as Formas" },
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "PIX", label: "PIX" },
  { value: "CARTAO_DEBITO", label: "Cartão de Débito" },
  { value: "CARTAO_CREDITO", label: "Cartão de Crédito" },
  { value: "TRANSFERENCIA", label: "Transferência" },
  { value: "BOLETO", label: "Boleto" },
  { value: "CHEQUE", label: "Cheque" },
];

// Validar valor monetário
export const validateCurrency = (value: string): boolean => {
  const regex = /^\d+([,.]\d{1,2})?$/;
  return regex.test(value);
};

// Formatar valor para exibição no input
export const formatCurrencyInput = (value: string): string => {
  // Remove caracteres não numéricos exceto vírgula e ponto
  let cleaned = value.replace(/[^\d,.]/g, "");

  // Substitui ponto por vírgula
  cleaned = cleaned.replace(".", ",");

  // Garante apenas uma vírgula
  const parts = cleaned.split(",");
  if (parts.length > 2) {
    cleaned = parts[0] + "," + parts.slice(1).join("");
  }

  // Limita a 2 casas decimais
  if (parts.length === 2 && parts[1].length > 2) {
    cleaned = parts[0] + "," + parts[1].substring(0, 2);
  }

  return cleaned;
};

// Calcular percentual de uma categoria em relação ao total
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Interface para o retorno da função getCurrentMonthRange
export interface MonthRange {
  firstDay: Date;
  lastDay: Date;
}

// Obter o primeiro e último dia do mês atual
export const getCurrentMonthRange = (): MonthRange => {
  const now = new Date();
  
  // Primeiro dia do mês atual (dia 1, hora 00:00:00)
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Último dia do mês atual (dia 0 do próximo mês, hora 23:59:59)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
  return {
    firstDay,
    lastDay
  };
};
