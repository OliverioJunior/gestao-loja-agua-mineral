"use client";

import { useState, useMemo, useCallback } from "react";
import {
  OrderStatsCards,
  OrderFilters,
  OrderTable,
  OrderDetailsModal,
  EditOrderModal,
  StatusTransitionModal,
  IPedidoStats,
  ICreatePedido,
} from "@/core/pedidos/layout";
import { usePedidos } from "@/core/pedidos/hooks/usePedidos";
import { useVendas } from "@/core/vendas/hooks";
import { TPedidoWithRelations } from "@/core/pedidos/domain";

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
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
    updateStatus,
    deletePedido,
    createPedido,
    updatePedido,
  } = usePedidos();
  const { createVendas } = useVendas();
  // Optimized filtering with better search logic
  const filteredOrders = useMemo(() => {
    if (!searchTerm && statusFilter === "todos") return orders;

    const searchLower = searchTerm.toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        !searchTerm ||
        order.endereco?.numero.toLowerCase().includes(searchLower) ||
        order.cliente!.nome.toLowerCase().includes(searchLower) ||
        order.cliente!.telefone.includes(searchTerm);

      const matchesStatus =
        statusFilter === "todos" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

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
      } else if (error) {
        console.error("Erro ao atualizar pedido:", error);
      }
    },
    [updatePedido, error]
  );

  const handleDeleteOrder = useCallback(
    async (orderId: string) => {
      const success = await deletePedido(orderId);
      if (!success && error) {
        console.error("Erro ao deletar pedido:", error);
      }
    },
    [deletePedido, error]
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
    async (orderId: string, newStatus: TPedidoWithRelations["status"]) => {
      const success = await updateStatus(orderId, newStatus);
      if (newStatus === "ENTREGUE") {
        await createVendas(orderId);
      }
      if (!success && error) {
        console.error("Erro ao atualizar status:", error);
        throw new Error("Erro ao atualizar status");
      }
    },
    [updateStatus, error, createVendas]
  );
  const handleCreateOrder = useCallback(
    async (orderData: ICreatePedido) => {
      const success = await createPedido(orderData);
      if (success) {
        setIsAddModalOpen(false);
      } else if (error) {
        console.error("Erro ao criar pedido:", error);
      }
    },
    [createPedido, error]
  );
  const handleAddOrder = useCallback(
    async (order: ICreatePedido) => {
      await handleCreateOrder(order);
    },
    [handleCreateOrder]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedOrder(null);
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
