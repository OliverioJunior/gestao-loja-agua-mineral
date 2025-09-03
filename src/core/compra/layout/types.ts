import {
  TCompraWithRelations,
  CreateCompraInput,
  UpdateCompraInput
} from "../domain/compra.entity";

// Props base para modais
export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Props para modal de criação
export interface AddCompraModalProps extends BaseModalProps {
  onSubmit: (data: CreateCompraInput) => Promise<void>;
}

// Props para modal de edição
export interface EditCompraModalProps extends BaseModalProps {
  compra: TCompraWithRelations | null;
  onSubmit: (id: string, data: UpdateCompraInput) => Promise<void>;
}

// Props para modal de detalhes
export interface CompraDetailsModalProps extends BaseModalProps {
  compra: TCompraWithRelations | null;
}

// Props para modal de exclusão
export interface DeleteCompraModalProps extends BaseModalProps {
  compra: TCompraWithRelations | null;
  onConfirm: (id: string) => Promise<void>;
}

// Props para tabela
export interface CompraTableProps {
  compras: TCompraWithRelations[];
  loading?: boolean;
  onView: (compra: TCompraWithRelations) => void;
  onEdit: (compra: TCompraWithRelations) => void;
  onDelete: (compra: TCompraWithRelations) => void;
  onConfirmar?: (id: string) => void;
  onReceber?: (id: string) => void;
  onCancelar?: (id: string) => void;
}

// Props para linha da tabela
export interface CompraRowProps {
  compra: TCompraWithRelations;
  onView: (compra: TCompraWithRelations) => void;
  onEdit: (compra: TCompraWithRelations) => void;
  onDelete: (compra: TCompraWithRelations) => void;
  onConfirmar?: (id: string) => void;
  onReceber?: (id: string) => void;
  onCancelar?: (id: string) => void;
}

// Props para filtros
export interface CompraFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  dateFilter: {
    startDate: Date | null;
    endDate: Date | null;
  };
  onDateFilterChange: (filter: { startDate: Date | null; endDate: Date | null }) => void;
  totalCompras: number;
  comprasPendentes: number;
  comprasConfirmadas: number;
  comprasRecebidas: number;
  comprasCanceladas: number;
  valorTotal: number;
}

// Props para cards de estatísticas
export interface CompraStatsCardsProps {
  totalCompras: number;
  comprasPendentes: number;
  comprasConfirmadas: number;
  comprasRecebidas: number;
  comprasCanceladas: number;
  valorTotal: number;
  valorMedio?: number;
  loading?: boolean;
}

// Dados para formulário de compra
export interface CompraFormData {
  fornecedorId: string;
  numeroNota?: string;
  dataCompra: Date;
  dataVencimento?: Date;
  total: number;
  desconto?: number;
  frete?: number;
  impostos?: number;
  formaPagamento: string;
  status: string;
  observacoes?: string;
}

// Estado do formulário
export interface FormState {
  data: CompraFormData;
  errors: Record<string, string>;
  loading: boolean;
}

// Opções para selects
export interface SelectOption {
  value: string;
  label: string;
}

// Props para seletor de fornecedor
export interface FornecedorSelectorProps {
  value: string;
  onChange: (fornecedorId: string) => void;
  error?: string;
  disabled?: boolean;
}

// Props para campo de valores monetários
export interface MoneyFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

// Props para campo de data
export interface DateFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

// Props para campo de status
export interface StatusFieldProps {
  status: string;
  onChange: (status: string) => void;
  disabled?: boolean;
  allowedTransitions?: string[];
}

// Dados de estatísticas
export interface CompraStatistics {
  total: number;
  pendentes: number;
  confirmadas: number;
  recebidas: number;
  canceladas: number;
  valorTotal: number;
  valorMedio: number;
  percentualPendentes: number;
  percentualConfirmadas: number;
  percentualRecebidas: number;
  percentualCanceladas: number;
}

// Props para componente de status badge
export interface StatusBadgeProps {
  status: string;
  className?: string;
}

// Props para componente de valor monetário
export interface MoneyDisplayProps {
  value: number;
  className?: string;
  showCurrency?: boolean;
}

// Props para filtro de período
export interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (filter: { startDate: Date | null; endDate: Date | null }) => void;
  disabled?: boolean;
}

// Props para resumo financeiro
export interface FinancialSummaryProps {
  compra: TCompraWithRelations;
  showDetails?: boolean;
}

// Props para lista de itens da compra
export interface CompraItensListProps {
  compra: TCompraWithRelations;
  showActions?: boolean;
  onEditItem?: (itemId: string) => void;
  onDeleteItem?: (itemId: string) => void;
}

// Dados para exportação
export interface CompraExportData {
  numeroNota: string;
  fornecedor: string;
  dataCompra: string;
  dataVencimento: string;
  status: string;
  formaPagamento: string;
  subtotal: string;
  desconto: string;
  frete: string;
  impostos: string;
  total: string;
  observacoes: string;
}

// Props para ações em lote
export interface BulkActionsProps {
  selectedCompras: string[];
  onConfirmarSelecionadas: () => void;
  onCancelarSelecionadas: () => void;
  onExportarSelecionadas: () => void;
  disabled?: boolean;
}