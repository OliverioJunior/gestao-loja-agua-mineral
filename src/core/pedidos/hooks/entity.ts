import { CreatePedidoInput, TPedidoWithRelations } from "@/core/pedidos/domain";
import { IPedidoStats } from "@/core/pedidos/layout";

export interface UsePedidosReturn {
  pedidos: TPedidoWithRelations[];
  stats: IPedidoStats | null;
  loading: boolean;
  error: string | null;
  pagination: PaginatedResponse<TPedidoWithRelations>["pagination"] | null;
  fetchPedidos: (params?: FetchPedidosParams) => Promise<void>;
  fetchPedidosPaginated: (
    params: FetchPedidosParams & { paginated: true }
  ) => Promise<PaginatedResponse<TPedidoWithRelations>>;
  fetchStats: () => Promise<void>;
  createPedido: (data: CreatePedidoInput) => Promise<boolean>;
  updatePedido: (
    id: string,
    data: Partial<TPedidoWithRelations>
  ) => Promise<boolean>;
  updateStatus: (
    id: string,
    status: TPedidoWithRelations["status"]
  ) => Promise<boolean>;
  deletePedido: (id: string) => Promise<boolean>;
  findByCliente: (clienteId: string) => Promise<TPedidoWithRelations[]>;
  findByStatus: (
    status: TPedidoWithRelations["status"]
  ) => Promise<TPedidoWithRelations[]>;
  findById: (id: string) => Promise<TPedidoWithRelations | null>;
}
// Tipos para paginação
export interface PaginationParams {
  paginated?: boolean;
  page?: number;
  limit?: number;
}

export interface FilterParams {
  clienteId?: string;
  status?: TPedidoWithRelations["status"];
  startDate?: string;
  endDate?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FetchPedidosParams extends PaginationParams, FilterParams {}
