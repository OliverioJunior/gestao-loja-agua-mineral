import { Package, TrendingUp, AlertTriangle } from "lucide-react";
import { GenericStatsCard } from "@/shared/components/ui";

interface IEstatisticas {
  total: number;
  ativos: number;
  inativos: number;
  estoqueOk: number;
  estoqueBaixo: number;
  estoqueCritico: number;
  valorTotalEstoque: number;
}

interface ICards {
  estatisticas: IEstatisticas;
}

export const Cards: React.FC<ICards> = ({ estatisticas }) => {
  const { total, ativos, estoqueBaixo, estoqueCritico, valorTotalEstoque } =
    estatisticas;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {/* Total de Produtos */}
      <GenericStatsCard
        title="Total de Produtos"
        value={total}
        icon={Package}
        variant="info"
        description={`${ativos} ativos`}
        valueFormatting={{
          type: "number",
          locale: "pt-BR",
        }}
        size="sm"
        data-testid="total-produtos-card"
      />

      {/* Valor Total do Estoque */}
      <GenericStatsCard
        title="Valor Total"
        value={valorTotalEstoque / 100}
        icon={TrendingUp}
        variant="success"
        description="💰 Inventário atual"
        valueFormatting={{
          type: "currency",
          locale: "pt-BR",
          options: { currency: "BRL" },
        }}
        size="sm"
        data-testid="valor-total-card"
      />

      {/* Estoque Baixo */}
      <GenericStatsCard
        title="Estoque Baixo"
        value={estoqueBaixo}
        icon={AlertTriangle}
        variant="warning"
        description="⚠️ Produtos"
        valueFormatting={{
          type: "number",
          locale: "pt-BR",
        }}
        size="sm"
        data-testid="estoque-baixo-card"
      />

      {/* Alertas Críticos */}
      <GenericStatsCard
        title="Alertas Críticos"
        value={estoqueCritico}
        icon={AlertTriangle}
        variant="danger"
        description="🚨 Reposição urgente"
        valueFormatting={{
          type: "number",
          locale: "pt-BR",
        }}
        size="sm"
        data-testid="alertas-criticos-card"
      />
    </div>
  );
};
