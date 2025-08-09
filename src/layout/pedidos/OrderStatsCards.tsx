import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui";
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
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            Total de Pedidos
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {stats.total}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Todos os pedidos cadastrados
          </p>
        </CardContent>
      </Card>

      {/* Pedidos Pendentes */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            Pendentes
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {stats.pendentes}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {pendentesPercentage.toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>

      {/* Pedidos Confirmados */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            Confirmados
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {stats.confirmados}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {confirmadosPercentage.toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>

      {/* Pedidos Entregues */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            Entregues
            <Truck className="h-4 w-4 text-green-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {stats.entregues}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {entreguesPercentage.toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>

      {/* Pedidos Cancelados */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            Cancelados
            <XCircle className="h-4 w-4 text-red-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {stats.cancelados}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {canceladosPercentage.toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
