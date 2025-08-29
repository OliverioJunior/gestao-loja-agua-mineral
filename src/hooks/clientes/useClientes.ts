import { useState, useEffect, useMemo, useCallback } from "react";
import { IClientStats } from "@/layout/clientes/types";
import {
  CreateClienteInput,
  TClienteWithAdressAndCount,
  TClienteWithCount,
  UpdateClienteInput,
} from "@/core/cliente/cliente.entity";
import { toast } from "sonner";

export const useClientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [clients, setClients] = useState<TClienteWithAdressAndCount[]>([]);
  const [selectedClient, setSelectedClient] =
    useState<TClienteWithAdressAndCount | null>(null);
  const [editingClient, setEditingClient] =
    useState<TClienteWithAdressAndCount | null>(null);
  const [deletingClient, setDeletingClient] =
    useState<TClienteWithCount | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar clientes do banco de dados
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/cliente");
      if (!response.ok) {
        throw new Error("Erro ao buscar clientes");
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setError("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Filtrar clientes
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.telefone.includes(searchTerm);

      const matchesStatus =
        filterStatus === "todos" ||
        (filterStatus === "ativo" && client.status === "ATIVO") ||
        (filterStatus === "inativo" && client.status === "INATIVO");

      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, filterStatus]);

  // Calcular estatísticas
  const stats = useMemo((): IClientStats => {
    const total = clients.length;
    const active = clients.filter((client) => client.status === "ATIVO").length;
    const inactive = clients.filter(
      (client) => client.status === "INATIVO"
    ).length;

    // Clientes novos este mês
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
  }, [clients]);

  // Handlers
  const handleClientClick = useCallback(
    (client: TClienteWithAdressAndCount) => {
      setSelectedClient(client);
    },
    []
  );

  const handleAddClient = useCallback(
    async (clientData: Partial<CreateClienteInput>) => {
      try {
        setError(null);
        const response = await fetch("/api/cliente/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clientData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || "Erro ao criar cliente", {
            style: {
              background: "red",
              color: "white",
            },
          });
          return errorData.message || "Erro ao criar cliente";
        }

        const newClient = await response.json();
        setClients((prev) => [newClient, ...prev]);
        setIsAddModalOpen(false);
      } catch (error) {
        console.error("Erro ao criar cliente:", error);
        setError(
          error instanceof Error ? error.message : "Erro ao criar cliente"
        );
        return error;
      }
    },
    []
  );

  const handleEdit = useCallback((client: TClienteWithAdressAndCount) => {
    setEditingClient(client);
    setSelectedClient(null);
  }, []);

  const handleSaveEdit = useCallback(
    async (updatedClient: UpdateClienteInput) => {
      if (!editingClient) return;

      try {
        setError(null);
        const response = await fetch("/api/cliente/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: editingClient.id, ...updatedClient }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao atualizar cliente");
        }

        const updated = await response.json();
        setClients((prev) =>
          prev.map((client) =>
            client.id === editingClient.id ? updated : client
          )
        );
        setEditingClient(null);
      } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        setError(
          error instanceof Error ? error.message : "Erro ao atualizar cliente"
        );
        throw error;
      }
    },
    [editingClient]
  );

  const handleDelete = useCallback((client: TClienteWithCount) => {
    setDeletingClient(client);
  }, []);

  const handleConfirmDelete = useCallback(async (client: TClienteWithCount) => {
    try {
      setError(null);
      const response = await fetch("/api/cliente/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: client.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao excluir cliente");
      }

      setClients((prev) => prev.filter((c) => c.id !== client.id));
      setDeletingClient(null);
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      setError(
        error instanceof Error ? error.message : "Erro ao excluir cliente"
      );
      throw error;
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedClient(null);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditingClient(null);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeletingClient(null);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  return {
    // State
    searchTerm,
    filterStatus,
    clients,
    selectedClient,
    editingClient,
    deletingClient,
    isAddModalOpen,
    filteredClients,
    stats,
    loading,
    error,

    // Setters
    setSearchTerm,
    setFilterStatus,

    // Handlers
    handleClientClick,
    handleAddClient,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleConfirmDelete,
    handleCloseModal,
    handleCloseEditModal,
    handleCloseDeleteModal,
    handleCloseAddModal,
    handleOpenAddModal,
    fetchClients,
  };
};
