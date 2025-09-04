"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  TCompraWithRelations,
  UpdateCompraInput,
} from "../domain/compra.entity";
import { CreateCompraWithItensInput } from "../layout/types";
import { Compra } from "../domain";

export interface ICompraHook {
  // Estados principais
  compras: TCompraWithRelations[];
  loading: boolean;
  error: string | null;

  // Estados de UI
  searchTerm: string;
  statusFilter: string;
  dateFilter: {
    startDate: Date | null;
    endDate: Date | null;
  };
  selectedCompra: TCompraWithRelations | null;
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDetailsModalOpen: boolean;
  isDeleteModalOpen: boolean;

  // Operações CRUD
  fetchCompras: () => Promise<void>;
  createCompra: (data: CreateCompraWithItensInput) => Promise<void>;
  updateCompra: (id: string, data: UpdateCompraInput) => Promise<void>;
  deleteCompra: (id: string) => Promise<void>;

  // Operações específicas
  fetchComprasByFornecedor: (fornecedorId: string) => Promise<void>;
  fetchComprasByStatus: (status: string) => Promise<void>;
  fetchComprasByDateRange: (startDate: Date, endDate: Date) => Promise<void>;
  searchByNumeroNota: (numeroNota: string) => Promise<void>;
  confirmarCompra: (id: string) => Promise<void>;
  receberCompra: (id: string) => Promise<void>;
  cancelarCompra: (id: string) => Promise<void>;
  getStatistics: () => Promise<{
    total: number;
    pendentes: number;
    confirmadas: number;
    recebidas: number;
    canceladas: number;
    valorTotal: number;
    valorMedio: number;
  } | null>;

