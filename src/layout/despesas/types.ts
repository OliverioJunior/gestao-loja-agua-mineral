import {
  CategoriaDespesa,
  FormaPagamentoDespesa,
} from "@/infrastructure/generated/prisma";
import {
  TDespesaWithUser,
  IDespesaStats,
  ICreateDespesa,
  IUpdateDespesa,
} from "@/core/despesas";

export interface DespesaStatsCardsProps {
  stats: IDespesaStats | null;
  loading?: boolean;
}

export interface DespesaFiltersProps {
  searchTerm: string;
  filterCategoria: CategoriaDespesa | "TODAS";
  filterFormaPagamento: FormaPagamentoDespesa | "TODAS";
  onSearchChange: (value: string) => void;
  onCategoriaChange: (categoria: CategoriaDespesa | "TODAS") => void;
  onFormaPagamentoChange: (
    formaPagamento: FormaPagamentoDespesa | "TODAS"
  ) => void;
  onAddDespesa: () => void;
}

export interface DespesaTableProps {
  despesas: TDespesaWithUser[];
  loading?: boolean;
  onView: (despesa: TDespesaWithUser) => void;
  onEdit: (despesa: TDespesaWithUser) => void;
  onDelete: (despesa: TDespesaWithUser) => void;
}

export interface DespesaRowProps {
  despesa: TDespesaWithUser;
  onView: (despesa: TDespesaWithUser) => void;
  onEdit: (despesa: TDespesaWithUser) => void;
  onDelete: (despesa: TDespesaWithUser) => void;
}

export interface DespesaDetailsModalProps {
  despesa: TDespesaWithUser | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (despesa: TDespesaWithUser) => void;
}

export interface EditDespesaModalProps {
  despesa: TDespesaWithUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: ICreateDespesa | IUpdateDespesa
  ) => Promise<{ success: boolean; error?: string }>;
  mode: "create" | "edit";
}

export interface DeleteDespesaModalProps {
  despesa: TDespesaWithUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<{ success: boolean; error?: string }>;
}

// Utility types
export interface DespesaFormData {
  descricao: string;
  valor: string;
  data: string;
  categoria: CategoriaDespesa;
  formaPagamento: FormaPagamentoDespesa;
  observacoes?: string;
}

export interface CategoriaOption {
  value: CategoriaDespesa | "TODAS";
  label: string;
}

export interface FormaPagamentoOption {
  value: FormaPagamentoDespesa | "TODAS";
  label: string;
}
