import { TProdutoWithCategoria } from "@/core/produto/domain/produto.entity";

export interface IProductRow {
  product: TProdutoWithCategoria;
  onView: (product: TProdutoWithCategoria) => void;
  onEdit: (product: TProdutoWithCategoria) => void;
  onDelete: (product: TProdutoWithCategoria) => void;
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
