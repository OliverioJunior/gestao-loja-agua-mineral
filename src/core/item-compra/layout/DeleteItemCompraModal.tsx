import { ConfirmationModal } from "@/shared/components/ui";
import { AlertTriangle } from "lucide-react";
import { DeleteItemCompraModalProps } from "./types";
import { ItemCompraUtils } from "./item-compra-utils";
import React from "react";

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

  const customContent = (
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
  );

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Confirmar Exclusão"
      description={`Tem certeza que deseja excluir o item "${
        item.produto?.nome || "Produto não encontrado"
      }"? Esta ação não pode ser desfeita.`}
      variant="danger"
      actionType="delete"
      itemInfo={{
        type: "item de compra",
        name: item.produto?.nome || "Produto não encontrado",
        details: {
          fornecedor: ItemCompraUtils.getFornecedorName(item),
          quantidade: item.quantidade.toLocaleString("pt-BR"),
          total: ItemCompraUtils.formatCurrency(item.precoTotal),
          nota: ItemCompraUtils.getNumeroNota(item),
        },
      }}
      confirmButton={{
        text: "Excluir Item",
        variant: "destructive",
      }}
      cancelButton={{
        text: "Cancelar",
        variant: "outline",
      }}
      data-testid="delete-item-compra-modal"
    >
      {customContent}
    </ConfirmationModal>
  );
}
