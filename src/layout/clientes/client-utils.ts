import { Status } from "@/infrastructure/generated/prisma";

export function getStatusColor(status: Status): string {
  switch (status) {
    case Status.ATIVO:
      return "text-green-600 bg-green-50";
    case Status.INATIVO:
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

export function getStatusText(status: Status): string {
  switch (status) {
    case Status.ATIVO:
      return "Ativo";
    case Status.INATIVO:
      return "Inativo";
    default:
      return "Desconhecido";
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: string): string {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateObj);
}

export function formatPhone(phone: string): string {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, "");

  // Aplica a máscara (XX) XXXXX-XXXX
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
      7
    )}`;
  }

  // Aplica a máscara (XX) XXXX-XXXX para números com 10 dígitos
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
      6
    )}`;
  }

  return phone;
}
