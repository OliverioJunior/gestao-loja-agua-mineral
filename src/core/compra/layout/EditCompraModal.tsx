import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Edit,
  ShoppingCart,
  Calendar,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { EditCompraModalProps, CompraFormData } from "./types";
import { CompraUtils } from "./compra-utils";
import {
  FormaPagamentoCompra,
  StatusCompra,
} from "@/infrastructure/generated/prisma";

export function EditCompraModal({
  isOpen,
  onClose,
  compra,
  onSubmit,
}: EditCompraModalProps) {
  const [formData, setFormData] = useState<CompraFormData>({
    fornecedorId: "",
    numeroNota: "",
    dataCompra: new Date(),
    dataVencimento: undefined,
    total: 0,
    desconto: 0,
    frete: 0,
    impostos: 0,
    formaPagamento: "DINHEIRO",
    status: "PENDENTE",
    observacoes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Preencher formulário quando compra mudar
  useEffect(() => {
    if (compra) {
      setFormData({
        fornecedorId: compra.fornecedorId,
        numeroNota: compra.numeroNota || "",
        dataCompra: new Date(compra.dataCompra),
        dataVencimento: compra.dataVencimento
          ? new Date(compra.dataVencimento)
          : undefined,
        total: CompraUtils.toReais(compra.total),
        desconto: compra.desconto ? CompraUtils.toReais(compra.desconto) : 0,
        frete: compra.frete ? CompraUtils.toReais(compra.frete) : 0,
        impostos: compra.impostos ? CompraUtils.toReais(compra.impostos) : 0,
        formaPagamento: compra.formaPagamento,
        status: compra.status,
        observacoes: compra.observacoes || "",
      });
    }
  }, [compra]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.dataCompra) {
      newErrors.dataCompra = "Data da compra é obrigatória";
    } else {
      const hoje = new Date();
      hoje.setHours(23, 59, 59, 999);
      if (formData.dataCompra > hoje) {
        newErrors.dataCompra = "Data da compra não pode ser futura";
      }
    }

    if (formData.dataVencimento && formData.dataCompra) {
      if (formData.dataVencimento < formData.dataCompra) {
        newErrors.dataVencimento =
          "Data de vencimento não pode ser anterior à data de compra";
      }
    }

    if (formData.total <= 0) {
      newErrors.total = "Valor total deve ser maior que zero";
    }

    if (formData.desconto && formData.desconto > formData.total) {
      newErrors.desconto = "Desconto não pode ser maior que o valor total";
    }

    if (formData.frete && formData.frete < 0) {
      newErrors.frete = "Frete não pode ser negativo";
    }

    if (formData.impostos && formData.impostos < 0) {
      newErrors.impostos = "Impostos não podem ser negativos";
    }

    if (!formData.formaPagamento) {
      newErrors.formaPagamento = "Forma de pagamento é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !compra) return;

    setLoading(true);
    try {
      await onSubmit(compra.id, {
        numeroNota: formData.numeroNota?.trim() || null,
        dataCompra: formData.dataCompra,
        dataVencimento: formData.dataVencimento || null,
        total: CompraUtils.toCents(formData.total),
        desconto: formData.desconto
          ? CompraUtils.toCents(formData.desconto)
          : null,
        frete: formData.frete ? CompraUtils.toCents(formData.frete) : null,
        impostos: formData.impostos
          ? CompraUtils.toCents(formData.impostos)
          : null,
        formaPagamento: formData.formaPagamento as FormaPagamentoCompra,
        status: formData.status as StatusCompra,
        observacoes: formData.observacoes?.trim() || null,
        atualizadoPorId: "current-user-id", // TODO: Obter do contexto de usuário
      });
    } catch (error) {
      console.error("Erro ao atualizar compra:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleMoneyChange = (field: keyof CompraFormData, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setFormData((prev) => ({ ...prev, [field]: numericValue }));
  };

  const handleDateChange = (field: keyof CompraFormData, value: string) => {
    const date = value ? new Date(value) : undefined;
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  if (!compra) return null;

  const canEdit = CompraUtils.canEdit(compra);
  const allowedStatusTransitions = CompraUtils.getAllowedStatusTransitions(
    compra.status
  );
  const financial = CompraUtils.getFinancialInfo(compra);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Editar Compra</span>
          </DialogTitle>
        </DialogHeader>

        {!canEdit && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">
                  ⚠️ Compra não pode ser editada
                </p>
                <p className="text-yellow-700">
                  Compras com status &quot;
                  {CompraUtils.getStatusText(compra.status)}
                  &quot; não podem ser modificadas.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Informações Básicas</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Input
                  id="fornecedor"
                  value={compra.fornecedor?.nome || "Fornecedor não informado"}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  O fornecedor não pode ser alterado após a criação
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroNota">Número da Nota Fiscal</Label>
                <Input
                  id="numeroNota"
                  value={formData.numeroNota}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      numeroNota: e.target.value,
                    }))
                  }
                  placeholder="Ex: 12345"
                  disabled={!canEdit}
                />
                {errors.numeroNota && (
                  <p className="text-sm text-destructive">
                    {errors.numeroNota}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Datas</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataCompra">Data da Compra *</Label>
                <Input
                  id="dataCompra"
                  type="date"
                  value={
                    formData.dataCompra
                      ? formData.dataCompra.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleDateChange("dataCompra", e.target.value)
                  }
                  disabled={!canEdit}
                />
                {errors.dataCompra && (
                  <p className="text-sm text-destructive">
                    {errors.dataCompra}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                <Input
                  id="dataVencimento"
                  type="date"
                  value={
                    formData.dataVencimento
                      ? formData.dataVencimento.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleDateChange("dataVencimento", e.target.value)
                  }
                  disabled={!canEdit}
                />
                {errors.dataVencimento && (
                  <p className="text-sm text-destructive">
                    {errors.dataVencimento}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Valores Financeiros */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Valores Financeiros</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total">Valor Total *</Label>
                <Input
                  id="total"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.total}
                  onChange={(e) => handleMoneyChange("total", e.target.value)}
                  placeholder="0,00"
                  disabled={!canEdit}
                />
                {errors.total && (
                  <p className="text-sm text-destructive">{errors.total}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="desconto">Desconto</Label>
                <Input
                  id="desconto"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.desconto}
                  onChange={(e) =>
                    handleMoneyChange("desconto", e.target.value)
                  }
                  placeholder="0,00"
                  disabled={!canEdit}
                />
                {errors.desconto && (
                  <p className="text-sm text-destructive">{errors.desconto}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="frete">Frete</Label>
                <Input
                  id="frete"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.frete}
                  onChange={(e) => handleMoneyChange("frete", e.target.value)}
                  placeholder="0,00"
                  disabled={!canEdit}
                />
                {errors.frete && (
                  <p className="text-sm text-destructive">{errors.frete}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="impostos">Impostos</Label>
                <Input
                  id="impostos"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.impostos}
                  onChange={(e) =>
                    handleMoneyChange("impostos", e.target.value)
                  }
                  placeholder="0,00"
                  disabled={!canEdit}
                />
                {errors.impostos && (
                  <p className="text-sm text-destructive">{errors.impostos}</p>
                )}
              </div>
            </div>
          </div>

          {/* Forma de Pagamento e Status */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
                <Select
                  value={formData.formaPagamento}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, formaPagamento: value }))
                  }
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="CARTAO_DEBITO">
                      Cartão de Débito
                    </SelectItem>
                    <SelectItem value="CARTAO_CREDITO">
                      Cartão de Crédito
                    </SelectItem>
                    <SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
                    <SelectItem value="BOLETO">Boleto</SelectItem>
                    <SelectItem value="CHEQUE">Cheque</SelectItem>
                    <SelectItem value="PRAZO">A Prazo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.formaPagamento && (
                  <p className="text-sm text-destructive">
                    {errors.formaPagamento}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                  disabled={!canEdit || allowedStatusTransitions.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={compra.status}>
                      {CompraUtils.getStatusText(compra.status)} (Atual)
                    </SelectItem>
                    {allowedStatusTransitions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {CompraUtils.getStatusText(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {allowedStatusTransitions.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Nenhuma transição de status disponível
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-4">
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
                placeholder="Observações adicionais sobre a compra"
                rows={3}
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Comparação com valores originais */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-800">
              Valores Originais vs Atuais
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-700 mb-1">Valores Originais:</p>
                <div className="space-y-1">
                  <div>
                    <strong>Total:</strong>{" "}
                    {CompraUtils.formatCurrency(financial.total)}
                  </div>
                  <div>
                    <strong>Desconto:</strong>{" "}
                    {CompraUtils.formatCurrency(financial.desconto)}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    {CompraUtils.getStatusText(compra.status)}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-blue-700 mb-1">Novos Valores:</p>
                <div className="space-y-1">
                  <div>
                    <strong>Total:</strong>{" "}
                    {CompraUtils.formatCurrency(
                      CompraUtils.toCents(formData.total)
                    )}
                  </div>
                  <div>
                    <strong>Desconto:</strong>{" "}
                    {CompraUtils.formatCurrency(
                      CompraUtils.toCents(formData.desconto || 0)
                    )}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    {CompraUtils.getStatusText(formData.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !canEdit}>
              {loading
                ? "Salvando..."
                : canEdit
                ? "Salvar Alterações"
                : "Não Editável"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
