import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Package,
  XCircle,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  GenericStatsCard,
  StatsCardGridLoading,
  StatsCardSize,
  StatsCardVariant,
} from "@/shared/components/ui";
import { CompraStatsCardsProps } from "./types";
import { CompraUtils } from "./compra-utils";

export function CompraStatsCards({
  totalCompras,
  comprasPendentes,
  comprasConfirmadas,
  comprasRecebidas,
  comprasCanceladas,
  valorTotal,
  valorMedio = 0,
  loading = false,
}: CompraStatsCardsProps) {
  if (loading) {
    return (
      <StatsCardGridLoading
        count={7}
        columns={7}
        size="sm"
        className="gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7"
      />
    );
  }

  const percentualPendentes =
    totalCompras > 0 ? (comprasPendentes / totalCompras) * 100 : 0;

  const percentualConfirmadas =
    totalCompras > 0 ? (comprasConfirmadas / totalCompras) * 100 : 0;

  const percentualRecebidas =
    totalCompras > 0 ? (comprasRecebidas / totalCompras) * 100 : 0;

  const percentualCanceladas =
    totalCompras > 0 ? (comprasCanceladas / totalCompras) * 100 : 0;
  const optionsCard = [
    {
      title: "Total de Compras",
      value: totalCompras.toLocaleString("pt-BR"),
      icon: ShoppingCart,
      variant: "default",
      size: "sm",
      description: "Compras registradas no sistema",
    },
    {
      title: "Compras Pendentes",
      value: comprasPendentes.toLocaleString("pt-BR"),
      icon: Clock,
      variant: "warning",
      size: "sm",
      description: `${percentualPendentes.toFixed(1)}% do total`,
    },
    {
      title: "Compras Confirmadas",
      value: comprasConfirmadas.toLocaleString("pt-BR"),
      icon: CheckCircle,
      variant: "info",
      size: "sm",
      description: `${percentualConfirmadas.toFixed(1)}% do total`,
    },
    {
      title: "Compras Recebidas",
      value: comprasRecebidas.toLocaleString("pt-BR"),
      icon: Package,
      variant: "success",
      size: "sm",
      description: `${percentualRecebidas.toFixed(1)}% do total`,
    },
    {
      title: "Compras Canceladas",
      value: comprasCanceladas.toLocaleString("pt-BR"),
      icon: XCircle,
      variant: "danger",
      size: "sm",
      description: `${percentualCanceladas.toFixed(1)}% do total`,
    },
    {
      title: "Valor Total",
      value: CompraUtils.formatCurrency(valorTotal),
      icon: DollarSign,
      variant: "default",
      size: "sm",
      description: "Compras confirmadas e recebidas",
    },
    {
      title: "Valor Médio",
      value: CompraUtils.formatCurrency(valorMedio),
      icon: TrendingUp,
      variant: "default",
      size: "sm",
      description: `${totalCompras} > 0 ? "Média por compra" : "Nenhuma compra registrada"`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
      {optionsCard.map((item) => (
        <GenericStatsCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          variant={item.variant as StatsCardVariant}
          size={item.size as StatsCardSize}
          description={item.description}
        />
      ))}
    </div>
  );
}
