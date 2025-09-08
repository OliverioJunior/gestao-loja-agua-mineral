import { Building, UserCheck, UserX, ShoppingCart } from "lucide-react";
import { GenericStatsCard, StatsCardGridLoading } from "@/shared/components/ui";
import { FornecedorStatsCardsProps } from "./types";

export function FornecedorStatsCards({
  totalFornecedores,
  activeFornecedores,
  inactiveFornecedores,
  totalCompras = 0,
  loading = false,
}: FornecedorStatsCardsProps) {
  if (loading) {
    return (
      <StatsCardGridLoading count={4} columns={4} size="sm" className="gap-6" />
    );
  }

  const percentualAtivos =
    totalFornecedores > 0 ? (activeFornecedores / totalFornecedores) * 100 : 0;

  const percentualInativos =
    totalFornecedores > 0
      ? (inactiveFornecedores / totalFornecedores) * 100
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total de Fornecedores */}
      <GenericStatsCard
        title="Total de Fornecedores"
        value={totalFornecedores}
        icon={Building}
        variant="default"
        description="Fornecedores cadastrados no sistema"
        valueFormatting={{
          type: "number",
          locale: "pt-BR",
        }}
        size="sm"
        data-testid="total-fornecedores-card"
      />

      {/* Fornecedores Ativos */}
      <GenericStatsCard
        title="Fornecedores Ativos"
        value={activeFornecedores}
        icon={UserCheck}
        variant="success"
        description={`${percentualAtivos.toFixed(1)}% do total`}
        valueFormatting={{
          type: "number",
          locale: "pt-BR",
        }}
        size="sm"
        data-testid="fornecedores-ativos-card"
      />

      {/* Fornecedores Inativos */}
      <GenericStatsCard
        title="Fornecedores Inativos"
        value={inactiveFornecedores}
        icon={UserX}
        variant="danger"
        description={`${percentualInativos.toFixed(1)}% do total`}
        valueFormatting={{
          type: "number",
          locale: "pt-BR",
        }}
        size="sm"
        data-testid="fornecedores-inativos-card"
      />

      {/* Total de Compras */}
      <GenericStatsCard
        title="Total de Compras"
        value={totalCompras}
        icon={ShoppingCart}
        variant="info"
        description={
          totalFornecedores > 0
            ? `${(totalCompras / totalFornecedores).toFixed(
                1
              )} compras por fornecedor`
            : "Nenhuma compra registrada"
        }
        valueFormatting={{
          type: "number",
          locale: "pt-BR",
        }}
        size="sm"
        data-testid="total-compras-card"
      />
    </div>
  );
}
