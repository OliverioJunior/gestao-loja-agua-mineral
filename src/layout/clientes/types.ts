export interface IClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: "ativo" | "inativo";
  totalOrders: number;
  totalSales: number;
  createdAt: Date;
  updatedAt: Date;
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
  onAddClient: (clientData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    status: "ativo" | "inativo";
  }) => void;
}

export interface ClientTableProps {
  clients: IClient[];
  onView: (client: IClient) => void;
  onEdit: (client: IClient) => void;
  onDelete: (client: IClient) => void;
}

export interface ClientRowProps {
  client: IClient;
  onView: (client: IClient) => void;
  onEdit: (client: IClient) => void;
  onDelete: (client: IClient) => void;
}

export interface ClientDetailsModalProps {
  client: IClient | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (client: IClient) => void;
}

export interface ClientStatsCardsProps {
  stats: IClientStats;
}

export interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clientData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    status: "ativo" | "inativo";
  }) => void;
}
