"use client";

import { useState, useEffect, useCallback } from "react";
import { IPedidoStats, ICreatePedido } from "@/core/pedidos/layout/types";
import { TPedidoWithRelations } from "@/core/pedidos/domain";
import { toast } from "sonner";
import { PaginatedResponse, FetchPedidosParams, UsePedidosReturn } from "./entity";

/**
 * Hook utilitário para gerenciamento completo de pedidos
 * Fornece funcionalidades CRUD, paginação, filtros e estatísticas
 */
export const usePedidos = (): UsePedidosReturn => {
  // Estados centralizados do hook
  const [pedidos, setPedidos] = useState<TPedidoWithRelations[]>([]);
  const [stats, setStats] = useState<IPedidoStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginatedResponse<TPedidoWithRelations>["pagination"] | null>(null);

  /**
   * Constrói URL com parâmetros de query de forma otimizada
   * @param params - Parâmetros de filtro e paginação
   * @returns URL formatada com query string
   */
  const buildApiUrl = useCallback((params?: FetchPedidosParams): string => {
     const searchParams = new URLSearchParams();
     
     // Adiciona parâmetros de paginação se habilitada
     if (params?.paginated) searchParams.append("paginated", "true");
     if (params?.page) searchParams.append("page", params.page.toString());
     if (params?.limit) searchParams.append("limit", params.limit.toString());
     
     // Adiciona filtros se fornecidos
     if (params?.clienteId) searchParams.append("clienteId", params.clienteId);
     if (params?.status) searchParams.append("status", params.status);
     if (params?.startDate) searchParams.append("startDate", params.startDate);
     if (params?.endDate) searchParams.append("endDate", params.endDate);
    
    const queryString = searchParams.toString();
    return `/api/pedido${queryString ? `?${queryString}` : ""}`;
  }, []);

  /**
     * Processa resposta da API baseada no tipo (paginada ou tradicional)
     * @param data - Dados retornados da API
     * @param isPaginated - Se a resposta é paginada
     */
    const processApiResponse = useCallback((data: PaginatedResponse<TPedidoWithRelations> | TPedidoWithRelations[], isPaginated: boolean) => {
     if (isPaginated && 'data' in data && 'pagination' in data) {
       const { data: pedidosData, pagination: paginationData } = data;
       setPedidos(pedidosData);
       setPagination(paginationData);
     } else {
       setPedidos(data as TPedidoWithRelations[]);
       setPagination(null);
     }
   }, []);

  /**
   * Exibe toast de erro padronizado
   * @param message - Mensagem de erro
   */
  const showErrorToast = useCallback((message: string) => {
    toast.error(message, {
      style: { backgroundColor: "red", color: "white" }
    });
  }, []);

  /**
   * Exibe toast de sucesso padronizado
   * @param message - Mensagem de sucesso
   */
  const showSuccessToast = useCallback((message: string) => {
    toast.success(message, {
      style: { backgroundColor: "green", color: "white" }
    });
  }, []);

  /**
   * Busca pedidos com suporte a paginação e filtros
   * Atualiza o estado local automaticamente
   */
  const fetchPedidos = useCallback(async (params?: FetchPedidosParams): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const url = buildApiUrl(params);
      const response = await fetch(url);

      if (!response.ok) {
        showErrorToast("Erro ao carregar pedidos");
        return;
      }

      const data = await response.json();
      processApiResponse(data, Boolean(params?.paginated));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [buildApiUrl, processApiResponse, showErrorToast]);

  /**
   * Busca pedidos paginados e retorna resposta completa
   * Não atualiza estado local - usado para operações específicas
   */
  const fetchPedidosPaginated = useCallback(
    async (params: FetchPedidosParams & { paginated: true }): Promise<PaginatedResponse<TPedidoWithRelations>> => {
      try {
        setError(null);
        
        const url = buildApiUrl(params);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Erro ao carregar pedidos paginados");
        }

        return await response.json() as PaginatedResponse<TPedidoWithRelations>;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
        setError(errorMessage);
        throw err;
      }
    },
    [buildApiUrl]
  );

  /**
   * Carrega estatísticas dos pedidos
   */
  const fetchStats = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      
      const response = await fetch("/api/pedido/stats");
      
      if (!response.ok) {
        throw new Error("Erro ao carregar estatísticas");
      }

      const data = await response.json() as IPedidoStats;
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    }
  }, []);

  /**
   * Recarrega dados após operações CRUD
   */
  const refreshData = useCallback(async (): Promise<void> => {
    await Promise.all([fetchPedidos(), fetchStats()]);
  }, [fetchPedidos, fetchStats]);

  /**
   * Executa requisição HTTP com tratamento de erro padronizado
   * @param url - Endpoint da API
   * @param options - Opções da requisição fetch
   * @param successMessage - Mensagem de sucesso (opcional)
   */
  const executeRequest = useCallback(
    async (url: string, options: RequestInit, successMessage?: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, {
          headers: { "Content-Type": "application/json" },
          ...options
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData?.error || `Erro na requisição: ${response.status}`;
          
          if (options.method === "POST") {
            showErrorToast(errorMessage);
            return false;
          }
          
          throw new Error(errorMessage);
        }

        await refreshData();
         if (successMessage) showSuccessToast(successMessage);
         return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [refreshData, showErrorToast, showSuccessToast]
  );

  /**
   * Cria novo pedido
   */
  const createPedido = useCallback(
    async (data: ICreatePedido): Promise<boolean> => 
      executeRequest(
        "/api/pedido/create",
        { method: "POST", body: JSON.stringify(data) },
        "Pedido criado com sucesso!"
      ),
    [executeRequest]
  );

  /**
   * Atualiza pedido existente
   */
  const updatePedido = useCallback(
    async (id: string, data: Partial<TPedidoWithRelations>): Promise<boolean> =>
      executeRequest(
        "/api/pedido/update",
        { method: "PUT", body: JSON.stringify({ id, ...data }) }
      ),
    [executeRequest]
  );

  /**
   * Atualiza status do pedido
   */
  const updateStatus = useCallback(
    async (id: string, status: TPedidoWithRelations["status"]): Promise<boolean> =>
      executeRequest(
        "/api/pedido/status",
        { method: "PUT", body: JSON.stringify({ id, status }) }
      ),
    [executeRequest]
  );

  /**
   * Remove pedido
   */
  const deletePedido = useCallback(
    async (id: string): Promise<boolean> =>
      executeRequest(
        "/api/pedido/delete",
        { method: "DELETE", body: JSON.stringify({ id }) }
      ),
    [executeRequest]
  );

  /**
   * Executa busca específica sem afetar estado local
   * @param url - URL da busca
   * @param errorMessage - Mensagem de erro personalizada
   */
  const executeSearch = useCallback(
    async <T>(url: string, errorMessage: string): Promise<T> => {
      try {
        setError(null);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(errorMessage);
        }

        return await response.json() as T;
      } catch (err) {
        const error = err instanceof Error ? err.message : "Erro desconhecido";
        setError(error);
        throw err;
      }
    },
    []
  );

  /**
   * Busca pedidos por cliente
   */
  const findByCliente = useCallback(
    async (clienteId: string): Promise<TPedidoWithRelations[]> => {
      try {
        return await executeSearch<TPedidoWithRelations[]>(
          `/api/pedido?clienteId=${clienteId}`,
          "Erro ao buscar pedidos do cliente"
        );
      } catch {
        return [];
      }
    },
    [executeSearch]
  );

  /**
   * Busca pedidos por status
   */
  const findByStatus = useCallback(
    async (status: TPedidoWithRelations["status"]): Promise<TPedidoWithRelations[]> => {
      try {
        return await executeSearch<TPedidoWithRelations[]>(
          `/api/pedido?status=${status}`,
          "Erro ao buscar pedidos por status"
        );
      } catch {
        return [];
      }
    },
    [executeSearch]
  );

  /**
   * Busca pedido por ID
   */
  const findById = useCallback(
    async (id: string): Promise<TPedidoWithRelations | null> => {
      try {
        return await executeSearch<TPedidoWithRelations>(
          `/api/pedido/${id}`,
          "Erro ao buscar pedido"
        );
      } catch {
        return null;
      }
    },
    [executeSearch]
  );

  // Inicialização automática dos dados
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Interface pública do hook
  return {
    // Estados
    pedidos,
    stats,
    loading,
    error,
    pagination,
    
    // Operações de busca
    fetchPedidos,
    fetchPedidosPaginated,
    fetchStats,
    
    // Operações CRUD
    createPedido,
    updatePedido,
    updateStatus,
    deletePedido,
    
    // Buscas específicas
    findByCliente,
    findByStatus,
    findById
  };
};
