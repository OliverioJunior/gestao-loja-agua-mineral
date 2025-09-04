"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import {
  FornecedorStatsCards,
  FornecedorFilters,
  FornecedorTable,
  FornecedorDetailsModal,
  AddFornecedorModal,
  EditFornecedorModal,
  DeleteFornecedorModal,
} from "@/core/fornecedor/layout";
import { useFornecedores } from "@/core/fornecedor/hooks";
import { Plus, Building } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function FornecedoresPage() {
  const {
    // Estados principais
    fornecedores,
    loading,
    error,

    // Estados de UI
    searchTerm,
    statusFilter,
    selectedFornecedor,
    isAddModalOpen,
    isEditModalOpen,
    isDetailsModalOpen,
    isDeleteModalOpen,

    // Operações CRUD
    createFornecedor,
    updateFornecedor,
    deleteFornecedor,

    // Handlers de UI
    setSearchTerm,
    setStatusFilter,
    handleFornecedorClick,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleCloseModals,

    // Dados computados
    totalFornecedores,
    activeFornecedores,
    inactiveFornecedores,
    filteredFornecedores,
  } = useFornecedores();

  if (loading && fornecedores.length === 0) {
    return (
      <main className="min-h-[calc(100dvh-93px)] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Carregando fornecedores...
              </p>
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
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building className="h-8 w-8" />
              Gestão de Fornecedores
            </h1>
            <p className="text-muted-foreground">
              Gerencie fornecedores, cadastre novos parceiros e mantenha
              informações atualizadas
            </p>
          </div>
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Fornecedor
          </Button>
        </div>

        {/* Cards de Estatísticas */}
        <FornecedorStatsCards
          totalFornecedores={totalFornecedores}
          activeFornecedores={activeFornecedores}
          inactiveFornecedores={inactiveFornecedores}
          loading={loading}
        />

        {/* Filtros */}
        <FornecedorFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          totalFornecedores={totalFornecedores}
          activeFornecedores={activeFornecedores}
          inactiveFornecedores={inactiveFornecedores}
        />

        {/* Tabela de Fornecedores */}
        <Card>
          <CardContent className="p-0">
            <FornecedorTable
              fornecedores={filteredFornecedores}
              loading={loading}
              onView={handleFornecedorClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </CardContent>
        </Card>

        {/* Modal de Detalhes */}
        <FornecedorDetailsModal
          fornecedor={selectedFornecedor}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseModals}
        />

        {/* Modal de Adição */}
        <AddFornecedorModal
          isOpen={isAddModalOpen}
          onClose={handleCloseModals}
          onSubmit={createFornecedor}
        />

        {/* Modal de Edição */}
        <EditFornecedorModal
          fornecedor={selectedFornecedor}
          isOpen={isEditModalOpen}
          onClose={handleCloseModals}
          onSubmit={updateFornecedor}
        />

        {/* Modal de Exclusão */}
        <DeleteFornecedorModal
          fornecedor={selectedFornecedor}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onConfirm={deleteFornecedor}
        />
      </div>
    </main>
  );
}
