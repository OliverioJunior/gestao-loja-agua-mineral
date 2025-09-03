import { Building, UserCheck, UserX, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { LoadingSpinner } from "@/shared/components/layout/LoadingSpinner";
import { FornecedorStatsCardsProps } from "./types";

export function FornecedorStatsCards({
  totalFornecedores,
  activeFornecedores,
  inactiveFornecedores,
  totalCompras = 0,
  loading = false
}: FornecedorStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-20">
                <LoadingSpinner size="md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const percentualAtivos = totalFornecedores > 0 
    ? (activeFornecedores / totalFornecedores) * 100 
    : 0;

  const percentualInativos = totalFornecedores > 0 
    ? (inactiveFornecedores / totalFornecedores) * 100 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total de Fornecedores */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Fornecedores
          </CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalFornecedores.toLocaleString('pt-BR')}
          </div>
          <p className="text-xs text-muted-foreground">
            Fornecedores cadastrados no sistema
          </p>
        </CardContent>
      </Card>

      {/* Fornecedores Ativos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Fornecedores Ativos
          </CardTitle>
          <UserCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {activeFornecedores.toLocaleString('pt-BR')}
          </div>
          <p className="text-xs text-muted-foreground">
            {percentualAtivos.toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>

      {/* Fornecedores Inativos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Fornecedores Inativos
          </CardTitle>
          <UserX className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {inactiveFornecedores.toLocaleString('pt-BR')}
          </div>
          <p className="text-xs text-muted-foreground">
            {percentualInativos.toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>

      {/* Total de Compras */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Compras
          </CardTitle>
          <ShoppingCart className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {totalCompras.toLocaleString('pt-BR')}
          </div>
          <p className="text-xs text-muted-foreground">
            {totalFornecedores > 0 
              ? `${(totalCompras / totalFornecedores).toFixed(1)} compras por fornecedor`
              : 'Nenhuma compra registrada'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}