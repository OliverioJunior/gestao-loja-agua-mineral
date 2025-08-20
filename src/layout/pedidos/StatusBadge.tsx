import { CheckCircle, XCircle, Clock, Package, Truck } from "lucide-react";
import { IPedido } from "./types";

interface StatusBadgeProps {
  status: IPedido["status"];
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

// Configuração de cores e ícones para cada status
const statusConfig = {
  PENDENTE: {
    icon: Clock,
    label: "Pendente",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    iconColor: "text-yellow-600",
  },
  CONFIRMADO: {
    icon: CheckCircle,
    label: "Confirmado",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    iconColor: "text-blue-600",
  },
  PREPARANDO: {
    icon: Package,
    label: "Preparando",
    className: "bg-orange-100 text-orange-800 border-orange-200",
    iconColor: "text-orange-600",
  },
  ENTREGUE: {
    icon: Truck,
    label: "Entregue",
    className: "bg-green-100 text-green-800 border-green-200",
    iconColor: "text-green-600",
  },
  CANCELADO: {
    icon: XCircle,
    label: "Cancelado",
    className: "bg-red-100 text-red-800 border-red-200",
    iconColor: "text-red-600",
  },
};

// Tamanhos do badge
const sizeConfig = {
  sm: {
    container: "px-2 py-1 text-xs",
    icon: "h-3 w-3",
  },
  md: {
    container: "px-3 py-1 text-sm",
    icon: "h-4 w-4",
  },
  lg: {
    container: "px-4 py-2 text-base",
    icon: "h-5 w-5",
  },
};

export function StatusBadge({
  status,
  size = "md",
  showIcon = true,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = sizeConfig[size];
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${config.className}
        ${sizeClasses.container}
      `}
    >
      {showIcon && (
        <Icon className={`${sizeClasses.icon} ${config.iconColor}`} />
      )}
      {config.label}
    </span>
  );
}

// Componente para mostrar a progressão do status
interface StatusProgressProps {
  currentStatus: IPedido["status"];
  size?: "sm" | "md";
}

const statusOrder: IPedido["status"][] = ["PENDENTE", "CONFIRMADO", "ENTREGUE"];

export function StatusProgress({
  currentStatus,
  size = "sm",
}: StatusProgressProps) {
  // Se o pedido foi cancelado, não mostra a progressão
  if (currentStatus === "CANCELADO") {
    return <StatusBadge status="CANCELADO" size={size} />;
  }

  const currentIndex = statusOrder.indexOf(currentStatus);
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const containerSize = size === "sm" ? "w-6 h-6" : "w-8 h-8";

  return (
    <div className="flex items-center gap-2">
      {statusOrder.map((status, index) => {
        const config = statusConfig[status];
        const Icon = config.icon;
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={status} className="flex items-center gap-2">
            <div
              className={`
                flex items-center justify-center rounded-full border-2
                ${containerSize}
                ${
                  isActive
                    ? `${config.className} border-current`
                    : "bg-gray-100 text-gray-400 border-gray-300"
                }
                ${isCurrent ? "ring-2 ring-offset-1 ring-current" : ""}
              `}
            >
              <Icon className={iconSize} />
            </div>

            {/* Linha conectora */}
            {index < statusOrder.length - 1 && (
              <div
                className={`
                  h-0.5 w-8
                  ${index < currentIndex ? "bg-green-400" : "bg-gray-300"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Hook para obter informações do status
export function useStatusInfo(status: IPedido["status"]) {
  const config = statusConfig[status];

  return {
    ...config,
    canAdvance: status !== "ENTREGUE" && status !== "CANCELADO",
    canCancel: status !== "ENTREGUE" && status !== "CANCELADO",
    isFinished: status === "ENTREGUE" || status === "CANCELADO",
  };
}
