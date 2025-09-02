"use client";

import { TPedidoWithRelations } from "@/core/pedidos";
import { formatDateTime } from "@/shared/utils/formatters";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface DashboardStats {
  today: number;
  yesterday: number;
  thisMonth: number;
  orders: number;
  lowStockCount: number;
  todayOrdersCount: number;
  monthlyGoalPercentage: number;
  todayGrowthPercentage: number;
}

export interface StockAlert {
  id: string;
  product: string;
  currentStock: number;
  minimumStock: number;
  status: "low" | "critical";
}

export interface RecentOrder {
  id: string;
  customer: string;
  value: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  createdAt: string;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [recentOrders, setRecentOrders] = useState<TPedidoWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar estatísticas do dashboard
  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/dashboard/stats");

      if (!response.ok) {
        throw new Error("Erro ao carregar estatísticas");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, []);

  // Buscar alertas de estoque
  const fetchStockAlerts = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard/stock-alerts");

      if (!response.ok) {
        throw new Error("Erro ao carregar alertas de estoque");
      }

      const data = await response.json();
      setStockAlerts(data);
    } catch (err) {
      console.error("Erro ao carregar alertas de estoque:", err);
    }
  }, []);

  // Buscar pedidos recentes
  const fetchRecentOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard/recent-orders");

      if (!response.ok) {
        throw new Error("Erro ao carregar pedidos recentes");
      }

      const data = await response.json();
      setRecentOrders(
        data.map((order: TPedidoWithRelations) => ({
          ...order,
          createdAt: formatDateTime(order.createdAt),
        }))
      );
    } catch (err) {
      console.error("Erro ao carregar pedidos recentes:", err);
    }
  }, []);

  // Carregar todos os dados
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);

    await Promise.all([fetchStats(), fetchStockAlerts(), fetchRecentOrders()]);

    setLoading(false);
  }, [fetchStats, fetchStockAlerts, fetchRecentOrders]);

  // Atualizar dados
  const refreshData = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Carregar dados na inicialização
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Calcular dados derivados
  const salesData = stats
    ? {
        today: stats.today,
        yesterday: stats.yesterday,
        thisMonth: stats.thisMonth,
        orders: stats.orders,
      }
    : null;

  const todayGrowthPercentage =
    stats && stats.yesterday > 0
      ? ((stats.today - stats.yesterday) / stats.yesterday) * 100
      : 0;

  const newOrdersToday = stats?.todayOrdersCount || 0;

  return {
    // Dados
    stats,
    salesData,
    stockAlerts,
    recentOrders,

    // Estados
    loading,
    error,

    // Dados calculados
    todayGrowthPercentage,
    newOrdersToday,
    lowStockCount: stockAlerts.length,
    monthlyGoalPercentage: stats?.monthlyGoalPercentage || 0,

    // Ações
    refreshData,
    fetchStats,
    fetchStockAlerts,
    fetchRecentOrders,
  };
}
