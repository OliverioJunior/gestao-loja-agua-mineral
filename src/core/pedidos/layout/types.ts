import { CreatePedidoInput, TPedidoWithRelations } from "@/core/pedidos/domain";
import { FetchPedidosParams } from "../hooks/entity";

export interface IEndereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface IClientePedido {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: IEndereco;
}

export interface IProdutoPedido {
  id: string;
  produtoId: string;
  categoria: string;
  estoque: number;
  minimo: number;
  preco: number;
  status: string;
  ultimaMovimentacao: Date;
}

export interface IPedidoItemCompleto {
  produto: IProdutoPedido;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
}

export interface IPedidoItem {
  id: string;
  produtoId: string;
  produtoNome: string;
  produtoPreco: number;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface IPedidoStats {
  total: number;
  pendentes: number;
  confirmados: number;
  preparando: number;
  entregues: number;
  cancelados: number;
  faturamentoMensal: number;
}

export type Filters = "hoje" | "ontem" | "semana" | "mês" | undefined;
export interface OrderFiltersProps {
  searchTerm: string;
  statusFilter: string;
  startDate?: string;
  endDate?: string;
  onSearchChange: (term: string) => void;
  onStatusChange: (status: string) => void;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  onAddOrder: (order: CreatePedidoInput) => Promise<void>;
}

export interface OrderTableProps {
  orders: TPedidoWithRelations[];
  onView: (order: TPedidoWithRelations) => void;
  onEdit: (order: TPedidoWithRelations) => void;
  onDelete: (orderId: string) => void;
  onAdvanceStatus?: (
    orderId: string,
    status: TPedidoWithRelations["status"]
  ) => void;
  onCancelOrder?: (orderId: string) => void;
}

export interface OrderRowProps {
  order: TPedidoWithRelations;
  onView: (order: TPedidoWithRelations) => void;
  onEdit: (order: TPedidoWithRelations) => void;
  onDelete: (orderId: string) => void;
  onAdvanceStatus?: (
    orderId: string,
    status: TPedidoWithRelations["status"]
  ) => void;
  onCancelOrder?: (orderId: string) => void;
}

export interface OrderDetailsModalProps {
  order: TPedidoWithRelations | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (order: TPedidoWithRelations) => void;
}

export interface OrderStatsCardsProps {
  stats: IPedidoStats;
}

export interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (order: CreatePedidoInput) => Promise<void>;
}

export interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<TPedidoWithRelations>) => Promise<void>;
  order: TPedidoWithRelations | null;
}

export interface StatusTransitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    orderId: string,
    newStatus: TPedidoWithRelations["status"],
    params?: FetchPedidosParams,
    observacoes?: string
  ) => Promise<void>;
  order: TPedidoWithRelations | null;
}

export interface ICliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: IEndereco;
  status: "ativo" | "inativo";
}

export interface IProduto {
  id: string;
  nome: string;
  descricao?: string;
  marca?: string;
  categoria?: string;
  precoCusto: number;
  precoVenda: number;
  precoRevenda?: number;
  precoPromocao?: number;
  quantidade: number;
  estoqueMinimo: number;
  ativo: boolean;
  promocao: boolean;
}
