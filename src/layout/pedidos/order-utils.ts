import { IPedido } from "./types";

export const getStatusColor = (status: IPedido["status"]) => {
  switch (status) {
    case "pendente":
      return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
    case "confirmado":
      return "bg-blue-500/20 text-blue-600 border-blue-500/30";
    case "preparando":
      return "bg-orange-500/20 text-orange-600 border-orange-500/30";
    case "entregue":
      return "bg-green-500/20 text-green-600 border-green-500/30";
    case "cancelado":
      return "bg-red-500/20 text-red-600 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-600 border-gray-500/30";
  }
};

export const getStatusText = (status: IPedido["status"]) => {
  switch (status) {
    case "pendente":
      return "Pendente";
    case "confirmado":
      return "Confirmado";
    case "preparando":
      return "Preparando";
    case "entregue":
      return "Entregue";
    case "cancelado":
      return "Cancelado";
    default:
      return "Indefinido";
  }
};

export const getDeliveryTypeText = (tipo: "balcao" | "entrega") => {
  return tipo === "balcao" ? "Balcão" : "Entrega";
};

export const getPaymentMethodText = (metodo: IPedido["formaPagamento"]) => {
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

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100); // Assumindo que os valores estão em centavos
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatDateOnly = (date: Date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phone;
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
  itens: IPedido["itens"],
  desconto = 0,
  taxaEntrega = 0
) => {
  const subtotal = itens.reduce(
    (acc, item) => acc + item.precoUnitario * item.quantidade,
    0
  );
  return subtotal - desconto + taxaEntrega;
};

export const getNextStatus = (
  currentStatus: IPedido["status"]
): IPedido["status"] | null => {
  switch (currentStatus) {
    case "pendente":
      return "confirmado";
    case "confirmado":
      return "preparando";
    case "preparando":
      return "entregue";
    default:
      return null;
  }
};

export const canAdvanceStatus = (status: IPedido["status"]) => {
  return ["pendente", "confirmado", "preparando"].includes(status);
};

export const canCancelOrder = (status: IPedido["status"]) => {
  return ["pendente", "confirmado"].includes(status);
};
