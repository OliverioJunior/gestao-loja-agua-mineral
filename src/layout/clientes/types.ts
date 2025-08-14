import { Cliente } from "@/infrastructure/generated/prisma";
import {
  CreateClienteInput,
  TClienteWithCount,
} from "@/core/cliente/cliente.entity";

export type IClient = Cliente;

export interface IClientWithStats extends Cliente {
  totalOrders: number;
  totalSales: number;
}

export interface IClientStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
}

export interface ClientFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  onAddClient: (
    clientData: Omit<CreateClienteInput, "criadoPorId" | "atualizadoPorId">
  ) => Promise<void>;
}

export interface ClientTableProps {
  clients: TClienteWithCount[];
  onView: (client: TClienteWithCount) => void;
  onEdit: (client: TClienteWithCount) => void;
  onDelete: (client: TClienteWithCount) => void;
}

export interface ClientRowProps {
  client: TClienteWithCount;
  onView: (client: TClienteWithCount) => void;
  onEdit: (client: TClienteWithCount) => void;
  onDelete: (client: TClienteWithCount) => void;
}

export interface ClientDetailsModalProps {
  client: TClienteWithCount | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (client: TClienteWithCount) => void;
}

export interface ClientStatsCardsProps {
  stats: IClientStats;
}

export interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    clientData: Omit<CreateClienteInput, "criadoPorId" | "atualizadoPorId">
  ) => Promise<void>;
}
