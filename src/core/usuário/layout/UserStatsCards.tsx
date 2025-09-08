import { GenericStatsCard } from "@/shared/components/ui";
import { Users, Shield } from "lucide-react";
import { IUserStats } from "./types";

interface UserStatsCardsProps {
  stats: IUserStats;
}

export function UserStatsCards({ stats }: UserStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <GenericStatsCard
        title="Total de Usuários"
        value={stats.total}
        icon={Users}
        variant="default"
        size="sm"
        data-testid="user-stats-total"
      />

      <GenericStatsCard
        title="Administradores"
        value={stats.admin}
        icon={Shield}
        variant="danger"
        size="sm"
        data-testid="user-stats-admin"
      />

      <GenericStatsCard
        title="Gerentes"
        value={stats.manager}
        icon={Shield}
        variant="info"
        size="sm"
        data-testid="user-stats-manager"
      />

      <GenericStatsCard
        title="Usuários"
        value={stats.user}
        icon={Users}
        variant="success"
        size="sm"
        data-testid="user-stats-user"
      />
    </div>
  );
}
