import { TPedidoWithRelations } from "@/core/pedidos/domain";
import {
  getOrderStatusColor,
  getOrderStatusText,
  formatCurrency,
  formatDate,
  formatDateForInput,
  formatPhone,
} from "@/shared/utils";
import { formatDateTime } from "@/shared/utils/formatters";

// Re-exportar funções centralizadas para manter compatibilidade
export const getStatusColor = getOrderStatusColor;
export const getStatusText = getOrderStatusText;

// Re-exportar formatadores centralizados
export { formatCurrency, formatDate, formatDateTime, formatPhone };

// Alias para manter compatibilidade
export const formatDateOnly = formatDateForInput;

export const getDeliveryTypeText = (tipo: null | string) => {
  return tipo === null ? "Portaria" : "Entrega";
};

export const getPaymentMethodText = (
  metodo: TPedidoWithRelations["formaPagamento"]
) => {
  switch (metodo) {
    case "dinheiro":
      return "Dinheiro";
    case "cartao_debito":
      return "Cartão de Débito";
    case "cartao_credito":
      return "Cartão de Crédito";
    case "pix":
      return "PIX";
    default:
      return "Não informado";
  }
};

export const generateOrderNumber = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `PED${year}${month}${day}${random}`;
};

export const calculateOrderTotal = (
  itens: TPedidoWithRelations["itens"],
  desconto = 0,
  taxaEntrega = 0
) => {
  const subtotal = itens.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );
  return subtotal - desconto + taxaEntrega;
};

export const getNextStatus = (
  currentStatus: TPedidoWithRelations["status"]
): TPedidoWithRelations["status"] | null => {
  switch (currentStatus) {
    case "PENDENTE":
      return "CONFIRMADO";
    case "CONFIRMADO":
      return "ENTREGUE";

    default:
      return null;
  }
};

export const canAdvanceStatus = (status: TPedidoWithRelations["status"]) => {
  return ["PENDENTE", "CONFIRMADO", "PREPARANDO"].includes(status);
};

export const canCancelOrder = (status: TPedidoWithRelations["status"]) => {
  return ["PENDENTE", "CONFIRMADO"].includes(status);
};
