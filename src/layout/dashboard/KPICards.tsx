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
  todayGrowthPercentage: number;
  newOrdersToday: number;
  lowStockCount: number;
  monthlyGoalPercentage: number;
  loading?: boolean;
}

export function KPICards({ 
  salesData, 
  todayGrowthPercentage, 
  newOrdersToday, 
  lowStockCount, 
  monthlyGoalPercentage,
  loading = false 
}: KPICardsProps) {
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-l-4 border-l-gray-200 animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
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
          <div className={`flex items-center gap-1 text-sm mt-1 ${
            todayGrowthPercentage >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="h-3 w-3" />
            {todayGrowthPercentage >= 0 ? '+' : ''}{todayGrowthPercentage.toFixed(1)}% vs ontem
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
            +{newOrdersToday} novos pedidos
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
          <div className={`flex items-center gap-1 text-sm mt-1 ${
            monthlyGoalPercentage >= 100 ? 'text-green-600' : 
            monthlyGoalPercentage >= 75 ? 'text-purple-600' : 'text-orange-600'
          }`}>
            <TrendingUp className="h-3 w-3" />
            Meta: {monthlyGoalPercentage}% atingida
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
          <div className="text-2xl font-bold text-[var(--foreground)]">{lowStockCount}</div>
          <div className={`flex items-center gap-1 text-sm mt-1 ${
            lowStockCount === 0 ? 'text-green-600' : 
            lowStockCount <= 3 ? 'text-orange-600' : 'text-red-600'
          }`}>
            <AlertTriangle className="h-3 w-3" />
            {lowStockCount === 0 ? 'Estoque normal' : 
             lowStockCount === 1 ? 'Produto em baixa' : 'Produtos em baixa'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
