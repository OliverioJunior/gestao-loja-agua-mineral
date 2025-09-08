import { GenericStatsCard, StatsCardGridLoading } from "@/shared/components/ui";
import {
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Vendas Hoje */}
      <GenericStatsCard
        title="Vendas Hoje"
        value={salesData.today}
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
        value={salesData.orders}
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
        value={salesData.thisMonth}
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
