import { GenericStatsCard, StatsCardGridLoading } from "@/shared/components/ui";
import { Receipt, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { DespesaStatsCardsProps } from "./types";
import { formatCurrency } from "./despesa-utils";

export function DespesaStatsCards({ stats, loading }: DespesaStatsCardsProps) {
  if (loading || !stats) {
    return (
      <StatsCardGridLoading
        count={4}
        columns={4}
        size="sm"
        className="gap-4 md:grid-cols-2 lg:grid-cols-4"
      />
    );
  }

  const totalDespesasCount = stats.despesasPorCategoria.reduce(
    (acc, item) => acc + item.count,
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <GenericStatsCard
        title="Total de Despesas"
        value={formatCurrency(stats.totalDespesas)}
        icon={Receipt}
        variant="default"
        size="sm"
        description={`${totalDespesasCount} despesa${
          totalDespesasCount !== 1 ? "s" : ""
        } registrada${totalDespesasCount !== 1 ? "s" : ""}`}
        data-testid="despesa-stats-total"
      />

      <GenericStatsCard
        title="Despesas do Mês"
        value={formatCurrency(stats.totalMes)}
        icon={Calendar}
        variant="info"
        size="sm"
        description="Mês atual"
        data-testid="despesa-stats-month"
      />

      <GenericStatsCard
        title="Despesas do Ano"
        value={formatCurrency(stats.totalAno)}
        icon={TrendingUp}
        variant="warning"
        size="sm"
        description="Ano atual"
        data-testid="despesa-stats-year"
      />

      <GenericStatsCard
        title="Média por Despesa"
        value={
          totalDespesasCount > 0
            ? formatCurrency(
                Math.round(stats.totalDespesas / totalDespesasCount)
              )
            : formatCurrency(0)
        }
        icon={DollarSign}
        variant="success"
        size="sm"
        description="Por despesa"
        data-testid="despesa-stats-average"
      />
    </div>
  );
}
