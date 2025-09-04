"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import {
  CompraStatsCards,
  CompraFilters,
  CompraTable,
  CompraDetailsModal,
  AddCompraModal,
  EditCompraModal,
  DeleteCompraModal,
} from "@/core/compra/layout";
import { useCompras } from "@/core/compra/hooks";
import { Plus, BarChart3, Activity } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

export default function ComprasPage() {
  const {
    // Estados principais
    compras,
    loading,
    error,

    // Estados de UI
    searchTerm,
    statusFilter,
    dateFilter,
    selectedCompra,
    isAddModalOpen,
    isEditModalOpen,
    isDetailsModalOpen,
    isDeleteModalOpen,

    // Operações CRUD
    createCompra,
    updateCompra,
    deleteCompra,

    // Operações específicas
    confirmarCompra,
    receberCompra,
    cancelarCompra,

    // Handlers de UI
    setSearchTerm,
    setStatusFilter,
    setDateFilter,
    handleCompraClick,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleCloseModals,

    // Dados computados
    totalCompras,
    comprasPendentes,
    comprasConfirmadas,
    comprasRecebidas,
    comprasCanceladas,
    valorTotalFiltrado,
  } = useCompras();

  if (loading && compras.length === 0) {
    return (
      <main className="min-h-[calc(100dvh-93px)] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando compras...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100dvh-93px)] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100dvh-93px)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compras</h1>
            <p className="text-muted-foreground">
              Gerencie as compras da empresa e controle o estoque
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/compras/dashboard">
              <Button variant="outline" className="gap-2">
                <Activity className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/compras/relatorios">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Relatórios
              </Button>
            </Link>
            <Button onClick={handleAddClick} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Compra
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <CompraStatsCards
          totalCompras={totalCompras}
          comprasPendentes={comprasPendentes}
          comprasConfirmadas={comprasConfirmadas}
          comprasRecebidas={comprasRecebidas}
          comprasCanceladas={comprasCanceladas}
          valorTotal={valorTotalFiltrado}
          loading={loading}
        />

        {/* Filtros */}
        <CompraFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          totalCompras={totalCompras}
          comprasPendentes={comprasPendentes}
          comprasConfirmadas={comprasConfirmadas}
          comprasRecebidas={comprasRecebidas}
          comprasCanceladas={comprasCanceladas}
          valorTotal={valorTotalFiltrado}
        />

        {/* Tabela de Compras */}
        <Card>
          <CardContent className="p-0">
            <CompraTable
              compras={compras}
              loading={loading}
              onView={handleCompraClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onConfirmar={confirmarCompra}
              onReceber={receberCompra}
              onCancelar={cancelarCompra}
            />
          </CardContent>
        </Card>

        {/* Modal de Detalhes */}
        <CompraDetailsModal
          compra={selectedCompra}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseModals}
        />

        {/* Modal de Adição */}
        <AddCompraModal
          isOpen={isAddModalOpen}
          onClose={handleCloseModals}
          onSubmit={createCompra}
        />

        {/* Modal de Edição */}
        <EditCompraModal
          compra={selectedCompra}
          isOpen={isEditModalOpen}
          onClose={handleCloseModals}
          onSubmit={updateCompra}
        />

        {/* Modal de Exclusão */}
        <DeleteCompraModal
          compra={selectedCompra}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onConfirm={deleteCompra}
        />
      </div>
    </main>
  );
}
