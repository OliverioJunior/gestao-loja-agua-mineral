import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { AlertTriangle, ShoppingCart, Package } from "lucide-react";
import { DeleteCompraModalProps } from "./types";
import { CompraUtils } from "./compra-utils";

export function DeleteCompraModal({
  isOpen,
  onClose,
  compra,
  onConfirm
}: DeleteCompraModalProps) {
  if (!compra) return null;

  const financial = CompraUtils.getFinancialInfo(compra);
  const itens = CompraUtils.getItensStatistics(compra);
  const hasItens = itens.totalItens > 0;

  const handleConfirm = async () => {
    await onConfirm(compra.id);
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
            Esta ação não pode ser desfeita. A compra será removida permanentemente do sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações da compra a ser excluída */}
          <div className="bg-muted/50 p-4 rounded-lg border border-destructive/20">
            <div className="flex items-start space-x-3">
              <ShoppingCart className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1 space-y-2">
                <div>
                  <p className="font-semibold">
                    {CompraUtils.formatNumeroNota(compra.numeroNota)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Fornecedor: {compra.fornecedor?.nome || 'Não informado'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Data da Compra:</span>
                    <span className="ml-2 font-medium">
                      {CompraUtils.formatDate(compra.dataCompra)}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2">
                      {CompraUtils.getStatusText(compra.status)}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Valor Total:</span>
                    <span className="ml-2 font-medium">
                      {CompraUtils.formatCurrency(financial.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Aviso sobre itens associados */}
          {hasItens ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-800 mb-2">
                    ⚠️ Atenção: Esta compra possui itens associados!
                  </p>
                  <div className="text-red-700 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>
                        <strong>{itens.totalItens}</strong> itens registrados
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 flex items-center justify-center">📦</span>
                      <span>
                        <strong>{itens.quantidadeTotal}</strong> unidades no total
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-red-600 font-medium">
                    A exclusão não será possível enquanto houver itens associados.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 mb-1">
                    Consequências da exclusão:
                  </p>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• Todos os dados da compra serão perdidos</li>
                    <li>• O histórico será removido permanentemente</li>
                    <li>• Esta ação não pode ser desfeita</li>
                    <li>• Relatórios antigos podem ser afetados</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Aviso especial para compras recebidas */}
          {compra.status === 'RECEBIDA' && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-800 mb-1">
                    🚫 Compra já foi recebida!
                  </p>
                  <p className="text-red-700">
                    Compras recebidas não podem ser excluídas para manter a integridade do histórico financeiro.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={hasItens || compra.status === 'RECEBIDA'}
          >
            {hasItens 
              ? 'Não é Possível Excluir' 
              : compra.status === 'RECEBIDA'
                ? 'Compra Recebida'
                : 'Excluir Compra'
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}