import { GenericStatsCard } from "@/shared/components/ui";
import {
  Package,
  CheckCircle,
  XCircle,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { IProductStats } from "./types";

interface ProductStatsCardsProps {
  stats: IProductStats;
}

export function ProductStatsCards({ stats }: ProductStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <GenericStatsCard
        title="Total de Produtos"
        value={stats.total}
        icon={Package}
        variant="info"
        size="sm"
        className="bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
        data-testid="product-stats-total"
      />

      <GenericStatsCard
        title="Produtos Ativos"
        value={stats.ativo}
        icon={CheckCircle}
        variant="success"
        size="sm"
        className="bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
        data-testid="product-stats-active"
      />

      <GenericStatsCard
        title="Produtos Inativos"
        value={stats.inativo}
        icon={XCircle}
        variant="danger"
        size="sm"
        className="bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
        data-testid="product-stats-inactive"
      />

      <GenericStatsCard
        title="Em Promoção"
        value={stats.promocao}
        icon={Tag}
        variant="default"
        size="sm"
        className="bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
        data-testid="product-stats-promotion"
      />

      <GenericStatsCard
        title="Estoque Baixo"
        value={stats.estoqueBaixo}
        icon={AlertTriangle}
        variant="warning"
        size="sm"
        className="bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
        data-testid="product-stats-low-stock"
      />
    </div>
  );
}
