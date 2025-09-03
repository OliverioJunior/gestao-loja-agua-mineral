import { TProduto } from "@/core/produto/domain/produto.entity";
import {
  TItemCompraWithRelations,
  CreateItemCompraInput,
  UpdateItemCompraInput,
} from "../domain/item-compra.entity";

// Props base para modais
export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Props para modal de criação
export interface AddItemCompraModalProps extends BaseModalProps {
  onSubmit: (data: CreateItemCompraInput) => Promise<void>;
  compraId?: string; // Opcional para pré-selecionar uma compra
}

// Props para modal de edição
export interface EditItemCompraModalProps extends BaseModalProps {
  item: TItemCompraWithRelations | null;
  onSubmit: (id: string, data: UpdateItemCompraInput) => Promise<void>;
}

// Props para modal de detalhes
export interface ItemCompraDetailsModalProps extends BaseModalProps {
  item: TItemCompraWithRelations | null;
}

// Props para modal de exclusão
export interface DeleteItemCompraModalProps extends BaseModalProps {
  item: TItemCompraWithRelations | null;
  onConfirm: (id: string) => Promise<void>;
}

// Props para tabela
export interface ItemCompraTableProps {
  items: TItemCompraWithRelations[];
  loading?: boolean;
  onView: (item: TItemCompraWithRelations) => void;
  onEdit: (item: TItemCompraWithRelations) => void;
  onDelete: (item: TItemCompraWithRelations) => void;
}

// Props para linha da tabela
export interface ItemCompraRowProps {
  item: TItemCompraWithRelations;
  onView: (item: TItemCompraWithRelations) => void;
  onEdit: (item: TItemCompraWithRelations) => void;
  onDelete: (item: TItemCompraWithRelations) => void;
}

// Props para filtros
export interface ItemCompraFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalItems: number;
  totalValue: number;
}

// Dados para formulário de item de compra
export interface ItemCompraFormData {
  compraId: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
  desconto?: number;
}

// Opções para selects
export interface SelectOption {
  value: string;
  label: string;
}

// Props para seletor de compra
export interface CompraSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

// Props para seletor de produto
export interface ProdutoSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onProdutoSelect?: (produto: TProduto) => void; // Para preencher preço automaticamente
}

// Estado do formulário
export interface FormState {
  data: ItemCompraFormData;
  errors: Record<string, string>;
  loading: boolean;
}

// Props para cards de estatísticas
export interface ItemCompraStatsCardsProps {
  totalItems: number;
  totalValue: number;
  loading?: boolean;
}
