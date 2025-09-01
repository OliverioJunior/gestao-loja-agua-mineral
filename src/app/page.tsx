"use client";
import { DashboardContent } from "@/layout/dashboard";
import { useDashboard } from "@/hooks/dashboard/useDashboard";

export default function Home() {
  const {
    salesData,
    stockAlerts,
    recentOrders,
    loading,
    error,
    todayGrowthPercentage,
    newOrdersToday,
    lowStockCount,
    monthlyGoalPercentage,
    refreshData,
  } = useDashboard();

  // Dados de fallback para quando salesData ainda não foi carregado
  const fallbackSalesData = {
    today: 0,
    yesterday: 0,
    thisMonth: 0,
    orders: 0,
  };

  // Mapear alertas de estoque para o formato esperado pelo DashboardContent
  const stockData = stockAlerts.map(alert => ({
    product: alert.product,
    stock: alert.currentStock,
    minimum: alert.minimumStock,
    status: alert.status === 'critical' ? 'critical' : alert.status === 'low' ? 'low' : 'ok'
  }));

  // Se houver erro, mostrar mensagem
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Handlers para as ações rápidas
  const handleNewOrder = () => {
    console.log("Novo pedido clicado");
    // Aqui você pode navegar para a página de novo pedido
    // router.push('/orders/new');
  };

  const handleAddStock = () => {
    console.log("Adicionar estoque clicado");
    // Aqui você pode navegar para a página de estoque
    // router.push('/stock/add');
  };

  const handleNewCustomer = () => {
    console.log("Novo cliente clicado");
    // Aqui você pode navegar para a página de novo cliente
    // router.push('/customers/new');
  };

  const handleViewReports = () => {
    console.log("Relatórios clicado");
    // Aqui você pode navegar para a página de relatórios
    // router.push('/reports');
  };

  return (
    <DashboardContent
      salesData={salesData || fallbackSalesData}
      stockData={stockData}
      recentOrders={recentOrders || []}
      todayGrowthPercentage={todayGrowthPercentage}
      newOrdersToday={newOrdersToday}
      lowStockCount={lowStockCount}
      monthlyGoalPercentage={monthlyGoalPercentage}
      loading={loading}
      onNewOrder={handleNewOrder}
      onAddStock={handleAddStock}
      onNewCustomer={handleNewCustomer}
      onViewReports={handleViewReports}
    />
  );
}
