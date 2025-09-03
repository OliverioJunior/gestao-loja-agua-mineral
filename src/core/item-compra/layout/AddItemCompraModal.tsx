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
import { Plus, Calculator } from "lucide-react";
import { AddItemCompraModalProps, ItemCompraFormData } from "./types";
import { ItemCompraUtils } from "./item-compra-utils";

export function AddItemCompraModal({
  isOpen,
  onClose,
  onSubmit,
  compraId
}: AddItemCompraModalProps) {
  const [formData, setFormData] = useState<ItemCompraFormData>({
    compraId: compraId || '',
    produtoId: '',
    quantidade: 1,
    precoUnitario: 0,
    precoTotal: 0,
    desconto: 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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

    if (!formData.compraId.trim()) {
      newErrors.compraId = 'Selecione uma compra';
    }

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
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit({
        compraId: formData.compraId,
        produtoId: formData.produtoId,
        quantidade: formData.quantidade,
        precoUnitario: ItemCompraUtils.toCents(formData.precoUnitario),
        precoTotal: ItemCompraUtils.toCents(formData.precoTotal),
        desconto: formData.desconto ? ItemCompraUtils.toCents(formData.desconto) : 0,
        criadoPorId: 'current-user-id' // TODO: Obter do contexto de usuário
      });
      
      // Reset form
      setFormData({
        compraId: compraId || '',
        produtoId: '',
        quantidade: 1,
        precoUnitario: 0,
        precoTotal: 0,
        desconto: 0
      });
      setErrors({});
    } catch (error) {
      console.error('Erro ao criar item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      compraId: compraId || '',
      produtoId: '',
      quantidade: 1,
      precoUnitario: 0,
      precoTotal: 0,
      desconto: 0
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Adicionar Item de Compra</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Compra */}
            <div className="space-y-2">
              <Label htmlFor="compraId">Compra *</Label>
              <Select
                value={formData.compraId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, compraId: value }))}
                disabled={!!compraId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma compra" />
                </SelectTrigger>
                <SelectContent>
                  {/* TODO: Carregar compras do backend */}
                  <SelectItem value="compra-1">Compra #001 - Fornecedor A</SelectItem>
                  <SelectItem value="compra-2">Compra #002 - Fornecedor B</SelectItem>
                </SelectContent>
              </Select>
              {errors.compraId && (
                <p className="text-sm text-destructive">{errors.compraId}</p>
              )}
            </div>

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

          {/* Resumo do cálculo */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Resumo do Cálculo</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({formData.quantidade} × R$ {formData.precoUnitario.toFixed(2)}):</span>
                <span className="font-mono">
                  {ItemCompraUtils.formatCurrency(
                    ItemCompraUtils.toCents(formData.quantidade * formData.precoUnitario)
                  )}
                </span>
              </div>
              {formData.desconto && formData.desconto > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Desconto:</span>
                  <span className="font-mono">
                    -{ItemCompraUtils.formatCurrency(ItemCompraUtils.toCents(formData.desconto))}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t pt-1">
                <span>Total:</span>
                <span className="font-mono">
                  {ItemCompraUtils.formatCurrency(ItemCompraUtils.toCents(formData.precoTotal))}
                </span>
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
              {loading ? 'Criando...' : 'Criar Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}