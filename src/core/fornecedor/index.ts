// Exportações principais do módulo fornecedor

// Domain
export * from './domain';

// Hooks
export * from './hooks';

// Layout
export * from './layout';

// Re-exportações específicas para facilitar o uso
export { Fornecedor } from './domain/fornecedor';
export { useFornecedores } from './hooks/useFornecedores';
export type { IFornecedorHook } from './hooks/useFornecedores';

// Tipos principais
export type {
  TFornecedor,
  TFornecedorWithRelations,
  CreateFornecedorInput,
  UpdateFornecedorInput,
  IFornecedorRepository
} from './domain/fornecedor.entity';

// Utilitários
export { FornecedorUtils } from './layout/fornecedor-utils';

// Tipos de componentes
export type {
  FornecedorTableProps,
  FornecedorRowProps,
  FornecedorFiltersProps,
  FornecedorStatsCardsProps,
  AddFornecedorModalProps,
  EditFornecedorModalProps,
  FornecedorDetailsModalProps,
  DeleteFornecedorModalProps,
  FornecedorFormData,
  DocumentType
} from './layout/types';