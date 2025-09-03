import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/components/ui/select";
import { Edit, Calculator } from "lucide-react";
import { EditItemCompraModalProps, ItemCompraFormData } from "./types";
import { ItemCompraUtils } from "./item-compra-utils";

export function EditItemCompraModal({
  isOpen,
  onClose,
  item,
  onSubmit
}: EditItemCompraModalProps) {
  const [formData, setFormData] = useState<ItemCompraFormData>({
    compraId: '',
    produtoId: '',
    quantidade: 1,
    precoUnitario: 0,
    precoTotal: 0,
    desconto: 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Preencher formulário quando item mudar
  useEffect(() => {
    if (item) {
      setFormData({
        compraId: item.compraId,
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: ItemCompraUtils.toReais(item.precoUnitario),
        precoTotal: ItemCompraUtils.toReais(item.precoTotal),
        desconto: ItemCompraUtils.toReais(item.desconto || 0)
      });
    }
  }, [item]);

  // Recalcular total quando quantidade, preço unitário ou desconto mudarem
  useEffect(() => {
    const total = ItemCompraUtils.calculateTotal(
      formData.quantidade,
      ItemCompraUtils.toCents(formData.precoUnitario),
      ItemCompraUtils.toCents(formData.desconto || 0)
    );
    
    setFormData(prev => ({
      ...prev,
      precoTotal: ItemCompraUtils.toReais(total)
    }));
  }, [formData.quantidade, formData.precoUnitario, formData.desconto]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.produtoId.trim()) {
      newErrors.produtoId = 'Selecione um produto';
    }

    if (formData.quantidade <= 0) {
      newErrors.quantidade = 'Quantidade deve ser maior que zero';
    }

    if (formData.precoUnitario <= 0) {
      newErrors.precoUnitario = 'Preço unitário deve ser maior que zero';
    }

    if (formData.desconto && formData.desconto < 0) {
      newErrors.desconto = 'Desconto não pode ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !item) return;

    setLoading(true);
    try {
      await onSubmit(item.id, {
        produtoId: formData.produtoId,
        quantidade: formData.quantidade,
        precoUnitario: ItemCompraUtils.toCents(formData.precoUnitario),
        precoTotal: ItemCompraUtils.toCents(formData.precoTotal),
        desconto: formData.desconto ? ItemCompraUtils.toCents(formData.desconto) : 0,
        atualizadoPorId: 'current-user-id' // TODO: Obter do contexto de usuário
      });
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Editar Item de Compra</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações da Compra (somente leitura) */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Informações da Compra</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Fornecedor:</span>
                <span className="ml-2 font-medium">
                  {ItemCompraUtils.getFornecedorName(item)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Nota Fiscal:</span>
                <span className="ml-2 font-medium">
                  {ItemCompraUtils.getNumeroNota(item)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Produto */}
            <div className="space-y-2">
              <Label htmlFor="produtoId">Produto *</Label>
              <Select
                value={formData.produtoId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, produtoId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {/* TODO: Carregar produtos do backend */}
                  <SelectItem value={item.produtoId}>
                    {item.produto?.nome || 'Produto atual'}
                  </SelectItem>
                  <SelectItem value="produto-1">Água Mineral 500ml</SelectItem>
                  <SelectItem value="produto-2">Água Mineral 1L</SelectItem>
                </SelectContent>
              </Select>
              {errors.produtoId && (
                <p className="text-sm text-destructive">{errors.produtoId}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Quantidade */}
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                value={formData.quantidade}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  quantidade: parseInt(e.target.value) || 0
                }))}
                placeholder="Ex: 100"
              />
              {errors.quantidade && (
                <p className="text-sm text-destructive">{errors.quantidade}</p>
              )}
            </div>

            {/* Preço Unitário */}
            <div className="space-y-2">
              <Label htmlFor="precoUnitario">Preço Unitário (R$) *</Label>
              <Input
                id="precoUnitario"
                type="number"
                step="0.01"
                min="0"
                value={formData.precoUnitario}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  precoUnitario: parseFloat(e.target.value) || 0
                }))}
                placeholder="Ex: 1.50"
              />
              {errors.precoUnitario && (
                <p className="text-sm text-destructive">{errors.precoUnitario}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Desconto */}
            <div className="space-y-2">
              <Label htmlFor="desconto">Desconto (R$)</Label>
              <Input
                id="desconto"
                type="number"
                step="0.01"
                min="0"
                value={formData.desconto || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  desconto: parseFloat(e.target.value) || 0
                }))}
                placeholder="Ex: 5.00"
              />
              {errors.desconto && (
                <p className="text-sm text-destructive">{errors.desconto}</p>
              )}
            </div>

            {/* Total (calculado) */}
            <div className="space-y-2">
              <Label>Total Calculado</Label>
              <div className="flex items-center space-x-2">
                <Calculator className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-lg font-semibold">
                  {ItemCompraUtils.formatCurrency(ItemCompraUtils.toCents(formData.precoTotal))}
                </span>
              </div>
            </div>
          </div>

          {/* Comparação com valores originais */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-800">Comparação com Valores Originais</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-700 mb-1">Valores Originais:</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Quantidade:</span>
                    <span className="font-mono">{item.quantidade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Preço Unit.:</span>
                    <span className="font-mono">
                      {ItemCompraUtils.formatCurrency(item.precoUnitario)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-mono font-semibold">
                      {ItemCompraUtils.formatCurrency(item.precoTotal)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-blue-700 mb-1">Novos Valores:</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Quantidade:</span>
                    <span className="font-mono">{formData.quantidade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Preço Unit.:</span>
                    <span className="font-mono">
                      {ItemCompraUtils.formatCurrency(ItemCompraUtils.toCents(formData.precoUnitario))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-mono font-semibold">
                      {ItemCompraUtils.formatCurrency(ItemCompraUtils.toCents(formData.precoTotal))}
                    </span>
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
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}