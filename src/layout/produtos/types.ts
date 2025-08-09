import { TProduto } from "@/core/produto/produto.entity";

export interface IProductRow {
  product: TProduto;
  onView: (product: TProduto) => void;
  onEdit: (product: TProduto) => void;
  onDelete: (product: TProduto) => void;
}

export interface IFiltrosProdutos {
  status: string;
}

export interface IProductStats {
  total: number;
  ativo: number;
  inativo: number;
  promocao: number;
  estoqueBaixo: number;
}
