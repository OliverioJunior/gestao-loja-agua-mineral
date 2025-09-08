import { ConfirmationModal } from "@/shared/components/ui";
import { DeleteCompraModalProps } from "./types";
import { CompraUtils } from "./compra-utils";
import { AlertTriangle, Package } from "lucide-react";
import React from "react";

export function DeleteCompraModal({
  isOpen,
  onClose,
  compra,
  onConfirm,
}: DeleteCompraModalProps) {
  if (!compra) return null;

  const financial = CompraUtils.getFinancialInfo(compra);
  const itens = CompraUtils.getItensStatistics(compra);
  const hasItens = itens.totalItens > 0;
  const isRecebida = compra.status === "RECEBIDA";
  const canDelete = !hasItens && !isRecebida;

  const handleConfirm = async () => {
    if (canDelete) {
      await onConfirm(compra.id);
    }
  };

  const getButtonText = () => {
    if (hasItens) return "Não é Possível Excluir";
    if (isRecebida) return "Compra Recebida";
    return "Excluir Compra";
  };

  const customContent = (
    <div className="space-y-4">
      {/* Aviso sobre itens associados */}
      {hasItens && (
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
                  <span className="w-4 h-4 flex items-center justify-center">
                    📦
                  </span>
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
      )}

      {/* Aviso especial para compras recebidas */}
      {isRecebida && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-red-800 mb-1">
                🚫 Compra já foi recebida!
              </p>
              <p className="text-red-700">
                Compras recebidas não podem ser excluídas para manter a
                integridade do histórico financeiro.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Consequências da exclusão (apenas se pode excluir) */}
      {canDelete && (
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
    </div>
  );

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Confirmar Exclusão"
      description={`Tem certeza que deseja excluir a compra ${CompraUtils.formatNumeroNota(
        compra.numeroNota
      )}? Esta ação não pode ser desfeita.`}
      variant="danger"
      actionType="delete"
      itemInfo={{
        type: "compra",
        name: CompraUtils.formatNumeroNota(compra.numeroNota),
        details: {
          fornecedor: compra.fornecedor?.nome || "Não informado",
          data: CompraUtils.formatDate(compra.dataCompra),
          status: CompraUtils.getStatusText(compra.status),
          valor: CompraUtils.formatCurrency(financial.total),
        },
      }}
      confirmButton={{
        text: getButtonText(),
        variant: "destructive",
        disabled: !canDelete,
      }}
      cancelButton={{
        text: "Cancelar",
        variant: "outline",
      }}
      data-testid="delete-compra-modal"
    >
      {customContent}
    </ConfirmationModal>
  );
}
