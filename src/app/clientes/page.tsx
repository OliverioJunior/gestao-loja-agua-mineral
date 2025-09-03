"use client";
import { Card, CardContent } from "@/shared/components/ui";
import {
  ClientFilters,
  ClientDetailsModal,
  ClientStatsCards,
  ClientTable,
  EditClientModal,
  DeleteClientModal,
} from "@/core/cliente/layout";
import { useClientes } from "@/core/cliente/hooks/useClientes";

export default function ClientesPage() {
  const {
    searchTerm,
    filterStatus,
    selectedClient,
    editingClient,
    deletingClient,
    filteredClients,
    stats,
    loading,
    error,
    setSearchTerm,
    setFilterStatus,
    handleClientClick,
    handleAddClient,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleConfirmDelete,
    handleCloseModal,
    handleCloseEditModal,
    handleCloseDeleteModal,
  } = useClientes();

  if (loading) {
    return (
      <main className="min-h-[calc(100dvh-93px)] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando clientes...</p>
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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <ClientStatsCards stats={stats} />

          <Card className="bg-card/60 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <ClientFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterStatus={filterStatus}
                onFilterStatusChange={setFilterStatus}
                onAddClient={handleAddClient}
              />

              <ClientTable
                clients={filteredClients}
                onView={handleClientClick}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>

          {/* Modal de Detalhes */}
          <ClientDetailsModal
            client={selectedClient}
            isOpen={!!selectedClient}
            onClose={handleCloseModal}
            onEdit={handleEdit}
          />

          {/* Modal de Edição */}
          <EditClientModal
            client={editingClient}
            isOpen={!!editingClient}
            onClose={handleCloseEditModal}
            onSubmit={handleSaveEdit}
          />

          {/* Modal de Confirmação de Exclusão */}
          <DeleteClientModal
            client={deletingClient}
            isOpen={!!deletingClient}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
          />
        </div>
      </div>
    </main>
  );
}
