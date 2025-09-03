import { Eye, Edit, Trash2, Tag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { ItemCompraRowProps } from "./types";
import { ItemCompraUtils } from "./item-compra-utils";

export function ItemCompraRow({
  item,
  onView,
  onEdit,
  onDelete
}: ItemCompraRowProps) {
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
    <TableRow className="hover:bg-muted/50">
      {/* Produto */}
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span className="font-semibold">
            {item.produto?.nome || 'Produto não encontrado'}
          </span>
          {item.produto?.marca && (
            <span className="text-sm text-muted-foreground">
              {item.produto.marca}
            </span>
          )}
        </div>
      </TableCell>

      {/* Fornecedor */}
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">
            {ItemCompraUtils.getFornecedorName(item)}
          </span>
          <span className="text-sm text-muted-foreground">
            NF: {ItemCompraUtils.getNumeroNota(item)}
          </span>
        </div>
      </TableCell>

      {/* Quantidade */}
      <TableCell className="text-center">
        <Badge variant="outline" className="font-mono">
          {item.quantidade.toLocaleString('pt-BR')}
        </Badge>
      </TableCell>

      {/* Preço Unitário */}
      <TableCell className="text-right font-mono">
        {ItemCompraUtils.formatCurrency(item.precoUnitario)}
      </TableCell>

      {/* Subtotal */}
      <TableCell className="text-right font-mono">
        {ItemCompraUtils.formatCurrency(subtotal)}
      </TableCell>

      {/* Desconto */}
      <TableCell className="text-right">
        {hasDiscount ? (
          <div className="flex flex-col items-end">
            <span className="font-mono text-red-600">
              -{ItemCompraUtils.formatCurrency(item.desconto || 0)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({discountPercentage.toFixed(1)}%)
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>

      {/* Total */}
      <TableCell className="text-right">
        <div className="flex flex-col items-end">
          <span className="font-mono font-semibold">
            {ItemCompraUtils.formatCurrency(item.precoTotal)}
          </span>
          {hasDiscount && (
            <div className="flex items-center text-xs text-green-600">
              <Tag className="h-3 w-3 mr-1" />
              Desconto
            </div>
          )}
        </div>
      </TableCell>

      {/* Data */}
      <TableCell className="text-sm text-muted-foreground">
        {ItemCompraUtils.formatDate(item.createdAt)}
      </TableCell>

      {/* Ações */}
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(item)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}