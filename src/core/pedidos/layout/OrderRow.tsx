import { Button, Badge } from "@/shared/components/ui";
import { ConfirmationModal } from "@/shared/components/ui";
import { Eye, Edit, Trash2, ArrowRight, X, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { OrderRowProps } from "./types";
import {
  getStatusColor,
  getStatusText,
  getPaymentMethodText,
  formatCurrency,
  formatPhone,
  canAdvanceStatus,
  canCancelOrder,
  getNextStatus,
  formatDateTime,
} from "./order-utils";

export function OrderRow({
  order,
  onView,
  onEdit,
  onDelete,
  onAdvanceStatus,
  onCancelOrder,
}: OrderRowProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = () => {
    if (onCancelOrder) {
      onCancelOrder(order.id);
    }
    setIsCancelModalOpen(false);
  };

  const handleCancelCancel = () => {
    setIsCancelModalOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(order.id);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };
  const handleView = () => {
    onView(order);
  };

  const handleAdvanceStatus = () => {
    const nextStatus = getNextStatus(order.status);
    if (nextStatus && onAdvanceStatus) {
      onAdvanceStatus(order.id, nextStatus);
    }
  };

  return (
    <>
      <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
        {/* Número do Pedido */}
        <td className="px-4 py-3">
          <div className="font-medium text-foreground">
            {order.endereco?.numero}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDateTime(new Date(order.createdAt))}
          </div>
        </td>

        {/* Cliente */}
        <td className="px-4 py-3">
          <div className="font-medium text-foreground">
            {order.cliente?.nome || "N/A"}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Phone className="h-3 w-3" />
            {formatPhone(order.cliente?.telefone || "")}
          </div>
        </td>

        {/* Tipo de Entrega */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${
                order.endereco !== null
                  ? "bg-blue-500/20 text-blue-600 border-blue-500/30"
                  : "bg-gray-500/20 text-gray-600 border-gray-500/30"
              }`}
            >
              {order.endereco !== null ? "Entrega" : "Retirada"}
            </Badge>
          </div>
          {order.endereco !== null && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              {order.endereco.cidade}
            </div>
          )}
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <Badge
            variant="outline"
            className={`text-xs ${getStatusColor(order.status)}`}
          >
            {getStatusText(order.status)}
          </Badge>
        </td>

        {/* Forma de Pagamento */}
        <td className="px-4 py-3">
          <div className="text-sm text-foreground">
            {getPaymentMethodText(order.formaPagamento)}
          </div>
        </td>

        {/* Total */}
        <td className="px-4 py-3">
          <div className="font-medium text-foreground">
            {formatCurrency(order.total)}
          </div>
          <div className="text-xs text-muted-foreground">
            {order.itens.length} {order.itens.length === 1 ? "item" : "itens"}
          </div>
        </td>

        {/* Ações */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleView}
              className="h-8 w-8 p-0 hover:bg-blue-500/20 hover:text-blue-600"
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(order)}
              className="h-8 w-8 p-0 hover:bg-orange-500/20 hover:text-orange-600"
            >
              <Edit className="h-4 w-4" />
            </Button>

            {canAdvanceStatus(order.status) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAdvanceStatus}
                className="h-8 w-8 p-0 hover:bg-green-500/20 hover:text-green-600"
                title={`Avançar para ${getStatusText(
                  getNextStatus(order.status)!
                )}`}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}

            {canCancelOrder(order.status) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-600"
                onClick={handleCancelClick}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-600"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>

      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={handleCancelCancel}
        onConfirm={handleCancelConfirm}
        title="Cancelar Pedido"
        description={`Tem certeza que deseja cancelar o pedido ${order.endereco?.numero}? Esta ação não pode ser desfeita.`}
        variant="warning"
        actionType="custom"
        itemInfo={{
          type: "pedido",
          name: `#${order.endereco?.numero}`,
          details: { warning: "Esta ação não pode ser desfeita." },
        }}
        confirmButton={{
          text: "Sim, cancelar pedido",
          variant: "destructive",
        }}
        cancelButton={{
          text: "Voltar",
          variant: "outline",
        }}
        data-testid="cancel-order-modal"
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Excluir Pedido"
        description={`Tem certeza que deseja excluir o pedido ${order.endereco?.numero}? Esta ação não pode ser desfeita e todos os dados do pedido serão perdidos.`}
        variant="danger"
        actionType="delete"
        itemInfo={{
          type: "pedido",
          name: `#${order.endereco?.numero}`,
          details: { warning: "Todos os dados do pedido serão perdidos." },
        }}
        confirmButton={{
          text: "Sim, excluir",
          variant: "destructive",
        }}
        cancelButton={{
          text: "Cancelar",
          variant: "outline",
        }}
        data-testid="delete-order-modal"
      />
    </>
  );
}
