"use client";

import { useState } from "react";
import { Cards } from "./Cards";
import { TabelaProdutos } from "./TabelaProdutos";
import { DialogEstoque } from "./DialogEstoque";
import { useProdutos, IProdutoEstoque } from "@/core/produto/hooks";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui";

export function EstoquePage() {
  const {
    produtos,
    error,
    loading,
    fetchProdutos,
    getEstatisticas,
    atualizarEstoque,
  } = useProdutos();
  const [selectedProduto, setSelectedProduto] =
    useState<IProdutoEstoque | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"view" | "edit">("view");

  const handleView = (produto: IProdutoEstoque) => {
    setSelectedProduto(produto);
    setDialogMode("view");
    setDialogOpen(true);
  };

  const handleEdit = (produto: IProdutoEstoque) => {
    setSelectedProduto(produto);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleEstoqueUpdate = async (
    produtoId: string,
    novoEstoque: number
  ): Promise<boolean> => {
    const success = await atualizarEstoque(produtoId, novoEstoque);
    if (success) {
      setDialogOpen(false);
    }
    return success;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <p className="text-lg font-semibold">Erro ao carregar produtos</p>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={fetchProdutos} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  const estatisticas = getEstatisticas();

  return (
    <div className="min-h-[calc(100dvh-93px)] p-6">
      <Cards estatisticas={estatisticas} loading={loading} />
      <TabelaProdutos
        produtos={produtos}
        onView={handleView}
        onEdit={handleEdit}
      />
      {selectedProduto && (
        <DialogEstoque
          produto={selectedProduto}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          mode={dialogMode}
          onEstoqueUpdate={handleEstoqueUpdate}
        />
      )}
    </div>
  );
}
