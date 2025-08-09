"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/shared/components/ui";
import {
  ClientFilters,
  ClientDetailsModal,
  ClientStatsCards,
  ClientTable,
  IClient,
  IClientStats,
} from "@/layout/clientes";

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [clients, setClients] = useState<IClient[]>([]);
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);

  useEffect(() => {
    const mockClients: IClient[] = [
      {
        id: "1",
        name: "João Silva",
        email: "joao.silva@email.com",
        phone: "11999887766",
        address: "Rua das Flores, 123",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234-567",
        status: "ativo",
        totalOrders: 15,
        totalSales: 2450.8,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-12-10"),
      },
      {
        id: "2",
        name: "Maria Santos",
        email: "maria.santos@email.com",
        phone: "11988776655",
        address: "Av. Paulista, 1000",
        city: "São Paulo",
        state: "SP",
        zipCode: "01310-100",
        status: "ativo",
        totalOrders: 8,
        totalSales: 1320.5,
        createdAt: new Date("2024-02-20"),
        updatedAt: new Date("2024-12-08"),
      },
      {
        id: "3",
        name: "Pedro Costa",
        email: "pedro.costa@email.com",
        phone: "11977665544",
        address: "Rua Augusta, 456",
        city: "São Paulo",
        state: "SP",
        zipCode: "01305-000",
        status: "inativo",
        totalOrders: 3,
        totalSales: 180.9,
        createdAt: new Date("2024-03-10"),
        updatedAt: new Date("2024-12-05"),
      },
      {
        id: "4",
        name: "Ana Oliveira",
        email: "ana.oliveira@email.com",
        phone: "11966554433",
        address: "Rua Oscar Freire, 789",
        city: "São Paulo",
        state: "SP",
        zipCode: "01426-001",
        status: "ativo",
        totalOrders: 22,
        totalSales: 3890.75,
        createdAt: new Date("2024-04-05"),
        updatedAt: new Date("2024-12-12"),
      },
      {
        id: "5",
        name: "Carlos Ferreira",
        email: "carlos.ferreira@email.com",
        phone: "11955443322",
        address: "Rua da Consolação, 321",
        city: "São Paulo",
        state: "SP",
        zipCode: "01302-907",
        status: "ativo",
        totalOrders: 12,
        totalSales: 1980.4,
        createdAt: new Date("2024-05-18"),
        updatedAt: new Date("2024-12-11"),
      },
      {
        id: "6",
        name: "Lucia Mendes",
        email: "lucia.mendes@email.com",
        phone: "11944332211",
        address: "Av. Faria Lima, 654",
        city: "São Paulo",
        state: "SP",
        zipCode: "04538-132",
        status: "ativo",
        totalOrders: 6,
        totalSales: 890.25,
        createdAt: new Date("2024-11-02"),
        updatedAt: new Date("2024-12-09"),
      },
      {
        id: "7",
        name: "Roberto Lima",
        email: "roberto.lima@email.com",
        phone: "11933221100",
        address: "Rua Haddock Lobo, 987",
        city: "São Paulo",
        state: "SP",
        zipCode: "01414-001",
        status: "inativo",
        totalOrders: 1,
        totalSales: 45.9,
        createdAt: new Date("2024-06-25"),
        updatedAt: new Date("2024-12-01"),
      },
      {
        id: "8",
        name: "Fernanda Rocha",
        email: "fernanda.rocha@email.com",
        phone: "11922110099",
        address: "Rua Bela Cintra, 147",
        city: "São Paulo",
        state: "SP",
        zipCode: "01415-000",
        status: "ativo",
        totalOrders: 18,
        totalSales: 2750.6,
        createdAt: new Date("2024-11-15"),
        updatedAt: new Date("2024-12-13"),
      },
    ];
    setClients(mockClients);
  }, []);

  // Filtrar clientes
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
    const matchesStatus =
      filterStatus === "todos" || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Funções de ação
  const handleView = (client: IClient) => {
    setSelectedClient(client);
  };

  const handleEdit = (client: IClient) => {
    console.log("Editar cliente:", client);
    // Aqui você implementaria a lógica de edição
  };

  const handleDelete = (client: IClient) => {
    setClients(clients.filter((c) => c.id !== client.id));
    console.log("Cliente excluído:", client);
  };

  const handleAddClient = (clientData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    status: "ativo" | "inativo";
  }) => {
    const newClient: IClient = {
      id: Date.now().toString(),
      ...clientData,
      totalOrders: 0,
      totalSales: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setClients([...clients, newClient]);
    console.log("Novo cliente adicionado:", newClient);
  };

  // Calcular estatísticas
  const getClientStats = (): IClientStats => {
    const total = clients.length;
    const active = clients.filter((client) => client.status === "ativo").length;
    const inactive = clients.filter(
      (client) => client.status === "inativo"
    ).length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newThisMonth = clients.filter((client) => {
      const clientDate = new Date(client.createdAt);
      return (
        clientDate.getMonth() === currentMonth &&
        clientDate.getFullYear() === currentYear
      );
    }).length;

    return { total, active, inactive, newThisMonth };
  };

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      <div className="flex flex-col gap-4">
        {/* Cards de Estatísticas */}
        <ClientStatsCards stats={getClientStats()} />

        {/* Filtros */}
        <ClientFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          onAddClient={handleAddClient}
        />

        {/* Tabela de Clientes */}
        <Card>
          <CardContent className="p-0">
            <ClientTable
              clients={filteredClients}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>

        {/* Modal de Detalhes */}
        <ClientDetailsModal
          client={selectedClient}
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
