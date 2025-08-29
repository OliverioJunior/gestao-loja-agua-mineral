"use client";
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
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui";
import { Loader2, Receipt, Plus } from "lucide-react";
import { EditDespesaModalProps, DespesaFormData } from "./types";
import {
  categoriaOptions,
  formaPagamentoOptions,
  formatDateForInput,
  formatCurrencyInput,
  convertToCents,
  convertToReais,
  validateCurrency,
} from "./despesa-utils";
import {
  CategoriaDespesa,
  FormaPagamentoDespesa,
} from "@/infrastructure/generated/prisma";
import { toast } from "sonner";

export function EditDespesaModal({
  despesa,
  isOpen,
  onClose,
  onSave,
  mode,
}: EditDespesaModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DespesaFormData>({
    descricao: "",
    valor: "",
    data: new Date().toISOString().split("T")[0],
    categoria: "OPERACIONAL" as CategoriaDespesa,
    formaPagamento: "DINHEIRO" as FormaPagamentoDespesa,
    observacoes: "",
  });

  // Resetar formulário quando o modal abrir/fechar ou despesa mudar
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && despesa) {
        setFormData({
          descricao: despesa.descricao,
          valor: convertToReais(despesa.valor),
          data: formatDateForInput(despesa.data),
          categoria: despesa.categoria,
          formaPagamento: despesa.formaPagamento,
          observacoes: despesa.observacoes || "",
        });
      } else {
        setFormData({
          descricao: "",
          valor: "",
          data: new Date().toISOString().split("T")[0],
          categoria: "OPERACIONAL" as CategoriaDespesa,
          formaPagamento: "DINHEIRO" as FormaPagamentoDespesa,
          observacoes: "",
        });
      }
    }
  }, [isOpen, mode, despesa]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.descricao.trim()) {
      toast.error("Descrição é obrigatória");
      return;
    }

    if (!formData.valor.trim()) {
      toast.error("Valor é obrigatório");
      return;
    }

    if (!validateCurrency(formData.valor)) {
      toast.error("Valor deve ser um número válido");
      return;
    }

    if (!formData.data) {
      toast.error("Data é obrigatória");
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        descricao: formData.descricao.trim(),
        valor: convertToCents(formData.valor),
        data: new Date(formData.data),
        categoria: formData.categoria,
        formaPagamento: formData.formaPagamento,
        observacoes: formData.observacoes?.trim() || undefined,
      };

      const result = await onSave(submitData);

      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
      toast.error("Erro ao salvar despesa");
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (value: string) => {
    const formatted = formatCurrencyInput(value);
    setFormData((prev) => ({ ...prev, valor: formatted }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? (
              <>
                <Plus className="h-5 w-5" />
                Nova Despesa
              </>
            ) : (
              <>
                <Receipt className="h-5 w-5" />
                Editar Despesa
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Descrição */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    descricao: e.target.value,
                  }))
                }
                placeholder="Digite a descrição da despesa"
                required
              />
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input
                id="valor"
                value={formData.valor}
                onChange={(e) => handleValueChange(e.target.value)}
                placeholder="0,00"
                required
              />
            </div>

            {/* Data */}
            <div className="space-y-2">
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, data: e.target.value }))
                }
                required
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value: CategoriaDespesa) =>
                  setFormData((prev) => ({ ...prev, categoria: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoriaOptions
                    .filter((option) => option.value !== "TODAS")
                    .map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Forma de Pagamento */}
            <div className="space-y-2">
              <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
              <Select
                value={formData.formaPagamento}
                onValueChange={(value: FormaPagamentoDespesa) =>
                  setFormData((prev) => ({ ...prev, formaPagamento: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma forma" />
                </SelectTrigger>
                <SelectContent>
                  {formaPagamentoOptions
                    .filter((option) => option.value !== "TODAS")
                    .map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  observacoes: e.target.value,
                }))
              }
              placeholder="Observações adicionais (opcional)"
              rows={3}
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Criar Despesa" : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
