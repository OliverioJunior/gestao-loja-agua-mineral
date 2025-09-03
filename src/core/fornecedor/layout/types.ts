import {
  TFornecedorWithRelations,
  CreateFornecedorInput,
  UpdateFornecedorInput
} from "../domain/fornecedor.entity";

// Props base para modais
export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Props para modal de criação
export interface AddFornecedorModalProps extends BaseModalProps {
  onSubmit: (data: CreateFornecedorInput) => Promise<void>;
}

// Props para modal de edição
export interface EditFornecedorModalProps extends BaseModalProps {
  fornecedor: TFornecedorWithRelations | null;
  onSubmit: (id: string, data: UpdateFornecedorInput) => Promise<void>;
}

// Props para modal de detalhes
export interface FornecedorDetailsModalProps extends BaseModalProps {
  fornecedor: TFornecedorWithRelations | null;
}

// Props para modal de exclusão
export interface DeleteFornecedorModalProps extends BaseModalProps {
  fornecedor: TFornecedorWithRelations | null;
  onConfirm: (id: string) => Promise<void>;
}

// Props para tabela
export interface FornecedorTableProps {
  fornecedores: TFornecedorWithRelations[];
  loading?: boolean;
  onView: (fornecedor: TFornecedorWithRelations) => void;
  onEdit: (fornecedor: TFornecedorWithRelations) => void;
  onDelete: (fornecedor: TFornecedorWithRelations) => void;
  onActivate?: (id: string) => void;
  onDeactivate?: (id: string) => void;
}

// Props para linha da tabela
export interface FornecedorRowProps {
  fornecedor: TFornecedorWithRelations;
  onView: (fornecedor: TFornecedorWithRelations) => void;
  onEdit: (fornecedor: TFornecedorWithRelations) => void;
  onDelete: (fornecedor: TFornecedorWithRelations) => void;
  onActivate?: (id: string) => void;
  onDeactivate?: (id: string) => void;
}

// Props para filtros
export interface FornecedorFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  totalFornecedores: number;
  activeFornecedores: number;
  inactiveFornecedores: number;
}

// Props para cards de estatísticas
export interface FornecedorStatsCardsProps {
  totalFornecedores: number;
  activeFornecedores: number;
  inactiveFornecedores: number;
  totalCompras?: number;
  loading?: boolean;
}

// Dados para formulário de fornecedor
export interface FornecedorFormData {
  nome: string;
  razaoSocial?: string;
  cnpj?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  observacoes?: string;
  status: string;
}

// Estado do formulário
export interface FormState {
  data: FornecedorFormData;
  errors: Record<string, string>;
  loading: boolean;
}

// Opções para selects
export interface SelectOption {
  value: string;
  label: string;
}

// Tipo de documento
export type DocumentType = 'cnpj' | 'cpf';

// Props para seletor de tipo de documento
export interface DocumentTypeSelectorProps {
  documentType: DocumentType;
  onDocumentTypeChange: (type: DocumentType) => void;
  cnpj?: string;
  cpf?: string;
  onCnpjChange: (value: string) => void;
  onCpfChange: (value: string) => void;
  errors?: {
    cnpj?: string;
    cpf?: string;
  };
}

// Props para campo de status
export interface StatusFieldProps {
  status: string;
  onChange: (status: string) => void;
  disabled?: boolean;
}

// Dados de estatísticas
export interface FornecedorStatistics {
  total: number;
  ativos: number;
  inativos: number;
  totalCompras: number;
  percentualAtivos: number;
  percentualInativos: number;
}

// Props para componente de status badge
export interface StatusBadgeProps {
  status: string;
  className?: string;
}

// Props para componente de documento display
export interface DocumentDisplayProps {
  cnpj?: string | null;
  cpf?: string | null;
  className?: string;
}