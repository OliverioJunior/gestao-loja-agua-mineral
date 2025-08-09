import { useState } from "react";
import {
  Button,
  Badge,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui";
import { Eye, Edit, Trash2, ArrowRight, X, Phone, MapPin } from "lucide-react";
import { OrderRowProps } from "./types";
import {
  getStatusColor,
  getStatusText,
  getDeliveryTypeText,
  getPaymentMethodText,
  formatCurrency,
  formatDate,
  formatPhone,
  canAdvanceStatus,
  canCancelOrder,
  getNextStatus,
} from "./order-utils";
import { OrderDetailsModal } from "./OrderDetailsModal";

export function OrderRow({
  order,
  onView,
  onEdit,
  onDelete,
  onAdvanceStatus,
  onCancelOrder,
}: OrderRowProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleView = () => {
    onView(order);
  };

  const handleAdvanceStatus = () => {
    const nextStatus = getNextStatus(order.status);
    if (nextStatus && onAdvanceStatus) {
      onAdvanceStatus(order.id, nextStatus);
    }
  };

  const handleCancelOrder = () => {
    if (onCancelOrder) {
      onCancelOrder(order.id);
    }
  };

  return (
    <>
      <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
        {/* Número do Pedido */}
        <td className="px-4 py-3">
          <div className="font-medium text-foreground">{order.numero}</div>
          <div className="text-xs text-muted-foreground">
            {formatDate(order.dataPedido)}
          </div>
        </td>

        {/* Cliente */}
        <td className="px-4 py-3">
          <div className="font-medium text-foreground">
            {order.cliente.nome}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Phone className="h-3 w-3" />
            {formatPhone(order.cliente.telefone)}
          </div>
        </td>

        {/* Tipo de Entrega */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${
                order.tipoEntrega === "entrega"
                  ? "bg-blue-500/20 text-blue-600 border-blue-500/30"
                  : "bg-gray-500/20 text-gray-600 border-gray-500/30"
              }`}
            >
              {getDeliveryTypeText(order.tipoEntrega)}
            </Badge>
          </div>
          {order.tipoEntrega === "entrega" && order.enderecoEntrega && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              {order.enderecoEntrega.cidade}
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancelar Pedido</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja cancelar o pedido {order.numero}?
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelOrder}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Sim, cancelar pedido
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Pedido</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o pedido {order.numero}? Esta
                    ação não pode ser desfeita e todos os dados do pedido serão
                    perdidos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(order.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Sim, excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </td>
      </tr>

      <OrderDetailsModal
        order={order}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={onEdit}
      />
    </>
  );
}
