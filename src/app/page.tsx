"use client";
import { DashboardContent } from "@/shared/components/dashboard";

export default function Home() {
  // Dados simulados
  const salesData = {
    today: 2450.0,
    yesterday: 2180.0,
    thisMonth: 45630.0,
    orders: 23,
  };

  const stockData = [
    { product: "Água 500ml", stock: 45, minimum: 20, status: "ok" },
    { product: "Água 1.5L", stock: 12, minimum: 15, status: "low" },
    { product: "Água 5L", stock: 78, minimum: 30, status: "ok" },
    {
      product: "Água com gás 500ml",
      stock: 8,
      minimum: 25,
      status: "critical",
    },
  ];

  const recentOrders = [
    {
      id: "#001",
      customer: "João Silva",
      value: 45.9,
      status: "pending",
      time: "14:30",
    },
    {
      id: "#002",
      customer: "Maria Santos",
      value: 23.5,
      status: "completed",
      time: "13:45",
    },
    {
      id: "#003",
      customer: "Pedro Costa",
      value: 67.8,
      status: "preparing",
      time: "13:20",
    },
    {
      id: "#004",
      customer: "Ana Oliveira",
      value: 89.2,
      status: "completed",
      time: "12:55",
    },
  ];

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
      salesData={salesData}
      stockData={stockData}
      recentOrders={recentOrders}
      onNewOrder={handleNewOrder}
      onAddStock={handleAddStock}
      onNewCustomer={handleNewCustomer}
      onViewReports={handleViewReports}
    />
  );
}
