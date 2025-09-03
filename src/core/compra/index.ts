// Exportações principais do módulo compra

// Domain
export * from './domain';

// Hooks
export * from './hooks';

// Layout
export * from './layout';

// Re-exportações específicas para facilitar o uso
export { Compra } from './domain/compra';
export { useCompras } from './hooks/useCompras';
export type { ICompraHook } from './hooks/useCompras';

// Tipos principais
export type {
  TCompra,
  TCompraWithRelations,
  CreateCompraInput,
  UpdateCompraInput,
  ICompraRepository
} from './domain/compra.entity';

// Utilitários
export { CompraUtils } from './layout/compra-utils';

// Tipos de componentes
export type {
  CompraTableProps,
  CompraRowProps,
  CompraFiltersProps,
  CompraStatsCardsProps,
  AddCompraModalProps,
  EditCompraModalProps,
  CompraDetailsModalProps,
  DeleteCompraModalProps,
  CompraFormData,
  MoneyFieldProps,
  DateFieldProps,
  StatusFieldProps
} from './layout/types';