/**
 * Utilitários de status centralizados
 *
 * Este módulo contém todas as funções relacionadas a status e cores utilizadas no sistema,
 * garantindo consistência visual e facilitando manutenção.
 */

import {
  Status,
  StatusPedido,
  CategoriaDespesa,
  FormaPagamentoDespesa,
} from "@/infrastructure/generated/prisma";

/**
 * Configurações de cores para diferentes tipos de status
 */
const STATUS_COLORS = {
  // Status gerais (ATIVO/INATIVO)
  ATIVO: "bg-green-100 text-green-800 border-green-200",
  INATIVO: "bg-red-100 text-red-800 border-red-200",

  // Status de pedidos
  PENDENTE: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMADO: "bg-blue-100 text-blue-800 border-blue-200",
  ENTREGUE: "bg-green-100 text-green-800 border-green-200",
  CANCELADO: "bg-red-100 text-red-800 border-red-200",

  // Status de produtos (boolean)
  TRUE: "bg-green-100 text-green-800 border-green-200",
  FALSE: "bg-red-100 text-red-800 border-red-200",
} as const;

/**
 * Textos para diferentes tipos de status
 */
const STATUS_TEXTS = {
  // Status gerais
  ATIVO: "Ativo",
  INATIVO: "Inativo",

  // Status de pedidos
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",

  // Status de produtos (boolean)
  TRUE: "Ativo",
  FALSE: "Inativo",
} as const;

/**
 * Obtém a classe CSS para colorir um status geral (ATIVO/INATIVO)
 *
 * @param status - Status do tipo Status enum
 * @returns String com classes CSS para estilização
 *
 * @example
 * getGeneralStatusColor("ATIVO") // "bg-green-100 text-green-800 border-green-200"
 */
export const getGeneralStatusColor = (status: Status): string => {
  return STATUS_COLORS[status] || STATUS_COLORS.INATIVO;
};

/**
 * Obtém o texto legível para um status geral
 *
 * @param status - Status do tipo Status enum
 * @returns String com texto legível
 *
 * @example
 * getGeneralStatusText("ATIVO") // "Ativo"
 */
export const getGeneralStatusText = (status: Status): string => {
  return STATUS_TEXTS[status] || "Desconhecido";
};

/**
 * Obtém a classe CSS para colorir um status de pedido
 *
 * @param status - Status do pedido
 * @returns String com classes CSS para estilização
 *
 * @example
 * getOrderStatusColor("PENDENTE") // "bg-yellow-100 text-yellow-800 border-yellow-200"
 */
export const getOrderStatusColor = (status: StatusPedido): string => {
  return STATUS_COLORS[status] || STATUS_COLORS.PENDENTE;
};

/**
 * Obtém o texto legível para um status de pedido
 *
 * @param status - Status do pedido
 * @returns String com texto legível
 *
 * @example
 * getOrderStatusText("PENDENTE") // "Pendente"
 */
export const getOrderStatusText = (status: StatusPedido): string => {
  return STATUS_TEXTS[status] || "Desconhecido";
};

/**
 * Obtém a classe CSS para colorir um status boolean (usado em produtos)
 *
 * @param active - Status ativo/inativo como boolean
 * @returns String com classes CSS para estilização
 *
 * @example
 * getBooleanStatusColor(true) // "bg-green-100 text-green-800 border-green-200"
 */
export const getBooleanStatusColor = (active: boolean): string => {
  return active ? STATUS_COLORS.TRUE : STATUS_COLORS.FALSE;
};

/**
 * Obtém o texto legível para um status boolean
 *
 * @param active - Status ativo/inativo como boolean
 * @returns String com texto legível
 *
 * @example
 * getBooleanStatusText(true) // "Ativo"
 */
export const getBooleanStatusText = (active: boolean): string => {
  return active ? STATUS_TEXTS.TRUE : STATUS_TEXTS.FALSE;
};

