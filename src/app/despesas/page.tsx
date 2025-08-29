"use client";

import { Card, CardContent } from "@/shared/components/ui";
import {
  DespesaStatsCards,
  DespesaFilters,
  DespesaTable,
  DespesaDetailsModal,
  EditDespesaModal,
  DeleteDespesaModal,
} from "@/layout/despesas";
import { useDespesas } from "@/hooks/despesas";
import { ICreateDespesa, IUpdateDespesa } from "@/core/despesas";
import { useEffect } from "react";

export default function DespesasPage() {
  const {
    // Data
    despesas,
    stats,
    loading,
    error,
    selectedDespesa,
    editingDespesa,
    deletingDespesa,
    isAddModalOpen,

    // Filters
    searchTerm,
    filterCategoria,
    filterFormaPagamento,

    // Actions
    createDespesa,

    // Setters
    setSearchTerm,
    setFilterCategoria,
    setFilterFormaPagamento,
    setIsAddModalOpen,

    // Event handlers
    handleDespesaClick,
    handleAddDespesa,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleConfirmDelete,
    handleCloseModal,
    handleCloseEditModal,
    handleCloseDeleteModal,
  } = useDespesas();
  useEffect(() => {
    console.log(isAddModalOpen);
  }, [isAddModalOpen]);
  if (loading && despesas.length === 0) {
    return (
      <main className="min-h-[calc(100dvh-93px)] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando despesas...</p>
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
        {/* Cards de Estatísticas */}
        <DespesaStatsCards stats={stats} loading={loading} />

        {/* Filtros */}
        <DespesaFilters
          searchTerm={searchTerm}
          filterCategoria={filterCategoria}
          filterFormaPagamento={filterFormaPagamento}
          onSearchChange={setSearchTerm}
          onCategoriaChange={setFilterCategoria}
          onFormaPagamentoChange={setFilterFormaPagamento}
          onAddDespesa={() => {
            handleAddDespesa();
            setIsAddModalOpen(true);
          }}
        />

        {/* Tabela de Despesas */}
        <Card>
          <CardContent className="p-0">
            <DespesaTable
              despesas={despesas}
              loading={loading}
              onView={handleDespesaClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>

        {/* Modal de Detalhes */}
        <DespesaDetailsModal
          despesa={selectedDespesa}
          isOpen={!!selectedDespesa}
          onClose={handleCloseModal}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Modal de Edição/Criação */}
        <EditDespesaModal
          despesa={editingDespesa}
          isOpen={isAddModalOpen}
          onClose={handleCloseEditModal}
          onSave={async (data) => {
            if (editingDespesa) {
              return await handleSaveEdit(data as IUpdateDespesa);
            } else {
              return await createDespesa(data as ICreateDespesa);
            }
          }}
          mode={editingDespesa ? "edit" : "create"}
        />

        {/* Modal de Exclusão */}
        <DeleteDespesaModal
          despesa={deletingDespesa}
          isOpen={!!deletingDespesa}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </main>
  );
}
