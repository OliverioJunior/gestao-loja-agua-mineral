import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Badge,
  Separator,
} from "@/shared/components/ui";
import {
  Receipt,
  Calendar,
  DollarSign,
  CreditCard,
  User,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";
import { DespesaDetailsModalProps } from "./types";
import {
  formatCurrency,
  formatDate,
  getCategoriaText,
  getCategoriaColor,
  getFormaPagamentoText,
  getFormaPagamentoColor,
} from "./despesa-utils";

export function DespesaDetailsModal({
  despesa,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: DespesaDetailsModalProps) {
  if (!despesa) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Detalhes da Despesa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Descrição */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                Descrição
              </div>
              <p className="text-lg font-medium">{despesa.descricao}</p>
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Valor
              </div>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(despesa.valor)}
              </p>
            </div>

            {/* Data */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Data
              </div>
              <p className="text-lg">{formatDate(despesa.data)}</p>
            </div>

            {/* Forma de Pagamento */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                Forma de Pagamento
              </div>
              <Badge className={getFormaPagamentoColor(despesa.formaPagamento)}>
                {getFormaPagamentoText(despesa.formaPagamento)}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Categoria */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Receipt className="h-4 w-4" />
              Categoria
            </div>
            <Badge className={getCategoriaColor(despesa.categoria)}>
              {getCategoriaText(despesa.categoria)}
            </Badge>
          </div>

          {/* Observações */}
          {despesa.observacoes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                Observações
              </div>
              <p className="text-sm bg-muted p-3 rounded-md">
                {despesa.observacoes}
              </p>
            </div>
          )}

          <Separator />

          {/* Informações de auditoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Criado por
              </div>
              <p className="font-medium">{despesa.criadoPor.name}</p>
              <p className="text-xs">{formatDate(despesa.createdAt)}</p>
            </div>

            {despesa.atualizadoPor && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Atualizado por
                </div>
                <p className="font-medium">{despesa.atualizadoPor.name}</p>
                <p className="text-xs">{formatDate(despesa.updatedAt)}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onEdit(despesa);
              onClose();
            }}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(despesa);
              onClose();
            }}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}