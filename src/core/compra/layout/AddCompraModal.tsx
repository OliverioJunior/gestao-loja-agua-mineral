import { useState } from "react";
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
import { Plus, ShoppingCart, Calendar, DollarSign } from "lucide-react";
import { AddCompraModalProps, CompraFormData } from "./types";
import { CompraUtils } from "./compra-utils";
import {
  FormaPagamentoCompra,
  StatusCompra,
} from "@/infrastructure/generated/prisma";

export function AddCompraModal({
  isOpen,
  onClose,
  onSubmit,
}: AddCompraModalProps) {
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fornecedorId.trim()) {
      newErrors.fornecedorId = "Fornecedor é obrigatório";
    }

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

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit({
        fornecedorId: formData.fornecedorId,
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
        criadoPorId: "current-user-id", // TODO: Obter do contexto de usuário
      });

      // Reset form
      setFormData({
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
      setErrors({});
    } catch (error) {
      console.error("Erro ao criar compra:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Adicionar Compra</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Informações Básicas</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fornecedorId">Fornecedor *</Label>
                <Select
                  value={formData.fornecedorId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, fornecedorId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* TODO: Carregar fornecedores do sistema */}
                    <SelectItem value="fornecedor-1">
                      Fornecedor Exemplo 1
                    </SelectItem>
                    <SelectItem value="fornecedor-2">
                      Fornecedor Exemplo 2
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.fornecedorId && (
                  <p className="text-sm text-destructive">
                    {errors.fornecedorId}
                  </p>
                )}
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
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="CONFIRMADA">Confirmada</SelectItem>
                    <SelectItem value="RECEBIDA">Recebida</SelectItem>
                  </SelectContent>
                </Select>
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
              />
            </div>
          </div>

          {/* Resumo Financeiro */}
          {formData.total > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-blue-800">
                Resumo Financeiro
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">
                    Subtotal:{" "}
                    {CompraUtils.formatCurrency(
                      CompraUtils.toCents(
                        formData.total -
                          (formData.desconto || 0) -
                          (formData.frete || 0) -
                          (formData.impostos || 0)
                      )
                    )}
                  </p>
                  {(formData.desconto || 0) > 0 && (
                    <p className="text-green-600">
                      Desconto: -
                      {CompraUtils.formatCurrency(
                        CompraUtils.toCents(formData.desconto || 0)
                      )}
                    </p>
                  )}
                </div>
                <div>
                  {formData.frete ||
                    (0 > 0 && (
                      <p className="text-blue-700">
                        Frete:{" "}
                        {CompraUtils.formatCurrency(
                          CompraUtils.toCents(formData.frete || 0)
                        )}
                      </p>
                    ))}
                  {formData.impostos ||
                    (0 > 0 && (
                      <p className="text-blue-700">
                        Impostos:{" "}
                        {CompraUtils.formatCurrency(
                          CompraUtils.toCents(formData.impostos || 0)
                        )}
                      </p>
                    ))}
                  <p className="font-semibold text-blue-800">
                    Total:{" "}
                    {CompraUtils.formatCurrency(
                      CompraUtils.toCents(formData.total)
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Compra"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
