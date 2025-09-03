import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  Badge,
} from "@/shared/components/ui";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Edit3,
  Eye,
} from "lucide-react";
import { IProdutoEstoque } from "@/core/produto/hooks";

interface DialogEstoqueProps {
  produto: IProdutoEstoque | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit";
  onEstoqueUpdate: (produtoId: string, novoEstoque: number) => Promise<boolean>;
}

export const DialogEstoque = ({
  produto,
  open,
  onOpenChange,
  mode,
  onEstoqueUpdate,
}: DialogEstoqueProps) => {
  const [novoEstoque, setNovoEstoque] = useState(
    produto?.estoque?.toString() || "0"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (produto?.estoque !== undefined) {
      setNovoEstoque(produto.estoque.toString());
    }
  }, [produto?.estoque]);

  // Verificação de segurança - não renderizar se produto não existir
  if (!produto) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const estoqueNumerico = parseInt(novoEstoque);
    if (isNaN(estoqueNumerico) || estoqueNumerico < 0) {
      return;
    }

    setLoading(true);
    const success = await onEstoqueUpdate(produto.id, estoqueNumerico);
    setLoading(false);

    if (success) {
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setNovoEstoque(produto.estoque.toString());
    onOpenChange(false);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ok":
        return "Em estoque";
      case "baixo":
        return "Estoque baixo";
      case "critico":
        return "Estoque crítico";
      default:
        return "Indefinido";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "baixo":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case "critico":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return <Package className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            {mode === "view" ? (
              <>
                <Eye className="h-5 w-5 text-blue-500" />
                Detalhes do Produto
              </>
            ) : (
              <>
                <Edit3 className="h-5 w-5 text-green-500" />
                Editar Estoque
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Produto */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="font-medium text-lg">{produto.nome}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Categoria:</span>
                <p className="font-medium">{produto.categoria}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Estoque Atual:</span>
                <p className="font-medium">{produto.estoque} unidades</p>
              </div>
              <div>
                <span className="text-muted-foreground">Estoque Mínimo:</span>
                <p className="font-medium">{produto.estoqueMinimo} unidades</p>
              </div>
              <div>
                <span className="text-muted-foreground">Preço de Custo:</span>
                <p className="font-medium">
                  R$ {(produto.precoCusto / 100).toFixed(2)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Preço de Venda:</span>
                <p className="font-medium">
                  R$ {(produto.precoVenda / 100).toFixed(2)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(produto.status)}
                  <Badge
                    variant={
                      produto.status === "ok"
                        ? "default"
                        : produto.status === "baixo"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {getStatusText(produto.status)}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <span className="text-muted-foreground">
                Última Movimentação:
              </span>
              <p className="font-medium">
                {new Date(produto.ultimaMovimentacao).toLocaleDateString(
                  "pt-BR"
                )}
              </p>
            </div>
          </div>

          {/* Edição de Estoque */}
          {mode === "edit" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="estoque">Novo Estoque *</Label>
                <Input
                  id="estoque"
                  type="number"
                  min="0"
                  value={novoEstoque}
                  onChange={(e) => setNovoEstoque(e.target.value)}
                  placeholder="Digite o novo estoque"
                  required
                  disabled={loading}
                />
              </div>

              {parseInt(novoEstoque) !== produto.estoque && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-sm font-medium">
                    Alteração:{" "}
                    {parseInt(novoEstoque) > produto.estoque ? "+" : ""}
                    {parseInt(novoEstoque) - produto.estoque} unidades
                  </p>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Ações */}
        <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-border/50">
          <Button type="button" variant="outline" onClick={handleClose}>
            {mode === "view" ? "Fechar" : "Cancelar"}
          </Button>
          {mode === "edit" && (
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              disabled={loading || parseInt(novoEstoque) === produto.estoque}
            >
              <TrendingUp className="h-4 w-4" />
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
