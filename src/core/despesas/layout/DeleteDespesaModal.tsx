"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
} from "@/shared/components/ui";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { DeleteDespesaModalProps } from "./types";
import { formatCurrency, formatDate } from "./despesa-utils";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogDescription />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Exclusão
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir esta despesa? Esta ação não pode ser
            desfeita.
          </p>

          {/* Informações da despesa */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium">Descrição:</span>
              <span className="text-sm text-right flex-1 ml-2">
                {despesa.descricao}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Valor:</span>
              <span className="text-sm font-bold text-destructive">
                {formatCurrency(despesa.valor)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Data:</span>
              <span className="text-sm">{formatDate(despesa.data)}</span>
            </div>
          </div>

          <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-destructive mb-1">Atenção!</p>
                <p className="text-destructive/80">
                  Esta despesa será permanentemente removida do sistema e não
                  poderá ser recuperada.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {loading ? "Excluindo..." : "Excluir Despesa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
