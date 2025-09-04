"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Calendar,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useCompras } from "@/core/compra/hooks";
import { CompraUtils } from "@/core/compra/layout";
import { TProduto } from "@/core/produto/domain/produto.entity";

interface ProdutoEstoqueBaixo {
  id: string;
  nome: string;
  estoque: number;
  estoqueMinimo: number;
  categoria?: {
    nome: string;
  };
}

interface DashboardStats {
  comprasUltimos30Dias: number;
  valorGastoUltimos30Dias: number;
  comprasPendentes: number;
  comprasVencidas: number;
  crescimentoMensal: number;
  fornecedorMaisUtilizado: string;
  produtosEstoqueBaixo: ProdutoEstoqueBaixo[];
}

export default function ComprasDashboardPage() {
  const { compras, loading: comprasLoading } = useCompras();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!comprasLoading && compras.length >= 0) {
      generateDashboardStats();
    }
  }, [compras, comprasLoading]);

  const generateDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calcular estatísticas das compras
      const hoje = new Date();
      const ultimos30Dias = new Date();
      ultimos30Dias.setDate(hoje.getDate() - 30);

      const comprasRecentes = compras.filter(
        (compra) => new Date(compra.dataCompra) >= ultimos30Dias
      );

      const comprasUltimos30Dias = comprasRecentes.length;
      const valorGastoUltimos30Dias = comprasRecentes
        .filter((c) => ["CONFIRMADA", "RECEBIDA"].includes(c.status))
        .reduce((sum, compra) => sum + compra.total, 0);

      const comprasPendentes = compras.filter(
        (c) => c.status === "PENDENTE"
      ).length;

      const comprasVencidas = compras.filter((compra) =>
        CompraUtils.isVencida(compra)
      ).length;

      // Calcular crescimento mensal
      const mesPassado = new Date();
      mesPassado.setMonth(mesPassado.getMonth() - 1);
      const doisMesesAtras = new Date();
      doisMesesAtras.setMonth(doisMesesAtras.getMonth() - 2);

      const comprasMesAtual = compras
        .filter(
          (c) =>
            new Date(c.dataCompra) >= mesPassado &&
            ["CONFIRMADA", "RECEBIDA"].includes(c.status)
        )
        .reduce((sum, c) => sum + c.total, 0);

      const comprasMesAnterior = compras
        .filter(
          (c) =>
            new Date(c.dataCompra) >= doisMesesAtras &&
            new Date(c.dataCompra) < mesPassado &&
            ["CONFIRMADA", "RECEBIDA"].includes(c.status)
        )
        .reduce((sum, c) => sum + c.total, 0);

      const crescimentoMensal =
        comprasMesAnterior > 0
          ? ((comprasMesAtual - comprasMesAnterior) / comprasMesAnterior) * 100
          : 0;

      // Fornecedor mais utilizado
      const fornecedorCount = new Map<string, number>();
      comprasRecentes.forEach((compra) => {
        const fornecedor = compra.fornecedor?.nome || "Sem fornecedor";
        fornecedorCount.set(
          fornecedor,
          (fornecedorCount.get(fornecedor) || 0) + 1
        );
      });

      const fornecedorMaisUtilizado =
        Array.from(fornecedorCount.entries()).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0] || "N/A";

      // Buscar produtos com estoque baixo
      let produtosEstoqueBaixo: ProdutoEstoqueBaixo[] = [];
      try {
        const response = await fetch("/api/produto");
        if (response.ok) {
          const produtos = await response.json();
          produtosEstoqueBaixo =
            produtos.data
              ?.filter(
                (produto: TProduto) =>
                  produto.ativo &&
                  (produto.estoque === 0 ||
                    produto.estoque <= (produto.estoqueMinimo || 0))
              )
              .slice(0, 10) || []; // Limitar a 10 produtos
        }
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }

      setDashboardStats({
        comprasUltimos30Dias,
        valorGastoUltimos30Dias,
        comprasPendentes,
        comprasVencidas,
        crescimentoMensal,
        fornecedorMaisUtilizado,
        produtosEstoqueBaixo,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao gerar estatísticas"
      );
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    generateDashboardStats();
  };

  if (loading || comprasLoading) {
    return (
      <main className="min-h-[calc(100dvh-93px)] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando dashboard...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100dvh-93px)] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={refresh}>Tentar Novamente</Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100dvh-93px)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/compras">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Dashboard de Compras
              </h1>
              <p className="text-muted-foreground">
                Visão geral das compras e alertas de estoque
              </p>
            </div>
          </div>
          <Button onClick={refresh} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>

        {/* Métricas principais */}
        {dashboardStats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Compras (30 dias)
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardStats.comprasUltimos30Dias}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Compras realizadas no último mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Valor Gasto (30 dias)
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {CompraUtils.formatCurrency(
                      dashboardStats.valorGastoUltimos30Dias
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {dashboardStats.crescimentoMensal >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                    )}
                    {Math.abs(dashboardStats.crescimentoMensal).toFixed(1)}% vs
                    mês anterior
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Compras Pendentes
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {dashboardStats.comprasPendentes}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Aguardando confirmação
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Compras Vencidas
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {dashboardStats.comprasVencidas}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Requerem atenção imediata
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Informações adicionais */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fornecedor mais utilizado */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Fornecedor Principal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {dashboardStats.fornecedorMaisUtilizado}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fornecedor mais utilizado nos últimos 30 dias
                  </p>
                </CardContent>
              </Card>

              {/* Alertas de estoque */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Alertas de Estoque
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardStats.produtosEstoqueBaixo.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground mb-3">
                        {dashboardStats.produtosEstoqueBaixo.length} produtos
                        com estoque baixo ou zerado
                      </p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {dashboardStats.produtosEstoqueBaixo.map((produto) => (
                          <div
                            key={produto.id}
                            className="flex items-center justify-between p-2 bg-red-50 rounded-lg border border-red-200"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {produto.nome}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {produto.categoria?.nome || "Sem categoria"}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="destructive" className="text-xs">
                                {produto.estoque === 0 ? "Zerado" : "Baixo"}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {produto.estoque}/{produto.estoqueMinimo}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2">
                        <Link href="/estoque">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Ver Estoque Completo
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Package className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-green-600 font-medium">
                        Todos os produtos com estoque adequado
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Ações rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/compras">
                    <Button className="w-full gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Nova Compra
                    </Button>
                  </Link>
                  <Link href="/compras/relatorios">
                    <Button variant="outline" className="w-full gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Ver Relatórios
                    </Button>
                  </Link>
                  <Link href="/fornecedor">
                    <Button variant="outline" className="w-full gap-2">
                      <Package className="h-4 w-4" />
                      Gerenciar Fornecedores
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
