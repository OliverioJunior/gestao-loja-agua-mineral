import {
  getGeneralStatusColor,
  getGeneralStatusText,
  formatCurrency,
  formatDate,
  formatPhone,
} from "@/shared/utils";

// Re-exportar funções centralizadas para manter compatibilidade
export const getStatusColor = getGeneralStatusColor;
export const getStatusText = getGeneralStatusText;

// Re-exportar formatadores centralizados
export { formatCurrency, formatDate, formatPhone };

// Manter apenas funções específicas do domínio de clientes aqui
// (nenhuma função específica identificada no momento)
