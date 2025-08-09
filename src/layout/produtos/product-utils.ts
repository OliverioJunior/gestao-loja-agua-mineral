export function getCategoryColor(categoria?: string | null): string {
  switch (categoria?.toLowerCase()) {
    case "água mineral":
      return "bg-blue-100 text-blue-800 border-blue-200";
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
  return ativo
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-red-100 text-red-800 border-red-200";
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

export function getStockStatus(quantidade: number, estoqueMinimo: number): {
  status: "normal" | "baixo" | "zerado";
  color: string;
  text: string;
} {
  if (quantidade === 0) {
    return {
      status: "zerado",
      color: "bg-red-100 text-red-800 border-red-200",
      text: "Sem Estoque",
    };
  }
  
  if (quantidade <= estoqueMinimo) {
    return {
      status: "baixo",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      text: "Estoque Baixo",
    };
  }
  
  return {
    status: "normal",
    color: "bg-green-100 text-green-800 border-green-200",
    text: "Estoque Normal",
  };
}