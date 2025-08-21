"use client";

import { useState, useEffect, useCallback } from "react";
import { IPedidoStats, ICreatePedido } from "@/layout/pedidos/types";
import { TPedidoWithRelations } from "@/core/pedidos";

export interface UsePedidosReturn {
  pedidos: TPedidoWithRelations[];
  stats: IPedidoStats | null;
  loading: boolean;
  error: string | null;
  fetchPedidos: () => Promise<void>;
  fetchStats: () => Promise<void>;
  createPedido: (data: ICreatePedido) => Promise<boolean>;
  updatePedido: (
    id: string,
    data: Partial<TPedidoWithRelations>
  ) => Promise<boolean>;
  updateStatus: (
    id: string,
    status: TPedidoWithRelations["status"]
  ) => Promise<boolean>;
  deletePedido: (id: string) => Promise<boolean>;
  findByCliente: (clienteId: string) => Promise<TPedidoWithRelations[]>;
  findByStatus: (
    status: TPedidoWithRelations["status"]
  ) => Promise<TPedidoWithRelations[]>;
}

export function usePedidos(): UsePedidosReturn {
  const [pedidos, setPedidos] = useState<TPedidoWithRelations[]>([]);
  const [stats, setStats] = useState<IPedidoStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPedidos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/pedido");
      if (!response.ok) {
        throw new Error("Erro ao carregar pedidos");
      }

      const data: TPedidoWithRelations[] = await response.json();
      setPedidos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);

      const response = await fetch("/api/pedido/stats");
      if (!response.ok) {
        throw new Error("Erro ao carregar estatísticas");
      }

      const data: IPedidoStats = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  }, []);

  const createPedido = useCallback(
    async (data: ICreatePedido): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/pedido/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao criar pedido");
        }

        // Recarregar pedidos após criação
        await fetchPedidos();
        await fetchStats();

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchPedidos, fetchStats]
  );

  const updatePedido = useCallback(
    async (
      id: string,
      data: Partial<TPedidoWithRelations>
    ): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/pedido/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, ...data }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao atualizar pedido");
        }

        // Recarregar pedidos após atualização
        await fetchPedidos();
        await fetchStats();

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchPedidos, fetchStats]
  );

  const updateStatus = useCallback(
    async (
      id: string,
      status: TPedidoWithRelations["status"]
    ): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/pedido/status", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, status }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao atualizar status");
        }

        // Recarregar pedidos após atualização
        await fetchPedidos();
        await fetchStats();

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchPedidos, fetchStats]
  );

  const deletePedido = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/pedido/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao deletar pedido");
        }

        // Recarregar pedidos após exclusão
        await fetchPedidos();
        await fetchStats();

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchPedidos, fetchStats]
  );

  const findByCliente = useCallback(
    async (clienteId: string): Promise<TPedidoWithRelations[]> => {
      try {
        setError(null);

        const response = await fetch(`/api/pedido?clienteId=${clienteId}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar pedidos do cliente");
        }

        const data: TPedidoWithRelations[] = await response.json();
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        return [];
      }
    },
    []
  );

  const findByStatus = useCallback(
    async (
      status: TPedidoWithRelations["status"]
    ): Promise<TPedidoWithRelations[]> => {
      try {
        setError(null);

        const response = await fetch(`/api/pedido?status=${status}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar pedidos por status");
        }

        const data: TPedidoWithRelations[] = await response.json();
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        return [];
      }
    },
    []
  );

  // Carregar pedidos e estatísticas na inicialização
  useEffect(() => {
    fetchPedidos();
    fetchStats();
  }, [fetchPedidos, fetchStats]);

  return {
    pedidos,
    stats,
    loading,
    error,
    fetchPedidos,
    fetchStats,
    createPedido,
    updatePedido,
    updateStatus,
    deletePedido,
    findByCliente,
    findByStatus,
  };
}
