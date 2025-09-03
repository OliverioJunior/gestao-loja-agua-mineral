"use client";

import { useState, useEffect, useCallback } from "react";

import { toast } from "sonner";
import {
  ICreateDespesa,
  IUpdateDespesa,
  IDespesaFilters,
  IDespesaStats,
  TDespesaWithUser,
} from "@/core/despesas/domain";
import {
  FormaPagamentoDespesa,
  CategoriaDespesa,
} from "@/infrastructure/generated/prisma";

export interface IDespesaEstoque {
  id: string;
  descricao: string;
  valor: number;
  data: Date;
  categoria: CategoriaDespesa;
  formaPagamento: FormaPagamentoDespesa;
  observacoes?: string;
  criadoPor: string;
  dataFormatada: string;
  valorFormatado: string;
}

export function useDespesas() {
  const [despesas, setDespesas] = useState<TDespesaWithUser[]>([]);
  const [stats, setStats] = useState<IDespesaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDespesa, setSelectedDespesa] =
    useState<TDespesaWithUser | null>(null);
  const [editingDespesa, setEditingDespesa] = useState<TDespesaWithUser | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingDespesa, setDeletingDespesa] =
    useState<TDespesaWithUser | null>(null);
  const [filters, setFilters] = useState<IDespesaFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState<
    CategoriaDespesa | "TODAS"
  >("TODAS");
  const [filterFormaPagamento, setFilterFormaPagamento] = useState<
    FormaPagamentoDespesa | "TODAS"
  >("TODAS");

  // Fetch despesas
  const fetchDespesas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append("search", searchTerm);
      if (filterCategoria !== "TODAS")
        queryParams.append("categoria", filterCategoria);
      if (filterFormaPagamento !== "TODAS")
        queryParams.append("formaPagamento", filterFormaPagamento);
      if (filters.dataInicio)
        queryParams.append("dataInicio", filters.dataInicio.toISOString());
      if (filters.dataFim)
        queryParams.append("dataFim", filters.dataFim.toISOString());
      if (filters.valorMinimo)
        queryParams.append("valorMinimo", filters.valorMinimo.toString());
      if (filters.valorMaximo)
        queryParams.append("valorMaximo", filters.valorMaximo.toString());

      const response = await fetch(`/api/despesas?${queryParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao carregar despesas", {
          style: {
            backgroundColor: "red",
            color: "white",
          },
        });
      }

      setDespesas(data.data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterCategoria, filterFormaPagamento, filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.dataInicio)
        queryParams.append("dataInicio", filters.dataInicio.toISOString());
      if (filters.dataFim)
        queryParams.append("dataFim", filters.dataFim.toISOString());

      const response = await fetch(
        `/api/despesas/stats?${queryParams.toString()}`
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao carregar estatísticas", {
          style: {
            backgroundColor: "red",
            color: "white",
          },
        });
        return;
      }

      setStats(data.data);
    } catch (err) {
      console.error("Erro ao carregar estatísticas:", err);
    }
  }, [filters.dataInicio, filters.dataFim]);

  // Create despesa
  const createDespesa = useCallback(
    async (data: ICreateDespesa) => {
      try {
        const response = await fetch("/api/despesas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.message || "Erro ao criar despesa", {
            style: {
              backgroundColor: "red",
              color: "white",
            },
          });
          return {
            success: false,
            error: result.message || "Erro ao criar despesa",
          };
        }

        toast.success("Despesa criada com sucesso!");
        await fetchDespesas();
        await fetchStats();
        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchDespesas, fetchStats]
  );

  // Update despesa
  const updateDespesa = useCallback(
    async (id: string, data: IUpdateDespesa) => {
      try {
        const response = await fetch(`/api/despesas/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.message || "Erro ao atualizar despesa", {
            style: {
              backgroundColor: "red",
              color: "white",
            },
          });
          return {
            success: false,
            error: result.message || "Erro ao atualizar despesa",
          };
        }

        toast.success("Despesa atualizada com sucesso!");
        await fetchDespesas();
        await fetchStats();
        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchDespesas, fetchStats]
  );

  // Delete despesa
  const deleteDespesa = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/despesas/${id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.message || "Erro ao excluir despesa", {
            style: {
              backgroundColor: "red",
              color: "white",
            },
          });
          return {
            success: false,
            error: result.message || "Erro ao excluir despesa",
          };
        }

        toast.success("Despesa excluída com sucesso!");
        await fetchDespesas();
        await fetchStats();
        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchDespesas, fetchStats]
  );

  // Event handlers
  const handleDespesaClick = useCallback((despesa: TDespesaWithUser) => {
    setSelectedDespesa(despesa);
  }, []);

  const handleAddDespesa = useCallback(() => {
    setEditingDespesa(null);
    setIsAddModalOpen(true);
  }, []);

  const handleEdit = useCallback((despesa: TDespesaWithUser) => {
    setEditingDespesa(despesa);
    setSelectedDespesa(null);
  }, []);

  const handleSaveEdit = useCallback(
    async (data: IUpdateDespesa) => {
      if (!editingDespesa)
        return { success: false, error: "Nenhuma despesa selecionada" };
      return await updateDespesa(editingDespesa.id, data);
    },
    [editingDespesa, updateDespesa]
  );

  const handleDelete = useCallback((despesa: TDespesaWithUser) => {
    setDeletingDespesa(despesa);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingDespesa)
      return { success: false, error: "Nenhuma despesa selecionada" };
    const result = await deleteDespesa(deletingDespesa.id);
    if (result.success) {
      setDeletingDespesa(null);
    }
    return result;
  }, [deletingDespesa, deleteDespesa]);

  const handleCloseModal = useCallback(() => {
    setSelectedDespesa(null);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsAddModalOpen(false);
    setEditingDespesa(null);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeletingDespesa(null);
  }, []);

  // Filtered despesas
  const filteredDespesas = despesas.filter((despesa) => {
    const matchesSearch =
      !searchTerm ||
      despesa.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (despesa.observacoes &&
        despesa.observacoes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategoria =
      filterCategoria === "TODAS" || despesa.categoria === filterCategoria;
    const matchesFormaPagamento =
      filterFormaPagamento === "TODAS" ||
      despesa.formaPagamento === filterFormaPagamento;

    return matchesSearch && matchesCategoria && matchesFormaPagamento;
  });

  // Load data on mount and when filters change
  useEffect(() => {
    fetchDespesas();
  }, [fetchDespesas]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    // Data
    despesas: filteredDespesas,
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
    filters,

    // Actions
    createDespesa,
    updateDespesa,
    deleteDespesa,
    fetchDespesas,
    fetchStats,

    // Setters
    setSearchTerm,
    setFilterCategoria,
    setFilterFormaPagamento,
    setFilters,
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
  };
}
