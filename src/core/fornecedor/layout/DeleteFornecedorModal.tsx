import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { AlertTriangle, Building, ShoppingCart } from "lucide-react";
import { DeleteFornecedorModalProps } from "./types";
import { FornecedorUtils } from "./fornecedor-utils";

export function DeleteFornecedorModal({
  isOpen,
  onClose,
  fornecedor,
  onConfirm
}: DeleteFornecedorModalProps) {
  if (!fornecedor) return null;

  const document = FornecedorUtils.getPrimaryDocument(fornecedor);
  const compras = FornecedorUtils.getComprasStatistics(fornecedor);
  const hasCompras = compras.totalCompras > 0;

  const handleConfirm = async () => {
    await onConfirm(fornecedor.id);
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
            Esta ação não pode ser desfeita. O fornecedor será removido permanentemente do sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do fornecedor a ser excluído */}
          <div className="bg-muted/50 p-4 rounded-lg border border-destructive/20">
            <div className="flex items-start space-x-3">
              <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1 space-y-2">
                <div>
                  <p className="font-semibold">{fornecedor.nome}</p>
                  {fornecedor.razaoSocial && fornecedor.razaoSocial !== fornecedor.nome && (
                    <p className="text-sm text-muted-foreground">
                      Razão Social: {fornecedor.razaoSocial}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Documento:</span>
                    <span className="ml-2 font-mono">
                      {document.formatted}
                    </span>
                  </div>
                  
                  {fornecedor.email && (
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <span className="ml-2">{fornecedor.email}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2">
                      {FornecedorUtils.getStatusText(fornecedor.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Aviso sobre compras associadas */}
          {hasCompras ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-800 mb-2">
                    ⚠️ Atenção: Este fornecedor possui compras associadas!
                  </p>
                  <div className="text-red-700 space-y-1">
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span>
                        <strong>{compras.totalCompras}</strong> compras registradas
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 flex items-center justify-center">📦</span>
                      <span>
                        <strong>{compras.totalItens}</strong> itens comprados
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-red-600 font-medium">
                    A exclusão não será possível enquanto houver compras associadas.
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
                    <li>• Todos os dados do fornecedor serão perdidos</li>
                    <li>• O histórico será removido permanentemente</li>
                    <li>• Esta ação não pode ser desfeita</li>
                    <li>• Relatórios antigos podem ser afetados</li>
                  </ul>
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
            disabled={hasCompras}
          >
            {hasCompras ? 'Não é Possível Excluir' : 'Excluir Fornecedor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}