"use client";
import { useState } from "react";
import { ConfirmationModal } from "@/shared/components/ui";
import { AlertTriangle } from "lucide-react";
import { DeleteDespesaModalProps } from "./types";
import { formatCurrency, formatDate } from "./despesa-utils";
import React from "react";

export function DeleteDespesaModal({
  despesa,
  isOpen,
  onClose,
  onConfirm,
}: DeleteDespesaModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const result = await onConfirm();
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!despesa) return null;

  const customContent = (
    <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-destructive mb-1">Atenção!</p>
          <p className="text-destructive/80">
            Esta despesa será permanentemente removida do sistema e não poderá
            ser recuperada.
          </p>
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
      description={`Tem certeza que deseja excluir a despesa "${despesa.descricao}"? Esta ação não pode ser desfeita.`}
      variant="danger"
      actionType="delete"
      loading={loading}
      itemInfo={{
        type: "despesa",
        name: despesa.descricao,
        details: {
          valor: formatCurrency(despesa.valor),
          data: formatDate(despesa.data),
        },
      }}
      confirmButton={{
        text: loading ? "Excluindo..." : "Excluir Despesa",
        variant: "destructive",
        disabled: loading,
      }}
      cancelButton={{
        text: "Cancelar",
        variant: "outline",
        disabled: loading,
      }}
      data-testid="delete-despesa-modal"
    >
      {customContent}
    </ConfirmationModal>
  );
}
