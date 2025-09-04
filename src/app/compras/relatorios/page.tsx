"use client";

import { CompraReports } from "@/core/compra/layout";
import { useCompras } from "@/core/compra/hooks";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function ComprasRelatoriosPage() {
  const {
    compras,
    loading,
    error
  } = useCompras();

  if (error) {
    return (
      <main className="min-h-[calc(100dvh-93px)] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Tentar Novamente
              </button>
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
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <BarChart3 className="h-8 w-8" />
                Relatórios de Compras
              </h1>
              <p className="text-muted-foreground">
                Análise detalhada dos gastos e tendências da empresa
              </p>
            </div>
          </div>
        </div>

        {/* Componente de Relatórios */}
        <CompraReports compras={compras} loading={loading} />
      </div>
    </main>
  );
}