  // Handlers de UI
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setDateFilter: (filter: {
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
  handleCompraClick: (compra: TCompraWithRelations) => void;
  handleAddClick: () => void;
  handleEditClick: (compra: TCompraWithRelations) => void;
  handleDeleteClick: (compra: TCompraWithRelations) => void;
  handleCloseModals: () => void;

  // Dados computados
  filteredCompras: TCompraWithRelations[];
  totalCompras: number;
  comprasPendentes: number;
  comprasConfirmadas: number;
  comprasRecebidas: number;
  comprasCanceladas: number;
  valorTotalFiltrado: number;
}

export const useCompras = (): ICompraHook => {
  // Estados principais
  const [compras, setCompras] = useState<TCompraWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de UI
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [dateFilter, setDateFilter] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });
  const [selectedCompra, setSelectedCompra] =
    useState<TCompraWithRelations | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Operações CRUD
  const fetchCompras = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/compra");
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Erro ao carregar compras");
      }

      setCompras(data.data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar compras";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCompra = useCallback(
    async (data: CreateCompraWithItensInput) => {
      try {
        setLoading(true);

        const response = await fetch("/api/compra", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Erro ao criar compra");
        }

        await fetchCompras();
        toast.success("Compra criada com sucesso!");
        handleCloseModals();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao criar compra";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchCompras]
  );

  const updateCompra = useCallback(
    async (id: string, data: UpdateCompraInput) => {
      try {
        setLoading(true);

        const response = await fetch(`/api/compra/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Erro ao atualizar compra");
        }

        await fetchCompras();
        toast.success("Compra atualizada com sucesso!");
        handleCloseModals();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao atualizar compra";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchCompras]
  );

  const deleteCompra = useCallback(
    async (id: string) => {
      try {
        setLoading(true);

        const response = await fetch(`/api/compra/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Erro ao excluir compra");
        }

        await fetchCompras();
        toast.success("Compra excluída com sucesso!");
        handleCloseModals();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao excluir compra";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchCompras]
  );

  // Operações específicas
  const fetchComprasByFornecedor = useCallback(async (fornecedorId: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCompras = await Compra.service.findByFornecedorId(
        fornecedorId
      );
      setCompras(fetchedCompras);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao carregar compras por fornecedor";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComprasByStatus = useCallback(async (status: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCompras = await Compra.service.findByStatus(status);
      setCompras(fetchedCompras);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao carregar compras por status";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComprasByDateRange = useCallback(
    async (startDate: Date, endDate: Date) => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCompras = await Compra.service.findByDateRange(
          startDate,
          endDate
        );
        setCompras(fetchedCompras);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro ao carregar compras por período";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const searchByNumeroNota = useCallback(async (numeroNota: string) => {
    try {
      setLoading(true);
      setError(null);
      const compra = await Compra.service.findByNumeroNota(numeroNota);
      setCompras(compra ? [compra] : []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao buscar compra por número da nota";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmarCompra = useCallback(
    async (id: string) => {
      try {
        const response = await fetch("/api/compra/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            compraId: id,
            status: "CONFIRMADA",
          }),
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Erro ao confirmar compra");
        }

        await fetchCompras();
        toast.success("Compra confirmada com sucesso!");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao confirmar compra";
        toast.error(errorMessage);
      }
    },
    [fetchCompras]
  );

  const receberCompra = useCallback(
    async (id: string) => {
      try {
        const response = await fetch("/api/compra/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            compraId: id,
            status: "RECEBIDA",
          }),
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Erro ao receber compra");
        }

        await fetchCompras();
        toast.success("Compra recebida com sucesso!");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao receber compra";
        toast.error(errorMessage);
      }
    },
    [fetchCompras]
  );

  const cancelarCompra = useCallback(
    async (id: string) => {
      try {
        const response = await fetch("/api/compra/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            compraId: id,
            status: "CANCELADA",
          }),
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Erro ao cancelar compra");
        }

        await fetchCompras();
        toast.success("Compra cancelada com sucesso!");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao cancelar compra";
        toast.error(errorMessage);
      }
    },
    [fetchCompras]
  );

  const getStatistics = useCallback(async () => {
    try {
      const response = await fetch("/api/compra/stats");
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Erro ao obter estatísticas");
      }

      return data.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao obter estatísticas";
      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Handlers de UI
  const handleCompraClick = useCallback((compra: TCompraWithRelations) => {
    setSelectedCompra(compra);
    setIsDetailsModalOpen(true);
  }, []);

  const handleAddClick = useCallback(() => {
    setSelectedCompra(null);
    setIsAddModalOpen(true);
  }, []);

  const handleEditClick = useCallback((compra: TCompraWithRelations) => {
    setSelectedCompra(compra);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((compra: TCompraWithRelations) => {
    setSelectedCompra(compra);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseModals = useCallback(() => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCompra(null);
  }, []);

  // Dados computados
  const filteredCompras = useMemo(() => {
    let filtered = compras;

    // Filtrar por status
    if (statusFilter !== "TODOS") {
      filtered = filtered.filter((compra) => compra.status === statusFilter);
    }

    // Filtrar por termo de busca
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (compra) =>
          compra.numeroNota?.toLowerCase().includes(term) ||
          compra.fornecedor?.nome?.toLowerCase().includes(term) ||
          compra.fornecedor?.razaoSocial?.toLowerCase().includes(term) ||
          compra.observacoes?.toLowerCase().includes(term)
      );
    }

    // Filtrar por intervalo de datas
    if (dateFilter.startDate && dateFilter.endDate) {
      filtered = filtered.filter((compra) => {
        const dataCompra = new Date(compra.dataCompra);
        return (
          dataCompra >= dateFilter.startDate! &&
          dataCompra <= dateFilter.endDate!
        );
      });
    }

    return filtered;
  }, [compras, statusFilter, searchTerm, dateFilter]);

  const totalCompras = useMemo(() => filteredCompras.length, [filteredCompras]);

  const comprasPendentes = useMemo(() => {
    return filteredCompras.filter((c) => c.status === "PENDENTE").length;
  }, [filteredCompras]);

  const comprasConfirmadas = useMemo(() => {
    return filteredCompras.filter((c) => c.status === "CONFIRMADA").length;
  }, [filteredCompras]);

  const comprasRecebidas = useMemo(() => {
    return filteredCompras.filter((c) => c.status === "RECEBIDA").length;
  }, [filteredCompras]);

  const comprasCanceladas = useMemo(() => {
    return filteredCompras.filter((c) => c.status === "CANCELADA").length;
  }, [filteredCompras]);

  const valorTotalFiltrado = useMemo(() => {
    return filteredCompras.reduce((sum, compra) => {
      if (["CONFIRMADA", "RECEBIDA"].includes(compra.status)) {
        return sum + compra.total;
      }
      return sum;
    }, 0);
  }, [filteredCompras]);

  // Effects
  useEffect(() => {
    fetchCompras();
  }, [fetchCompras]);

  // Return
  return {
    // Estados principais
    compras: filteredCompras,
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
    fetchCompras,
    createCompra,
    updateCompra,
    deleteCompra,

    // Operações específicas
    fetchComprasByFornecedor,
    fetchComprasByStatus,
    fetchComprasByDateRange,
    searchByNumeroNota,
    confirmarCompra,
    receberCompra,
    cancelarCompra,
    getStatistics,

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
    filteredCompras,
    totalCompras,
    comprasPendentes,
    comprasConfirmadas,
    comprasRecebidas,
    comprasCanceladas,
    valorTotalFiltrado,
  };
};
