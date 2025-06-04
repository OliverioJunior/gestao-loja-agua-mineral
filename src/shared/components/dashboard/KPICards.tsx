import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui";
import {
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

interface SalesData {
  today: number;
  yesterday: number;
  thisMonth: number;
  orders: number;
}

interface KPICardsProps {
  salesData: SalesData;
}

export function KPICards({ salesData }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-l-4 border-l-[var(--primary)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-[var(--muted-foreground)] flex items-center justify-between">
            Vendas Hoje
            <DollarSign className="h-4 w-4 text-[var(--primary)]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[var(--foreground)]">
            R${" "}
            {salesData.today.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <TrendingUp className="h-3 w-3" />
            +12.3% vs ontem
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-[var(--secondary)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-[var(--muted-foreground)] flex items-center justify-between">
            Pedidos Hoje
            <ShoppingCart className="h-4 w-4 text-[var(--secondary)]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[var(--foreground)]">
            {salesData.orders}
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <TrendingUp className="h-3 w-3" />
            +5 novos pedidos
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-[var(--chart-1)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-[var(--muted-foreground)] flex items-center justify-between">
            Faturamento Mensal
            <TrendingUp className="h-4 w-4 text-[var(--chart-1)]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[var(--foreground)]">
            R${" "}
            {salesData.thisMonth.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className="flex items-center gap-1 text-sm text-purple-600 mt-1">
            <TrendingUp className="h-3 w-3" />
            Meta: 85% atingida
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-[var(--destructive)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-[var(--muted-foreground)] flex items-center justify-between">
            Alertas Estoque
            <AlertTriangle className="h-4 w-4 text-[var(--destructive)]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[var(--foreground)]">2</div>
          <div className="flex items-center gap-1 text-sm text-orange-600 mt-1">
            <AlertTriangle className="h-3 w-3" />
            Produtos em baixa
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
