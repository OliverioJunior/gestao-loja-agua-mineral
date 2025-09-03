import { Cliente } from "@/infrastructure/generated/prisma";
import {
  CreateClienteInput,
  TClienteWithAdressAndCount,
} from "@/core/cliente/domain/cliente.entity";

export type IClient = Cliente;

export interface IClientWithStats extends IClient {
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
  onAddClient: (clientData: Partial<CreateClienteInput>) => Promise<void>;
}

export interface ClientTableProps {
  clients: TClienteWithAdressAndCount[];
  onView: (client: TClienteWithAdressAndCount) => void;
  onEdit: (client: TClienteWithAdressAndCount) => void;
  onDelete: (client: TClienteWithAdressAndCount) => void;
}

export interface ClientRowProps {
  client: TClienteWithAdressAndCount;
  onView: (client: TClienteWithAdressAndCount) => void;
  onEdit: (client: TClienteWithAdressAndCount) => void;
  onDelete: (client: TClienteWithAdressAndCount) => void;
}

export interface ClientDetailsModalProps {
  client: TClienteWithAdressAndCount | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (client: TClienteWithAdressAndCount) => void;
}

export interface ClientStatsCardsProps {
  stats: IClientStats;
}

export interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clientData: Partial<CreateClienteInput>) => Promise<void>;
}
