import { ConfirmationModal } from "@/shared/components/ui";
import { AlertTriangle, ShoppingCart } from "lucide-react";
import { DeleteFornecedorModalProps } from "./types";
import { FornecedorUtils } from "./fornecedor-utils";

export function DeleteFornecedorModal({
  isOpen,
  onClose,
  fornecedor,
  onConfirm,
}: DeleteFornecedorModalProps) {
  if (!fornecedor) return null;

  const document = FornecedorUtils.getPrimaryDocument(fornecedor);
  const compras = FornecedorUtils.getComprasStatistics(fornecedor);
  const hasCompras = compras.totalCompras > 0;

  const handleConfirm = async () => {
    await onConfirm(fornecedor.id);
  };

  // Validação antes da confirmação
  const handleBeforeConfirm = async () => {
    return !hasCompras; // Só permite confirmar se não houver compras
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      onBeforeConfirm={handleBeforeConfirm}
      title="Confirmar Exclusão"
      description="Esta ação não pode ser desfeita. O fornecedor será removido permanentemente do sistema."
      variant="danger"
      actionType="delete"
      size="sm"
      itemInfo={{
        name: fornecedor.nome,
        type: "fornecedor",
        id: fornecedor.id,
        details: {
          razaoSocial: fornecedor.razaoSocial || "Não informado",
          documento: document.formatted,
          email: fornecedor.email || "Não informado",
          status: FornecedorUtils.getStatusText(fornecedor.status),
        },
      }}
      confirmButton={{
        text: hasCompras ? "Não é Possível Excluir" : "Excluir Fornecedor",
        variant: "destructive",
        disabled: hasCompras,
      }}
      cancelButton={{
        text: "Cancelar",
        variant: "outline",
      }}
      data-testid="delete-fornecedor-modal"
    >
      <div className="space-y-4">
        {/* Aviso sobre compras associadas */}
        {hasCompras ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-800 dark:text-red-200 mb-2">
                  ⚠️ Atenção: Este fornecedor possui compras associadas!
                </p>
                <div className="text-red-700 dark:text-red-300 space-y-1">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>
                      <strong>{compras.totalCompras}</strong> compras
                      registradas
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 flex items-center justify-center">
                      📦
                    </span>
                    <span>
                      <strong>{compras.totalItens}</strong> itens comprados
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-red-600 dark:text-red-400 font-medium">
                  A exclusão não será possível enquanto houver compras
                  associadas.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Consequências da exclusão:
                </p>
                <ul className="text-yellow-700 dark:text-yellow-300 space-y-1">
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
    </ConfirmationModal>
  );
}
