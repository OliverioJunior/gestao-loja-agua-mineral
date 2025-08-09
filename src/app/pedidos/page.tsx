"use client";

import { useState, useMemo } from "react";
import {
  OrderStatsCards,
  OrderFilters,
  OrderTable,
  OrderDetailsModal,
  IPedido,
  IPedidoStats,
} from "@/layout/pedidos";

// Dados mockados para demonstração
const mockPedidos: IPedido[] = [
  {
    id: "1",
    numero: "PED24010001",
    cliente: {
      id: "1",
      nome: "João Silva",
      email: "joao@email.com",
      telefone: "11999999999",
      endereco: {
        logradouro: "Rua das Flores",
        numero: "123",
        bairro: "Centro",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
      },
    },
    itens: [
      {
        produto: {
          id: "1",
          nome: "Água Mineral 500ml",
          categoria: "Água",
          estoque: 100,
          minimo: 10,
          preco: 250,
          status: "ativo",
          ultimaMovimentacao: new Date(),
        },
        quantidade: 24,
        precoUnitario: 250,
      },
    ],
    tipoEntrega: "entrega",
    enderecoEntrega: {
      logradouro: "Rua das Flores",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
    },
    formaPagamento: "pix",
    status: "pendente",
    total: 6500, // R$ 65,00
    desconto: 0,
    taxaEntrega: 500, // R$ 5,00
    observacoes: "Entregar pela manhã",
    dataPedido: new Date("2024-01-15T10:30:00"),
    dataEntrega: undefined,
  },
  {
    id: "2",
    numero: "PED24010002",
    cliente: {
      id: "2",
      nome: "Maria Santos",
      email: "maria@email.com",
      telefone: "11888888888",
      endereco: {
        logradouro: "Av. Principal",
        numero: "456",
        bairro: "Jardim",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-890",
      },
    },
    itens: [
      {
        produto: {
          id: "2",
          nome: "Água Mineral 1L",
          categoria: "Água",
          estoque: 50,
          minimo: 5,
          preco: 400,
          status: "ativo",
          ultimaMovimentacao: new Date(),
        },
        quantidade: 12,
        precoUnitario: 400,
      },
    ],
    tipoEntrega: "balcao",
    formaPagamento: "cartao_credito",
    status: "confirmado",
    total: 4800, // R$ 48,00
    desconto: 0,
    taxaEntrega: 0,
    observacoes: "",
    dataPedido: new Date("2024-01-15T14:20:00"),
    dataEntrega: undefined,
  },
  {
    id: "3",
    numero: "PED24010003",
    cliente: {
      id: "1",
      nome: "João Silva",
      email: "joao@email.com",
      telefone: "11999999999",
      endereco: {
        logradouro: "Rua das Flores",
        numero: "123",
        bairro: "Centro",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
      },
    },
    itens: [
      {
        produto: {
          id: "1",
          nome: "Água Mineral 500ml",
          categoria: "Água",
          estoque: 100,
          minimo: 10,
          preco: 250,
          status: "ativo",
          ultimaMovimentacao: new Date(),
        },
        quantidade: 48,
        precoUnitario: 250,
      },
    ],
    tipoEntrega: "entrega",
    enderecoEntrega: {
      logradouro: "Rua das Flores",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
    },
    formaPagamento: "dinheiro",
    status: "entregue",
    total: 12500, // R$ 125,00
    desconto: 0,
    taxaEntrega: 500,
    observacoes: "",
    dataPedido: new Date("2024-01-14T09:15:00"),
    dataEntrega: new Date("2024-01-14T16:30:00"),
  },
  {
    id: "4",
    numero: "PED24010004",
    cliente: {
      id: "2",
      nome: "Maria Santos",
      email: "maria@email.com",
      telefone: "11888888888",
      endereco: {
        logradouro: "Av. Principal",
        numero: "456",
        bairro: "Jardim",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-890",
      },
    },
    itens: [
      {
        produto: {
          id: "1",
          nome: "Água Mineral 500ml",
          categoria: "Água",
          estoque: 100,
          minimo: 10,
          preco: 250,
          status: "ativo",
          ultimaMovimentacao: new Date(),
        },
        quantidade: 12,
        precoUnitario: 250,
      },
      {
        produto: {
          id: "2",
          nome: "Água Mineral 1L",
          categoria: "Água",
          estoque: 50,
          minimo: 5,
          preco: 400,
          status: "ativo",
          ultimaMovimentacao: new Date(),
        },
        quantidade: 6,
        precoUnitario: 400,
      },
    ],
    tipoEntrega: "balcao",
    formaPagamento: "cartao_debito",
    status: "preparando",
    total: 5400, // R$ 54,00
    desconto: 0,
    taxaEntrega: 0,
    observacoes: "Cliente aguardando no balcão",
    dataPedido: new Date("2024-01-15T16:45:00"),
    dataEntrega: undefined,
  },
  {
    id: "5",
    numero: "PED24010005",
    cliente: {
      id: "1",
      nome: "João Silva",
      email: "joao@email.com",
      telefone: "11999999999",
      endereco: {
        logradouro: "Rua das Flores",
        numero: "123",
        bairro: "Centro",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
      },
    },
    itens: [
      {
        produto: {
          id: "2",
          nome: "Água Mineral 1L",
          categoria: "Água",
          estoque: 50,
          minimo: 5,
          preco: 400,
          status: "ativo",
          ultimaMovimentacao: new Date(),
        },
        quantidade: 24,
        precoUnitario: 400,
      },
    ],
    tipoEntrega: "entrega",
    enderecoEntrega: {
      logradouro: "Rua das Flores",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
    },
    formaPagamento: "pix",
    status: "cancelado",
    total: 10100, // R$ 101,00
    desconto: 300, // R$ 3,00
    taxaEntrega: 500,
    observacoes: "Cliente cancelou por motivos pessoais",
    dataPedido: new Date("2024-01-13T11:20:00"),
    dataEntrega: undefined,
  },
];

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selectedOrder, setSelectedOrder] = useState<IPedido | null>(null);
  const [orders, setOrders] = useState<IPedido[]>(mockPedidos);

  // Filtrar pedidos
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.cliente.telefone.includes(searchTerm);

      const matchesStatus =
        statusFilter === "todos" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Calcular estatísticas
  const stats: IPedidoStats = useMemo(() => {
    const total = orders.length;
    const pendentes = orders.filter((o) => o.status === "pendente").length;
    const confirmados = orders.filter((o) => o.status === "confirmado").length;
    const entregues = orders.filter((o) => o.status === "entregue").length;
    const cancelados = orders.filter((o) => o.status === "cancelado").length;

    // Calcular faturamento do mês atual (apenas pedidos entregues)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const faturamentoMensal = orders
      .filter(
        (o) =>
          o.status === "entregue" &&
          o.dataEntrega &&
          o.dataEntrega.getMonth() === currentMonth &&
          o.dataEntrega.getFullYear() === currentYear
      )
      .reduce((acc, order) => acc + order.total, 0);

    return {
      total,
      pendentes,
      confirmados,
      entregues,
      cancelados,
      faturamentoMensal,
    };
  }, [orders]);

  const handleViewOrder = (order: IPedido) => {
    setSelectedOrder(order);
  };

  const handleEditOrder = (order: IPedido) => {
    // TODO: Implementar edição de pedido
    console.log("Editar pedido:", order.id);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  const handleAdvanceStatus = (
    orderId: string,
    newStatus: IPedido["status"]
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              dataEntrega:
                newStatus === "entregue" ? new Date() : order.dataEntrega,
            }
          : order
      )
    );
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "cancelado" } : order
      )
    );
  };

  const handleAddOrder = () => {
    // TODO: Implementar adição de pedido
    console.log("Adicionar novo pedido");
  };

  return (
    <div className="min-h-[calc(100dvh-93px)] container mx-auto p-6 space-y-6">
      {/* Cards de Estatísticas */}
      <OrderStatsCards stats={stats} />

      {/* Filtros */}
      <OrderFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onAddOrder={handleAddOrder}
      />

      {/* Tabela de Pedidos */}
      <OrderTable
        orders={filteredOrders}
        onView={handleViewOrder}
        onEdit={handleEditOrder}
        onDelete={handleDeleteOrder}
        onAdvanceStatus={handleAdvanceStatus}
        onCancelOrder={handleCancelOrder}
      />

      {/* Modal de Detalhes */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onEdit={handleEditOrder}
      />
    </div>
  );
}
