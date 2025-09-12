"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  OrderStatsCards,
  OrderFilters,
  OrderTable,
  OrderDetailsModal,
  EditOrderModal,
  StatusTransitionModal,
  IPedidoStats,
} from "@/core/pedidos/layout";
import { usePedidos } from "@/core/pedidos/hooks";
import { useVendas } from "@/core/vendas/hooks";
import {
  CreatePedidoInput,
  StatusPedido,
  TPedidoWithRelations,
} from "@/core/pedidos/domain";
import { FetchPedidosParams } from "@/core/pedidos/hooks/entity";

export default function PedidosPage() {
  // Função para obter data atual formatada
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDENTE"); // Padrão: status pendente
  const [startDate, setStartDate] = useState(getCurrentDate()); // Padrão: data atual
  const [endDate, setEndDate] = useState(getCurrentDate()); // Padrão: data atual
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [selectedOrder, setSelectedOrder] =
    useState<TPedidoWithRelations | null>(null);
  const [, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<TPedidoWithRelations | null>(
    null
  );
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusOrder, setStatusOrder] = useState<TPedidoWithRelations | null>(
    null
  );

  const {
    pedidos: orders,
    stats: pedidoStats,
    loading,
    error,
    isInitialized,
    initialize,
    updateStatus,
    deletePedido,
    createPedido,
    updatePedido,
    fetchPedidos,
  } = usePedidos();
  const { createVendas } = useVendas();

  // Função utilitária para obter filtros atuais
  const getCurrentFilters = useCallback((): FetchPedidosParams => {
    return {
      // Só adiciona status se não for "todos"
      ...(statusFilter && statusFilter !== "todos" && {
        status: statusFilter as StatusPedido
      }),
      // Adiciona datas se definidas
      ...(startDate && { startDate }),
      ...(endDate && { endDate })
    };
  }, [statusFilter, startDate, endDate]);

  // ✅ Inicialização única na montagem do componente
  useEffect(() => {
    initialize(); // Carrega dados padrão apenas uma vez
  }, []); // Sem dependências - executa apenas na montagem

  // ✅ Aplicar filtros apenas após interação do usuário
  useEffect(() => {
    if (!hasUserInteracted || !isInitialized) return;

    const applyFilters = async () => {
      const params: {
        status?: StatusPedido | "todos" | undefined;
        startDate?: string;
        endDate?: string;
      } = {};

      // Só adiciona status se não for "todos"
      if (statusFilter && statusFilter !== "todos") {
        params.status = statusFilter as StatusPedido | "todos" | undefined;
      }

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      await fetchPedidos(params);
    };

    applyFilters();
  }, [
    statusFilter,
    startDate,
    endDate,
    hasUserInteracted,
    isInitialized,
    fetchPedidos,
  ]);

  // Filtro local apenas para busca por texto
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;

    const searchLower = searchTerm.toLowerCase();
    return orders.filter((order) => {
      return (
        order.endereco?.numero.toLowerCase().includes(searchLower) ||
        order.cliente!.nome.toLowerCase().includes(searchLower) ||
        order.cliente!.telefone.includes(searchTerm) ||
        order.id.toLowerCase().includes(searchLower)
      );
    });
  }, [orders, searchTerm]);

  // Use stats from hook or fallback to default
  const stats: IPedidoStats = pedidoStats || {
    total: 0,
    pendentes: 0,
    confirmados: 0,
    preparando: 0,
    entregues: 0,
    cancelados: 0,
    faturamentoMensal: 0,
  };

  // Memoized event handlers to prevent unnecessary re-renders
  const handleViewOrder = useCallback((order: TPedidoWithRelations) => {
    setSelectedOrder(order);
  }, []);

  const handleEditOrder = useCallback(async (order: TPedidoWithRelations) => {
    setEditingOrder(order);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingOrder(null);
  }, []);

  const handleSaveOrder = useCallback(
    async (id: string, data: Partial<TPedidoWithRelations>) => {
      const success = await updatePedido(id, data);
      if (success) {
        setIsEditModalOpen(false);
        setEditingOrder(null);
        
        // Aplicar filtros atuais após atualizar pedido para manter consistência
        await fetchPedidos(getCurrentFilters());
      } else if (error) {
        console.error("Erro ao atualizar pedido:", error);
      }
    },
    [updatePedido, error, getCurrentFilters, fetchPedidos]
  );

  const handleDeleteOrder = useCallback(
    async (orderId: string) => {
      const success = await deletePedido(orderId);
      if (success) {
        // Aplicar filtros atuais após deletar pedido para manter consistência
        await fetchPedidos(getCurrentFilters());
      } else if (error) {
        console.error("Erro ao deletar pedido:", error);
      }
    },
    [deletePedido, error, getCurrentFilters, fetchPedidos]
  );

  const handleAdvanceStatus = useCallback(
    async (orderId: string) => {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        setStatusOrder(order);
        setIsStatusModalOpen(true);
      }
    },
    [orders]
  );

  const handleCancelOrder = useCallback(
    async (orderId: string) => {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        setStatusOrder(order);
        setIsStatusModalOpen(true);
      }
    },
    [orders]
  );

  const handleCloseStatusModal = useCallback(() => {
    setIsStatusModalOpen(false);
    setStatusOrder(null);
  }, []);

  const handleConfirmStatusChange = useCallback(
    async (
      orderId: string,
      newStatus: TPedidoWithRelations["status"],
      params?: FetchPedidosParams
    ) => {
      // Aplicar filtros atuais durante a atualização para manter consistência
      const currentFilters: FetchPedidosParams = {
        ...getCurrentFilters(),
        // Merge com parâmetros passados (prioridade para params externos)
        ...params
      };

      const success = await updateStatus(orderId, newStatus, currentFilters);
      if (newStatus === "ENTREGUE") {
        await createVendas(orderId);
      }
      if (!success && error) {
        console.error("Erro ao atualizar status:", error);
        throw new Error("Erro ao atualizar status");
      }
    },
    [updateStatus, error, createVendas, getCurrentFilters]
  );
  const handleCreateOrder = useCallback(
    async (orderData: CreatePedidoInput) => {
      const success = await createPedido(orderData);
      if (success) {
        setIsAddModalOpen(false);
        
        // Aplicar filtros atuais após criar pedido para manter consistência
        await fetchPedidos(getCurrentFilters());
      } else if (error) {
        console.error("Erro ao criar pedido:", error);
      }
    },
    [createPedido, error, getCurrentFilters, fetchPedidos]
  );
  const handleAddOrder = useCallback(
    async (order: CreatePedidoInput) => {
      await handleCreateOrder(order);
    },
    [handleCreateOrder]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  // ✅ Handlers que marcam interação do usuário
  const handleStatusChange = useCallback((status: string) => {
    setStatusFilter(status);
    setHasUserInteracted(true);
  }, []);

  const handleStartDateChange = useCallback((date: string) => {
    setStartDate(date);
    setHasUserInteracted(true);
  }, []);

  const handleEndDateChange = useCallback((date: string) => {
    setEndDate(date);
    setHasUserInteracted(true);
  }, []);

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-[calc(100dvh-93px)] container mx-auto p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-93px)] container mx-auto p-6 space-y-6">
      {/* Exibir erro se houver */}
      {error && (
        <div className="bg-destructive/15 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          <p className="font-medium">Erro:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Cards de Estatísticas */}
      <OrderStatsCards stats={stats} />

      {/* Filtros */}
      <OrderFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        startDate={startDate}
        endDate={endDate}
        onSearchChange={setSearchTerm}
        onStatusChange={handleStatusChange}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
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
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={true}
          onClose={handleCloseModal}
          onEdit={handleEditOrder}
        />
      )}

      {/* Modal de Edição */}
      <EditOrderModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveOrder}
        order={editingOrder}
      />

      {/* Modal de Transição de Status */}
      <StatusTransitionModal
        isOpen={isStatusModalOpen}
        onClose={handleCloseStatusModal}
        onConfirm={handleConfirmStatusChange}
        order={statusOrder}
      />
    </div>
  );
}
