import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Package, Building, Calendar, Tag } from "lucide-react";
import { ItemCompraDetailsModalProps } from "./types";
import { ItemCompraUtils } from "./item-compra-utils";

export function ItemCompraDetailsModal({
  isOpen,
  onClose,
  item,
}: ItemCompraDetailsModalProps) {
  if (!item) return null;

  const hasDiscount = ItemCompraUtils.hasDiscount(item);
  const subtotal = ItemCompraUtils.getSubtotal(item);
  const discountPercentage = hasDiscount
    ? ItemCompraUtils.calculateDiscountPercentage(
        item.quantidade,
        item.precoUnitario,
        item.desconto || 0
      )
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Detalhes do Item de Compra</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Produto */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Produto</h3>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">
                    {item.produto?.nome || "Produto não encontrado"}
                  </p>
                </div>
                {item.produto?.marca && (
                  <div>
                    <p className="text-sm text-muted-foreground">Marca</p>
                    <p className="font-medium">{item.produto.marca}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informações da Compra */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Compra</h3>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fornecedor</p>
                  <p className="font-medium">
                    {ItemCompraUtils.getFornecedorName(item)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nota Fiscal</p>
                  <p className="font-medium">
                    {ItemCompraUtils.getNumeroNota(item)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações Financeiras */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Valores</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Quantidade:
                  </span>
                  <Badge variant="outline" className="font-mono">
                    {item.quantidade.toLocaleString("pt-BR")}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Preço Unitário:
                  </span>
                  <span className="font-mono">
                    {ItemCompraUtils.formatCurrency(item.precoUnitario)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Subtotal:
                  </span>
                  <span className="font-mono">
                    {ItemCompraUtils.formatCurrency(subtotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {hasDiscount && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Desconto:
                      </span>
                      <div className="text-right">
                        <div className="font-mono text-red-600">
                          -{ItemCompraUtils.formatCurrency(item.desconto || 0)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ({discountPercentage.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-semibold">Total:</span>
                  <span className="font-mono font-bold text-lg">
                    {ItemCompraUtils.formatCurrency(item.precoTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações de Auditoria */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Informações do Sistema</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Criado em:</p>
                <p className="font-medium">
                  {ItemCompraUtils.formatDate(item.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Atualizado em:</p>
                <p className="font-medium">
                  {ItemCompraUtils.formatDate(item.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Validação de Consistência */}
          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  ItemCompraUtils.validateItemConsistency(item)
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium">
                {ItemCompraUtils.validateItemConsistency(item)
                  ? "Valores consistentes"
                  : "Inconsistência nos valores detectada"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
