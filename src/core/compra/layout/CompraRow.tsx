import {
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Package,
  XCircle,
  Building,
  FileText,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { CompraRowProps } from "./types";
import { CompraUtils } from "./compra-utils";

export function CompraRow({
  compra,
  onView,
  onEdit,
  onDelete,
  onConfirmar,
  onReceber,
  onCancelar,
}: CompraRowProps) {
  const statusColors = CompraUtils.getStatusColor(compra.status);
  const financial = CompraUtils.getFinancialInfo(compra);
  const itens = CompraUtils.getItensStatistics(compra);
  const isVencida = CompraUtils.isVencida(compra);
  const diasVencimento = CompraUtils.getDiasAteVencimento(compra);

  const canEdit = CompraUtils.canEdit(compra);
  const canDelete = CompraUtils.canDelete(compra);
  const canConfirm = CompraUtils.canConfirm(compra);
  const canReceive = CompraUtils.canReceive(compra);
  const canCancel = CompraUtils.canCancel(compra);

  return (
    <TableRow className={`hover:bg-muted/50 ${isVencida ? "bg-red-50" : ""}`}>
      {/* Número da Nota e Fornecedor */}
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">
              {CompraUtils.formatNumeroNota(compra.numeroNota)}
            </span>
            {isVencida && <AlertTriangle className="h-4 w-4 text-red-500" />}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Building className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {compra.fornecedor?.nome || "Fornecedor não informado"}
            </span>
          </div>
        </div>
      </TableCell>

      {/* Data da Compra */}
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">
            {CompraUtils.formatDate(compra.dataCompra)}
          </span>
          {compra.dataVencimento && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span
                className={`text-xs ${
                  isVencida
                    ? "text-red-600 font-medium"
                    : diasVencimento !== null && diasVencimento <= 7
                    ? "text-yellow-600"
                    : "text-muted-foreground"
                }`}
              >
                Venc: {CompraUtils.formatDate(compra.dataVencimento)}
                {diasVencimento !== null && (
                  <span className="ml-1">
                    ({diasVencimento > 0 ? `${diasVencimento}d` : "Vencida"})
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge
          variant="outline"
          className={`${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
        >
          {CompraUtils.getStatusText(compra.status)}
        </Badge>
      </TableCell>

      {/* Forma de Pagamento */}
      <TableCell className="text-sm">
        {CompraUtils.getFormaPagamentoText(compra.formaPagamento)}
      </TableCell>

      {/* Itens */}
      <TableCell className="text-center">
        <div className="flex flex-col">
          <span className="font-semibold">{itens.totalItens}</span>
          <span className="text-xs text-muted-foreground">
            {itens.quantidadeTotal} unid.
          </span>
        </div>
      </TableCell>

      {/* Valores Financeiros */}
      <TableCell>
        <div className="flex flex-col text-right">
          <span className="font-semibold">
            {CompraUtils.formatCurrency(financial.total)}
          </span>
          {financial.desconto > 0 && (
            <span className="text-xs text-green-600">
              -{CompraUtils.formatCurrency(financial.desconto)}
            </span>
          )}
          {(financial.frete > 0 || financial.impostos > 0) && (
            <span className="text-xs text-muted-foreground">
              +
              {CompraUtils.formatCurrency(financial.frete + financial.impostos)}
            </span>
          )}
        </div>
      </TableCell>

      {/* Ações */}
      <TableCell>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(compra)}
            className="h-8 w-8 p-0"
            title="Visualizar detalhes"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(compra)}
              className="h-8 w-8 p-0"
              title="Editar compra"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}

          {canConfirm && onConfirmar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onConfirmar(compra.id)}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
              title="Confirmar compra"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}

          {canReceive && onReceber && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReceber(compra.id)}
              className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
              title="Receber compra"
            >
              <Package className="h-4 w-4" />
            </Button>
          )}

          {canCancel && onCancelar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCancelar(compra.id)}
              className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
              title="Cancelar compra"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}

          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(compra)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              title="Excluir compra"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
