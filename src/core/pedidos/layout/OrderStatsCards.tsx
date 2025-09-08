import { GenericStatsCard } from "@/shared/components/ui";
import { ShoppingCart, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { OrderStatsCardsProps } from "./types";

export function OrderStatsCards({ stats }: OrderStatsCardsProps) {
  const pendentesPercentage =
    stats.total > 0 ? (stats.pendentes / stats.total) * 100 : 0;
  const confirmadosPercentage =
    stats.total > 0 ? (stats.confirmados / stats.total) * 100 : 0;
  const entreguesPercentage =
    stats.total > 0 ? (stats.entregues / stats.total) * 100 : 0;
  const canceladosPercentage =
    stats.total > 0 ? (stats.cancelados / stats.total) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      <GenericStatsCard
        title="Total de Pedidos"
        value={stats.total}
        icon={ShoppingCart}
        variant="info"
        size="sm"
        description="Todos os pedidos cadastrados"
        showBorder
        borderPosition="left"
        data-testid="order-stats-total"
      />

      <GenericStatsCard
        title="Pendentes"
        value={stats.pendentes}
        icon={Clock}
        variant="warning"
        size="sm"
        description={`${pendentesPercentage.toFixed(1)}% do total`}
        showBorder
        borderPosition="left"
        data-testid="order-stats-pending"
      />

      <GenericStatsCard
        title="Confirmados"
        value={stats.confirmados}
        icon={CheckCircle}
        variant="info"
        size="sm"
        description={`${confirmadosPercentage.toFixed(1)}% do total`}
        showBorder
        borderPosition="left"
        data-testid="order-stats-confirmed"
      />

      <GenericStatsCard
        title="Entregues"
        value={stats.entregues}
        icon={Truck}
        variant="success"
        size="sm"
        description={`${entreguesPercentage.toFixed(1)}% do total`}
        showBorder
        borderPosition="left"
        data-testid="order-stats-delivered"
      />

      <GenericStatsCard
        title="Cancelados"
        value={stats.cancelados}
        icon={XCircle}
        variant="danger"
        size="sm"
        description={`${canceladosPercentage.toFixed(1)}% do total`}
        showBorder
        borderPosition="left"
        data-testid="order-stats-cancelled"
      />
    </div>
  );
}
