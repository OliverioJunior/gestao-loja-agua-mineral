import { GenericStatsCard } from "@/shared/components/ui";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { IClientStats } from "./types";

interface ClientStatsCardsProps {
  stats: IClientStats;
}

export function ClientStatsCards({ stats }: ClientStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <GenericStatsCard
        title="Total de Clientes"
        value={stats.total}
        icon={Users}
        variant="default"
        size="sm"
        description="Total de clientes cadastrados"
        data-testid="client-stats-total"
      />

      <GenericStatsCard
        title="Clientes Ativos"
        value={stats.active}
        icon={UserCheck}
        variant="success"
        size="sm"
        description={`${
          stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0
        }% do total`}
        data-testid="client-stats-active"
      />

      <GenericStatsCard
        title="Clientes Inativos"
        value={stats.inactive}
        icon={UserX}
        variant="danger"
        size="sm"
        description={`${
          stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0
        }% do total`}
        data-testid="client-stats-inactive"
      />

      <GenericStatsCard
        title="Novos este Mês"
        value={stats.newThisMonth}
        icon={TrendingUp}
        variant="info"
        size="sm"
        description="Clientes cadastrados este mês"
        data-testid="client-stats-new-month"
      />
    </div>
  );
}
