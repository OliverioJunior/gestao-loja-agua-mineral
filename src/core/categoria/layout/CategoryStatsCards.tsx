import { GenericStatsCard } from "@/shared/components/ui";
import { Tag, Package } from "lucide-react";
import { ICategoryStats } from "./types";

interface CategoryStatsCardsProps {
  stats: ICategoryStats;
}

export function CategoryStatsCards({ stats }: CategoryStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <GenericStatsCard
        title="Total de Categorias"
        value={stats.total}
        icon={Tag}
        variant="default"
        size="sm"
        className="bg-card/80 backdrop-blur-sm"
        data-testid="category-stats-total"
      />

      <GenericStatsCard
        title="Com Produtos"
        value={stats.withProducts}
        icon={Package}
        variant="info"
        size="sm"
        className="bg-card/80 backdrop-blur-sm"
        data-testid="category-stats-with-products"
      />
    </div>
  );
}
