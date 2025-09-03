import { ShoppingCart, Clock, CheckCircle, Package, XCircle, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { LoadingSpinner } from "@/shared/components/layout/LoadingSpinner";
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
  loading = false
}: CompraStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
        {Array.from({ length: 7 }).map((_, index) => (
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

  const percentualPendentes = totalCompras > 0 
    ? (comprasPendentes / totalCompras) * 100 
    : 0;

  const percentualConfirmadas = totalCompras > 0 
    ? (comprasConfirmadas / totalCompras) * 100 
    : 0;

  const percentualRecebidas = totalCompras > 0 
    ? (comprasRecebidas / totalCompras) * 100 
    : 0;

  const percentualCanceladas = totalCompras > 0 
    ? (comprasCanceladas / totalCompras) * 100 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
      {/* Total de Compras */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Compras
          </CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalCompras.toLocaleString('pt-BR')}
          </div>
          <p className="text-xs text-muted-foreground">
            Compras registradas no sistema
          </p>
        </CardContent>
      </Card>

      {/* Compras Pendentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Compras Pendentes
          </CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {comprasPendentes.toLocaleString('pt-BR')}
          </div>
          <p className="text-xs text-muted-foreground">
            {percentualPendentes.toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>

      {/* Compras Confirmadas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Compras Confirmadas
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {comprasConfirmadas.toLocaleString('pt-BR')}
          </div>
          <p className="text-xs text-muted-foreground">
            {percentualConfirmadas.toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>

      {/* Compras Recebidas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Compras Recebidas
          </CardTitle>
          <Package className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {comprasRecebidas.toLocaleString('pt-BR')}
          </div>
          <p className="text-xs text-muted-foreground">
            {percentualRecebidas.toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>

      {/* Compras Canceladas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Compras Canceladas
          </CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {comprasCanceladas.toLocaleString('pt-BR')}
          </div>
          <p className="text-xs text-muted-foreground">
            {percentualCanceladas.toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>

      {/* Valor Total */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Valor Total
          </CardTitle>
          <DollarSign className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {CompraUtils.formatCurrency(valorTotal)}
          </div>
          <p className="text-xs text-muted-foreground">
            Compras confirmadas e recebidas
          </p>
        </CardContent>
      </Card>

      {/* Valor Médio */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Valor Médio
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-600">
            {CompraUtils.formatCurrency(valorMedio)}
          </div>
          <p className="text-xs text-muted-foreground">
            {totalCompras > 0 
              ? `Média por compra`
              : 'Nenhuma compra registrada'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}