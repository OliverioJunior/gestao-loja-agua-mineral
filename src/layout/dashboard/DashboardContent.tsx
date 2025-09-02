import { KPICards } from "./KPICards";
import { StockStatus } from "./StockStatus";
import { RecentOrders } from "./RecentOrders";
import { QuickActions } from "./QuickActions";
import { TPedidoWithRelations } from "@/core/pedidos";

interface SalesData {
  today: number;
  yesterday: number;
  thisMonth: number;
  orders: number;
}

interface StockItem {
  product: string;
  stock: number;
  minimum: number;
  status: string;
}

interface DashboardContentProps {
  salesData: SalesData;
  stockData: StockItem[];
  recentOrders: TPedidoWithRelations[];
  todayGrowthPercentage: number;
  newOrdersToday: number;
  lowStockCount: number;
  monthlyGoalPercentage: number;
  loading?: boolean;
  onNewOrder?: () => void;
  onAddStock?: () => void;
  onNewCustomer?: () => void;
  onViewReports?: () => void;
}

export function DashboardContent({
  salesData,
  stockData,
  recentOrders,
  todayGrowthPercentage,
  newOrdersToday,
  lowStockCount,
  monthlyGoalPercentage,
  loading = false,
  onNewOrder,
  onAddStock,
  onNewCustomer,
  onViewReports,
}: DashboardContentProps) {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* KPI Cards */}
      <KPICards
        salesData={salesData}
        todayGrowthPercentage={todayGrowthPercentage}
        newOrdersToday={newOrdersToday}
        lowStockCount={lowStockCount}
        monthlyGoalPercentage={monthlyGoalPercentage}
        loading={loading}
      />
      {/* Quick Actions */}
      <QuickActions
        onNewOrder={onNewOrder}
        onAddStock={onAddStock}
        onNewCustomer={onNewCustomer}
        onViewReports={onViewReports}
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockStatus stockData={stockData} />
        <RecentOrders recentOrders={recentOrders} />
      </div>
    </div>
  );
}
