import {
  TableCell,
  TableRow,
  Button,
  Badge,
} from "@/shared/components/ui";
import { Eye, Edit, Trash2 } from "lucide-react";
import { DespesaRowProps } from "./types";
import {
  formatCurrency,
  formatDate,
  getCategoriaText,
  getCategoriaColor,
  getFormaPagamentoText,
  getFormaPagamentoColor,
} from "./despesa-utils";

export function DespesaRow({ despesa, onView, onEdit, onDelete }: DespesaRowProps) {
  return (
    <TableRow className="hover:bg-muted/50">
      {/* Data */}
      <TableCell className="font-medium">
        {formatDate(despesa.data)}
      </TableCell>
      
      {/* Descrição */}
      <TableCell>
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{despesa.descricao}</div>
          {despesa.observacoes && (
            <div className="text-sm text-muted-foreground truncate">
              {despesa.observacoes}
            </div>
          )}
        </div>
      </TableCell>
      
      {/* Categoria */}
      <TableCell>
        <Badge className={getCategoriaColor(despesa.categoria)}>
          {getCategoriaText(despesa.categoria)}
        </Badge>
      </TableCell>
      
      {/* Valor */}
      <TableCell className="text-right font-medium">
        {formatCurrency(despesa.valor)}
      </TableCell>
      
      {/* Forma de Pagamento */}
      <TableCell>
        <Badge className={getFormaPagamentoColor(despesa.formaPagamento)}>
          {getFormaPagamentoText(despesa.formaPagamento)}
        </Badge>
      </TableCell>
      
      {/* Criado por */}
      <TableCell className="text-sm text-muted-foreground">
        {despesa.criadoPor.name}
      </TableCell>
      
      {/* Ações */}
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(despesa)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(despesa)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(despesa)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}