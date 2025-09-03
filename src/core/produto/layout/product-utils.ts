import {
  getBooleanStatusColor,
  getBooleanStatusText,
  formatCurrency,
} from "@/shared/utils";

export function getCategoryColor(categoria: string): string {
  const colors: Record<string, string> = {
    "Água Mineral": "bg-blue-100 text-blue-800",
    Refrigerante: "bg-red-100 text-red-800",
    Suco: "bg-orange-100 text-orange-800",
    Energético: "bg-yellow-100 text-yellow-800",
    Cerveja: "bg-amber-100 text-amber-800",
    Outros: "bg-gray-100 text-gray-800",
  };
  return colors[categoria] || "bg-gray-100 text-gray-800";
}

export function getCategoryText(categoria: string): string {
  return categoria;
}

export function getStockStatusColor(
  estoque: number,
  estoqueMinimo: number
): string {
  if (estoque === 0) {
    return "bg-red-100 text-red-800";
  } else if (estoque <= estoqueMinimo) {
    return "bg-yellow-100 text-yellow-800";
  }
  return "bg-green-100 text-green-800";
}

// Re-exportar funções centralizadas para manter compatibilidade
export const getStatusColor = getBooleanStatusColor;
export const getStatusText = getBooleanStatusText;

// Alias para formatação de preço
export const formatPrice = formatCurrency;

export function getStockStatus(
  quantidade: number,
  estoqueMinimo: number
): {
  status: "normal" | "baixo" | "zerado";
  color: string;
  text: string;
} {
  if (quantidade === 0) {
    return {
      status: "zerado",
      color: "text-red-800 border-none",
      text: "Sem Estoque",
    };
  }

  if (quantidade <= estoqueMinimo) {
    return {
      status: "baixo",
      color: "text-yellow-800 border-none",
      text: "Estoque Baixo",
    };
  }

  return {
    status: "normal",
    color: "text-green-800 border-none",
    text: "Estoque Normal",
  };
}
