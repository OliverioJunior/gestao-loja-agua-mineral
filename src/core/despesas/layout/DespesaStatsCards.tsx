import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui";
import {
  Receipt,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";
import { DespesaStatsCardsProps } from "./types";
import { formatCurrency } from "./despesa-utils";

export function DespesaStatsCards({ stats, loading }: DespesaStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Carregando...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalDespesasCount = stats.despesasPorCategoria.reduce(
    (acc, item) => acc + item.count,
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total de Despesas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalDespesas)}
          </div>
          <p className="text-xs text-muted-foreground">
            {totalDespesasCount} despesa{totalDespesasCount !== 1 ? "s" : ""} registrada{totalDespesasCount !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      {/* Despesas do Mês */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalMes)}
          </div>
          <p className="text-xs text-muted-foreground">
            Mês atual
          </p>
        </CardContent>
      </Card>

      {/* Despesas do Ano */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas do Ano</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalAno)}
          </div>
          <p className="text-xs text-muted-foreground">
            Ano atual
          </p>
        </CardContent>
      </Card>

      {/* Média por Despesa */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Média por Despesa</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalDespesasCount > 0
              ? formatCurrency(Math.round(stats.totalDespesas / totalDespesasCount))
              : formatCurrency(0)
            }
          </div>
          <p className="text-xs text-muted-foreground">
            Por despesa
          </p>
        </CardContent>
      </Card>
    </div>
  );
}