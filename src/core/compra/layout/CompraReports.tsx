"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Calendar,
  FileText,
  Download,
} from "lucide-react";
import { CompraUtils } from "./compra-utils";
import { TCompraWithRelations } from "../domain/compra.entity";

interface CompraReportsProps {
  compras: TCompraWithRelations[];
  loading?: boolean;
}

interface ReportData {
  monthlySpending: Array<{
    month: string;
    total: number;
    count: number;
  }>;
  supplierSpending: Array<{
    supplier: string;
    total: number;
    count: number;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  paymentMethodDistribution: Array<{
    method: string;
    total: number;
    count: number;
  }>;
  trends: {
    totalSpending: number;
    averageOrderValue: number;
    totalOrders: number;
    monthlyGrowth: number;
    topSupplier: string;
    mostUsedPaymentMethod: string;
  };
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function CompraReports({
  compras,
  loading = false,
}: CompraReportsProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("12"); // últimos 12 meses
  const [selectedChart, setSelectedChart] = useState("monthly");

  useEffect(() => {
    if (compras.length > 0) {
      generateReportData();
    }
  }, [compras, selectedPeriod]);

  const generateReportData = () => {
    const months = parseInt(selectedPeriod);
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);

    const filteredCompras = compras.filter(
      (compra) => new Date(compra.dataCompra) >= cutoffDate
    );

    // Gastos mensais
    const monthlyData = new Map<string, { total: number; count: number }>();

    filteredCompras.forEach((compra) => {
      const date = new Date(compra.dataCompra);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { total: 0, count: 0 });
      }

      const current = monthlyData.get(monthKey)!;
      current.total += compra.total;
      current.count += 1;
    });

    const monthlySpending = Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month: new Date(month + "-01").toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        }),
        total: data.total / 100, // converter de centavos para reais
        count: data.count,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Gastos por fornecedor
    const supplierData = new Map<string, { total: number; count: number }>();

    filteredCompras.forEach((compra) => {
      const supplier = compra.fornecedor?.nome || "Sem fornecedor";

      if (!supplierData.has(supplier)) {
        supplierData.set(supplier, { total: 0, count: 0 });
      }

      const current = supplierData.get(supplier)!;
      current.total += compra.total;
      current.count += 1;
    });

    const supplierSpending = Array.from(supplierData.entries())
      .map(([supplier, data]) => ({
        supplier,
        total: data.total / 100,
        count: data.count,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Top 10 fornecedores

    // Distribuição por status
    const statusData = new Map<string, number>();
    filteredCompras.forEach((compra) => {
      const status = CompraUtils.getStatusText(compra.status);
      statusData.set(status, (statusData.get(status) || 0) + 1);
    });

    const statusDistribution = Array.from(statusData.entries()).map(
      ([status, count]) => ({
        status,
        count,
        percentage: (count / filteredCompras.length) * 100,
      })
    );

    // Distribuição por forma de pagamento
    const paymentData = new Map<string, { total: number; count: number }>();
    filteredCompras.forEach((compra) => {
      const method = CompraUtils.getFormaPagamentoText(compra.formaPagamento);

      if (!paymentData.has(method)) {
        paymentData.set(method, { total: 0, count: 0 });
      }

      const current = paymentData.get(method)!;
      current.total += compra.total;
      current.count += 1;
    });

    const paymentMethodDistribution = Array.from(paymentData.entries())
      .map(([method, data]) => ({
        method,
        total: data.total / 100,
        count: data.count,
      }))
      .sort((a, b) => b.total - a.total);

    // Tendências e métricas
    const totalSpending =
      filteredCompras.reduce((sum, compra) => sum + compra.total, 0) / 100;
    const totalOrders = filteredCompras.length;
    const averageOrderValue = totalOrders > 0 ? totalSpending / totalOrders : 0;

    // Crescimento mensal (comparar últimos 2 meses)
    const lastMonth = monthlySpending[monthlySpending.length - 1]?.total || 0;
    const previousMonth =
      monthlySpending[monthlySpending.length - 2]?.total || 0;
    const monthlyGrowth =
      previousMonth > 0
        ? ((lastMonth - previousMonth) / previousMonth) * 100
        : 0;

    const topSupplier = supplierSpending[0]?.supplier || "N/A";
    const mostUsedPaymentMethod = paymentMethodDistribution[0]?.method || "N/A";

    setReportData({
      monthlySpending,
      supplierSpending,
      statusDistribution,
      paymentMethodDistribution,
      trends: {
        totalSpending,
        averageOrderValue,
        totalOrders,
        monthlyGrowth,
        topSupplier,
        mostUsedPaymentMethod,
      },
    });
  };

  const exportReport = () => {
    if (!reportData) return;

    const csvData = compras.map((compra) => CompraUtils.toExportData(compra));
    const csvContent = [
      Object.keys(csvData[0] || {}).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-compras-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Gerando relatórios...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhum dado disponível para relatórios
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Últimos 3 meses</SelectItem>
              <SelectItem value="6">Últimos 6 meses</SelectItem>
              <SelectItem value="12">Últimos 12 meses</SelectItem>
              <SelectItem value="24">Últimos 24 meses</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedChart} onValueChange={setSelectedChart}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Gastos Mensais</SelectItem>
              <SelectItem value="suppliers">Por Fornecedor</SelectItem>
              <SelectItem value="status">Por Status</SelectItem>
              <SelectItem value="payment">Forma de Pagamento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={exportReport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {CompraUtils.formatCurrency(
                Math.round(reportData.trends.totalSpending * 100)
              )}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {reportData.trends.monthlyGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              {Math.abs(reportData.trends.monthlyGrowth).toFixed(1)}% vs mês
              anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {CompraUtils.formatCurrency(
                Math.round(reportData.trends.averageOrderValue * 100)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Por compra</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Compras
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.trends.totalOrders.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground">
              No período selecionado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Principal Fornecedor
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {reportData.trends.topSupplier}
            </div>
            <p className="text-xs text-muted-foreground">
              Maior volume de compras
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico principal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedChart === "monthly" && "Evolução dos Gastos Mensais"}
              {selectedChart === "suppliers" &&
                "Gastos por Fornecedor (Top 10)"}
              {selectedChart === "status" && "Distribuição por Status"}
              {selectedChart === "payment" && "Gastos por Forma de Pagamento"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <>
                  {selectedChart === "monthly" && (
                    <LineChart data={reportData.monthlySpending}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [
                          `R$ ${value.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}`,
                          "Valor",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ fill: "#8884d8" }}
                      />
                    </LineChart>
                  )}

                  {selectedChart === "suppliers" && (
                    <BarChart data={reportData.supplierSpending}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="supplier"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [
                          `R$ ${value.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}`,
                          "Valor Total",
                        ]}
                      />
                      <Bar dataKey="total" fill="#8884d8" />
                    </BarChart>
                  )}

                  {selectedChart === "status" && (
                    <PieChart>
                      <Pie
                        data={reportData.statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ status, percentage }) =>
                          `${status}: ${percentage.toFixed(1)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {reportData.statusDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  )}

                  {selectedChart === "payment" && (
                    <BarChart data={reportData.paymentMethodDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="method"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [
                          `R$ ${value.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}`,
                          "Valor Total",
                        ]}
                      />
                      <Bar dataKey="total" fill="#82ca9d" />
                    </BarChart>
                  )}
                </>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
