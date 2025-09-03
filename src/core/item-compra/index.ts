// Exportações principais do módulo item-compra

// Domain
export * from './domain';

// Hooks
export * from './hooks';

// Layout
export * from './layout';

// Re-exportações específicas para facilitar o uso
export { ItemCompra } from './domain/item-compra';
export { useItensCompra } from './hooks/useItensCompra';
export type { IItemCompraHook } from './hooks/useItensCompra';

// Tipos principais
export type {
  TItemCompra,
  TItemCompraWithRelations,
  CreateItemCompraInput,
  UpdateItemCompraInput,
  IItemCompraRepository
} from './domain/item-compra.entity';

// Utilitários
export { ItemCompraUtils } from './layout/item-compra-utils';

// Tipos de componentes
export type {
  ItemCompraTableProps,
  ItemCompraRowProps,
  ItemCompraFiltersProps,
  AddItemCompraModalProps,
  EditItemCompraModalProps,
  ItemCompraDetailsModalProps,
  DeleteItemCompraModalProps
} from './layout/types';