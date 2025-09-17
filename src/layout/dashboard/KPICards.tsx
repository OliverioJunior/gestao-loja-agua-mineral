"use client";
import { GenericStatsCard, StatsCardGridLoading } from "@/shared/components/ui";
import {
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";
interface SalesData {
  today: number;
  yesterday: number;
  thisMonth: number;
  orders: number;
}

interface KPICardsProps {
  salesData: SalesData;
  todayGrowthPercentage: number;
  newOrdersToday: number;
  lowStockCount: number;
  monthlyGoalPercentage: number;
  loading?: boolean;
}

export function KPICards({
  salesData,
  todayGrowthPercentage,
  newOrdersToday,
  lowStockCount,
  monthlyGoalPercentage,
  loading = false,
}: KPICardsProps) {
  const [version, setVersion] = useState<"desktop" | "mobile">(() => {
    if (typeof window === "undefined") return "mobile";
    const isPWA = window.matchMedia("(display-mode: standalone)").matches;
    const isMobile = window.innerWidth <= 768;

    return isPWA || isMobile ? "mobile" : "desktop";
  });
  const [width, setWidth] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.innerWidth.toString();
  });
  useEffect(() => {
    setWidth(window?.innerWidth.toString());
    const handleResize = () => {
      setVersion(window?.innerWidth > 768 ? "desktop" : "mobile");
      setWidth(window?.innerWidth.toString());
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  if (loading) {
    return (
      <StatsCardGridLoading count={4} columns={4} size="sm" className="gap-4" />
    );
  }

  // Determinar direção da tendência para vendas hoje
  const salesTrendDirection = todayGrowthPercentage >= 0 ? "up" : "down";
  const salesTrendText = `${
    todayGrowthPercentage >= 0 ? "+" : ""
  }${todayGrowthPercentage.toFixed(1)}% vs ontem`;

  // Determinar variante para faturamento mensal baseado na meta
  const monthlyVariant =
    monthlyGoalPercentage >= 100
      ? "success"
      : monthlyGoalPercentage >= 75
      ? "info"
      : "warning";
  const monthlyTrendDirection =
    monthlyGoalPercentage >= 100
      ? "up"
      : monthlyGoalPercentage >= 75
      ? "neutral"
      : "down";

  // Determinar variante para alertas de estoque
  const stockVariant =
    lowStockCount === 0 ? "success" : lowStockCount <= 3 ? "warning" : "danger";
  const stockDescription =
    lowStockCount === 0
      ? "Estoque normal"
      : lowStockCount === 1
      ? "Produto em baixa"
      : "Produtos em baixa";
  const render = version === "desktop" ? desktop : mobile;
  return render(
    salesData.today,
    todayGrowthPercentage,
    salesTrendDirection,
    salesTrendText,
    salesData.orders,
    newOrdersToday,
    salesData.thisMonth,
    monthlyVariant,
    monthlyTrendDirection,
    monthlyGoalPercentage,
    lowStockCount,
    stockVariant,
    stockDescription,
    width
  );
}

function desktop(
  salesDataToday: number,
  todayGrowthPercentage: number,
  salesTrendDirection: "up" | "down",
  salesTrendText: string,
  salesDataOrders: number,
  newOrdersToday: number,
  salesDataThisMonth: number,
  monthlyVariant: "success" | "warning" | "info",
  monthlyTrendDirection: "up" | "down" | "neutral",
  monthlyGoalPercentage: number,
  lowStockCount: number,
  stockVariant: "success" | "warning" | "danger",
  stockDescription: "Estoque normal" | "Produto em baixa" | "Produtos em baixa"
) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Vendas Hoje */}
      <GenericStatsCard
        title="Vendas Hoje"
        value={salesDataToday}
        icon={DollarSign}
        variant={todayGrowthPercentage >= 0 ? "success" : "danger"}
        valueFormatting={{
          type: "currency",
          locale: "pt-BR",
          options: { currency: "BRL" },
        }}
        showTrend
        trendDirection={salesTrendDirection}
        trendText={salesTrendText}
        showBorder
        borderPosition="left"
        size="sm"
        data-testid="vendas-hoje-card"
      />

      {/* Pedidos Hoje */}
      <GenericStatsCard
        title="Pedidos Hoje"
        value={salesDataOrders}
        icon={ShoppingCart}
        variant="info"
        description={`+${newOrdersToday} novos pedidos`}
        valueFormatting={{
          type: "number",
          locale: "pt-BR",
        }}
        showBorder
        borderPosition="left"
        size="sm"
        data-testid="pedidos-hoje-card"
      />

      {/* Faturamento Mensal */}
      <GenericStatsCard
        title="Faturamento Mensal"
        value={salesDataThisMonth}
        icon={TrendingUp}
        variant={monthlyVariant}
        valueFormatting={{
          type: "currency",
          locale: "pt-BR",
          options: { currency: "BRL" },
        }}
        showTrend
        trendDirection={monthlyTrendDirection}
        trendText={`Meta: ${monthlyGoalPercentage}% atingida`}
        showBorder
        borderPosition="left"
        size="sm"
        data-testid="faturamento-mensal-card"
      />

      {/* Alertas Estoque */}
      <GenericStatsCard
        title="Alertas Estoque"
        value={lowStockCount}
        icon={AlertTriangle}
        variant={stockVariant}
        description={stockDescription}
        valueFormatting={{
          type: "number",
          locale: "pt-BR",
        }}
        showBorder
        borderPosition="left"
        size="sm"
        data-testid="alertas-estoque-card"
      />
    </div>
  );
}
function mobile(
  salesDataToday: number,
  todayGrowthPercentage: number,
  salesTrendDirection: "up" | "down",
  salesTrendText: string,
  salesDataOrders: number,
  newOrdersToday: number,
  salesDataThisMonth: number,
  monthlyVariant: "success" | "warning" | "info",
  monthlyTrendDirection: "up" | "down" | "neutral",
  monthlyGoalPercentage: number,
  lowStockCount: number,
  stockVariant: "success" | "warning" | "danger",
  stockDescription: "Estoque normal" | "Produto em baixa" | "Produtos em baixa",
  width: string | null
) {
  return (
    <div
      className={"flex gap-4 overflow-auto"}
      style={{
        maxWidth: `${Number(width) - 38}px`,
      }}
    >
      {/* Vendas Hoje */}
      <GenericStatsCard
        className="min-w-9/12"
        title="Vendas Hoje"
        value={salesDataToday}
        icon={DollarSign}
        variant={todayGrowthPercentage >= 0 ? "success" : "danger"}
        valueFormatting={{
          type: "currency",
          locale: "pt-BR",
          options: { currency: "BRL" },
        }}
        showTrend
        trendDirection={salesTrendDirection}
        trendText={salesTrendText}
        showBorder
        borderPosition="left"
        size="sm"
        data-testid="vendas-hoje-card"
      />

      {/* Pedidos Hoje */}
      <GenericStatsCard
        className="min-w-9/12"
        title="Pedidos Hoje"
        value={salesDataOrders}
        icon={ShoppingCart}
        variant="info"
        description={`+${newOrdersToday} novos pedidos`}
        valueFormatting={{
          type: "number",
          locale: "pt-BR",
        }}
        showBorder
        borderPosition="left"
        size="sm"
        data-testid="pedidos-hoje-card"
      />

      {/* Faturamento Mensal */}
      <GenericStatsCard
        className="min-w-9/12"
        title="Faturamento Mensal"
        value={salesDataThisMonth}
        icon={TrendingUp}
        variant={monthlyVariant}
        valueFormatting={{
          type: "currency",
          locale: "pt-BR",
          options: { currency: "BRL" },
        }}
        showTrend
        trendDirection={monthlyTrendDirection}
        trendText={`Meta: ${monthlyGoalPercentage}% atingida`}
        showBorder
        borderPosition="left"
        size="sm"
        data-testid="faturamento-mensal-card"
      />

      {/* Alertas Estoque */}
      <GenericStatsCard
        className="min-w-9/12"
        title="Alertas Estoque"
        value={lowStockCount}
        icon={AlertTriangle}
        variant={stockVariant}
        description={stockDescription}
        valueFormatting={{
          type: "number",
          locale: "pt-BR",
        }}
        showBorder
        borderPosition="left"
        size="sm"
        data-testid="alertas-estoque-card"
      />
    </div>
  );
}
