import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { AlertTriangle, Package } from "lucide-react";
import { DeleteItemCompraModalProps } from "./types";
import { ItemCompraUtils } from "./item-compra-utils";

export function DeleteItemCompraModal({
  isOpen,
  onClose,
  item,
  onConfirm,
}: DeleteItemCompraModalProps) {
  if (!item) return null;

  const handleConfirm = async () => {
    await onConfirm(item.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Confirmar Exclusão</span>
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. O item de compra será removido
            permanentemente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do item a ser excluído */}
          <div className="bg-muted/50 p-4 rounded-lg border border-destructive/20">
            <div className="flex items-start space-x-3">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1 space-y-2">
                <div>
                  <p className="font-semibold">
                    {item.produto?.nome || "Produto não encontrado"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Fornecedor: {ItemCompraUtils.getFornecedorName(item)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Quantidade:</span>
                    <span className="ml-2 font-mono">
                      {item.quantidade.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total:</span>
                    <span className="ml-2 font-mono font-semibold">
                      {ItemCompraUtils.formatCurrency(item.precoTotal)}
                    </span>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Nota Fiscal:</span>
                  <span className="ml-2">
                    {ItemCompraUtils.getNumeroNota(item)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Aviso sobre impactos */}
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">
                  Impactos da exclusão:
                </p>
                <ul className="text-yellow-700 space-y-1">
                  <li>• O total da compra será recalculado</li>
                  <li>• O histórico do item será perdido</li>
                  <li>• Esta ação não pode ser desfeita</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Excluir Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
