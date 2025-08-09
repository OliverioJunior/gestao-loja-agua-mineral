export function getCategoryColor(categoria?: string | null): string {
  switch (categoria?.toLowerCase()) {
    case "água mineral":
      return "text-blue-800 border-none";
    case "água com gás":
      return "bg-green-100 text-green-800 border-green-200";
    case "água saborizada":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "água alcalina":
      return "bg-teal-100 text-teal-800 border-teal-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function getCategoryText(categoria?: string | null): string {
  switch (categoria?.toLowerCase()) {
    case "água mineral":
      return "Água Mineral";
    case "água com gás":
      return "Água com Gás";
    case "água saborizada":
      return "Água Saborizada";
    case "água alcalina":
      return "Água Alcalina";
    default:
      return categoria || "Sem Categoria";
  }
}

export function getStatusColor(ativo: boolean): string {
  return ativo ? "text-green-800 border-none" : " text-red-800 border-none";
}

export function getStatusText(ativo: boolean): string {
  return ativo ? "Ativo" : "Inativo";
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price / 100);
}

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