/**
 * Obtém a classe CSS para colorir uma categoria de despesa
 *
 * @param categoria - Categoria da despesa
 * @returns String com classes CSS para estilização
 *
 * @example
 * getCategoriaColor("OPERACIONAL") // "bg-blue-100 text-blue-800"
 */
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

/**
 * Obtém o texto legível para uma categoria de despesa
 *
 * @param categoria - Categoria da despesa
 * @returns String com texto legível
 *
 * @example
 * getCategoriaText("OPERACIONAL") // "Operacional"
 */
export const getCategoriaText = (categoria: CategoriaDespesa): string => {
  const textMap: Record<CategoriaDespesa, string> = {
    OPERACIONAL: "Operacional",
    ADMINISTRATIVA: "Administrativa",
    MARKETING: "Marketing",
    MANUTENCAO: "Manutenção",
    TRANSPORTE: "Transporte",
    FORNECEDORES: "Fornecedores",
    IMPOSTOS: "Impostos",
    OUTRAS: "Outras",
  };
  return textMap[categoria] || categoria;
};

/**
 * Obtém a classe CSS para colorir uma forma de pagamento
 *
 * @param formaPagamento - Forma de pagamento
 * @returns String com classes CSS para estilização
 *
 * @example
 * getFormaPagamentoColor("PIX") // "bg-purple-100 text-purple-800"
 */
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

/**
 * Obtém o texto legível para uma forma de pagamento
 *
 * @param formaPagamento - Forma de pagamento
 * @returns String com texto legível
 *
 * @example
 * getFormaPagamentoText("PIX") // "PIX"
 */
export const getFormaPagamentoText = (
  formaPagamento: FormaPagamentoDespesa
): string => {
  const textMap: Record<FormaPagamentoDespesa, string> = {
    DINHEIRO: "Dinheiro",
    PIX: "PIX",
    CARTAO_DEBITO: "Cartão de Débito",
    CARTAO_CREDITO: "Cartão de Crédito",
    TRANSFERENCIA: "Transferência",
    BOLETO: "Boleto",
    CHEQUE: "Cheque",
  };
  return textMap[formaPagamento] || formaPagamento;
};

/**
 * Obtém o status do estoque baseado na quantidade atual vs mínima
 *
 * @param currentStock - Estoque atual
 * @param minStock - Estoque mínimo
 * @returns Status do estoque com cor correspondente
 *
 * @example
 * getStockStatus(50, 10) // { status: "ok", color: "bg-green-100 text-green-800", text: "Normal" }
 */
export const getStockStatus = (
  currentStock: number,
  minStock: number
): { status: "ok" | "baixo" | "critico"; color: string; text: string } => {
  if (currentStock === 0) {
    return {
      status: "critico",
      color: "bg-red-100 text-red-800",
      text: "Esgotado",
    };
  }

  if (currentStock <= minStock) {
    return {
      status: "baixo",
      color: "bg-yellow-100 text-yellow-800",
      text: "Estoque Baixo",
    };
  }

  return {
    status: "ok",
    color: "bg-green-100 text-green-800",
    text: "Normal",
  };
};

/**
 * Obtém a prioridade visual de um status (usado para ordenação)
 *
 * @param status - Status a ser avaliado
 * @returns Número representando a prioridade (menor = maior prioridade)
 *
 * @example
 * getStatusPriority("CRITICO") // 1 (alta prioridade)
 * getStatusPriority("OK") // 3 (baixa prioridade)
 */
export const getStatusPriority = (status: string): number => {
  const priorityMap: Record<string, number> = {
    CRITICO: 1,
    CANCELADO: 1,
    INATIVO: 2,
    BAIXO: 2,
    PENDENTE: 2,
    CONFIRMADO: 3,
    ATIVO: 3,
    OK: 3,
    ENTREGUE: 4,
  };

  return priorityMap[status.toUpperCase()] || 5;
};
