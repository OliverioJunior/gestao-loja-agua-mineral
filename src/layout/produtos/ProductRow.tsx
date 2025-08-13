import { TableCell, TableRow, Button, Badge } from "@/shared/components/ui";
import { Eye, Edit, Trash2, Package } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getStatusColor, formatPrice } from "./product-utils";
import { IProductRow } from "./types";

export function ProductRow({ product, onView, onEdit, onDelete }: IProductRow) {
  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground">{product.nome}</div>
            <div className="text-sm text-muted-foreground">
              {product.marca || "Sem marca"}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell className="py-4 px-6">
        <div className="space-y-1">
          <div className="text-sm font-medium">
            Venda: {formatPrice(product.precoVenda)}
          </div>
          <div className="text-xs text-muted-foreground">
            Custo: {formatPrice(product.precoCusto)}
          </div>
          {product.promocao && product.precoPromocao && (
            <div className="text-xs text-purple-600 font-medium">
              Promoção: {formatPrice(product.precoPromocao)}
            </div>
          )}
        </div>
      </TableCell>

      <TableCell className="py-4 px-6">
        <div className="space-y-1">
          <Badge className={`${getStatusColor(product.ativo)} border`}>
            {product.quantidade}
          </Badge>
          {product.promocao && (
            <Badge className=" text-purple-800 border-none text-xs">
              Promoção
            </Badge>
          )}
        </div>
      </TableCell>

      <TableCell className="py-4 px-6" colSpan={2}>
        <div className="text-sm text-muted-foreground">
          {format(product.updatedAt, "dd/MM/yyyy", { locale: ptBR })}
        </div>
      </TableCell>

      <TableCell className="py-4 px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(product)}
            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product)}
            className="h-8 w-8 p-0 hover:bg-yellow-100 hover:text-yellow-600"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(product)}
            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
