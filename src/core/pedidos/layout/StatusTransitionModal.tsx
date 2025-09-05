import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  Alert,
  AlertDescription,
  Textarea,
  Badge,
} from "@/shared/components/ui";
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  AlertTriangle,
  Info,
  MessageSquare,
} from "lucide-react";
import { StatusTransitionModalProps } from "./types";
import { StatusPedido } from "@/core/pedidos/domain";
// Mapeamento de status para ícones, cores e descrições
const statusConfig = {
  PENDENTE: {
    icon: Clock,
    color: "text-amber-600",
    bgColor: " bg-gray-600",
    borderColor: " bg-gray-900",
    label: "Pendente",
    description: "Aguardando confirmação",
  },
  CONFIRMADO: {
    icon: CheckCircle,
    color: "text-blue-600",
    bgColor: " bg-gray-600",
    borderColor: " bg-gray-900",
    label: "Confirmado",
    description: "Pedido confirmado e aguardando preparação",
  },
  ENTREGUE: {
    icon: Truck,
    color: "text-green-600",
    bgColor: " bg-gray-600",
    borderColor: " bg-gray-900",
    label: "Entregue",
    description: "Pedido finalizado com sucesso",
  },
  CANCELADO: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: " bg-gray-600",
    borderColor: " bg-gray-900",
    label: "Cancelado",
    description: "Pedido cancelado",
  },
};

// Transições válidas para cada status
const validTransitions: Record<StatusPedido, StatusPedido[]> = {
  PENDENTE: ["CONFIRMADO", "CANCELADO"],
  CONFIRMADO: ["ENTREGUE", "CANCELADO"],
  ENTREGUE: [],
  CANCELADO: [],
};

// Mensagens e impactos para cada transição
const transitionInfo: Record<
  string,
  { message: string; impact: string; type: "info" | "warning" | "success" }
> = {
  "PENDENTE->CONFIRMADO": {
    message: "O pedido será confirmado e entrará na fila de preparação",
    impact: "Cliente será notificado por email/SMS",
    type: "success",
  },
  "PENDENTE->CANCELADO": {
    message: "O pedido será cancelado permanentemente",
    impact: "Ação irreversível - Cliente será notificado",
    type: "warning",
  },
  "CONFIRMADO->ENTREGUE": {
    message: "O pedido será marcado como entregue",
    impact: "Status será atualizado em tempo real",
    type: "info",
  },
  "CONFIRMADO->CANCELADO": {
    message: "O pedido confirmado será cancelado",
    impact: "Ação irreversível - Possível reembolso necessário",
    type: "warning",
  },
};

export function StatusTransitionModal({
  isOpen,
  onClose,
  onConfirm,
  order,
}: StatusTransitionModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<StatusPedido | "">("");
  const [observacoes, setObservacoes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!order) return null;

  const currentStatus = order.status;
  const availableTransitions = validTransitions[currentStatus] || [];
  const CurrentIcon = statusConfig[currentStatus].icon;
  const SelectedIcon = selectedStatus
    ? statusConfig[selectedStatus as StatusPedido].icon
    : null;

  const handleConfirm = async () => {
    if (!selectedStatus) return;

    setIsLoading(true);
    try {
      await onConfirm(order.id, selectedStatus as StatusPedido, observacoes);
      handleClose();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus("");
    setObservacoes("");
    setIsLoading(false);
    onClose();
  };

  const transitionKey = selectedStatus
    ? `${currentStatus}->${selectedStatus}`
    : "";
  const transitionData = transitionInfo[transitionKey];

  // Se não há transições disponíveis
  if (availableTransitions.length === 0) {
    const isCompleted = currentStatus === "ENTREGUE";

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-white">
              <CurrentIcon
                className={`h-5 w-5 ${statusConfig[currentStatus].color}`}
              />
              Status do Pedido
              <Badge
                variant={isCompleted ? "default" : "secondary"}
                className="ml-2 bg-gray-800 text-gray-200"
              >
                #{order.id.slice(-8)}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {" "}
              {statusConfig[currentStatus].description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Card
              className={`${statusConfig[currentStatus].bgColor} ${statusConfig[currentStatus].borderColor} border-2`}
            >
              <CardContent className="pt-3 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full bg-gray-800/50 border ${statusConfig[currentStatus].borderColor}`}
                  >
                    <CurrentIcon
                      className={`h-5 w-5 ${statusConfig[currentStatus].color}`}
                    />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-semibold text-base ${statusConfig[currentStatus].color}`}
                    >
                      {statusConfig[currentStatus].label}
                    </p>
                    <p className="text-sm text-gray-300">
                      {statusConfig[currentStatus].description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-blue-950/50 border-blue-800">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-gray-200">
                {isCompleted
                  ? "Este pedido foi finalizado com sucesso e não pode ser alterado."
                  : "Este pedido foi cancelado e não pode ser alterado."}
              </AlertDescription>
            </Alert>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="px-6 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl bg-gray-900 border-gray-700">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-white">
            <CurrentIcon
              className={`h-5 w-5 ${statusConfig[currentStatus].color}`}
            />
            Alterar Status do Pedido
            <Badge
              variant="outline"
              className="ml-2 font-mono border-gray-600 text-gray-300"
            >
              #{order.id.slice(-8)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Atual - Tema Escuro */}
          <div>
            <Label className="text-sm font-medium text-gray-300 mb-2 block">
              Status Atual
            </Label>
            <Card
              className={`${statusConfig[currentStatus].bgColor} ${statusConfig[currentStatus].borderColor} border-2`}
            >
              <CardContent className="py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-full bg-gray-800/60 border ${statusConfig[currentStatus].borderColor}`}
                  >
                    <CurrentIcon
                      className={`h-5 w-5 ${statusConfig[currentStatus].color}`}
                    />
                  </div>
                  <div>
                    <p
                      className={`font-semibold text-base ${statusConfig[currentStatus].color}`}
                    >
                      {statusConfig[currentStatus].label}
                    </p>
                    <p className="text-sm text-gray-300">
                      {statusConfig[currentStatus].description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seleção de Novo Status */}
          <div className="space-y-2">
            <Label
              htmlFor="newStatus"
              className="text-sm font-medium text-gray-300"
            >
              Selecionar Novo Status <span className="text-red-400">*</span>
            </Label>
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as StatusPedido)
              }
            >
              <SelectTrigger className="h-11 bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-750">
                <SelectValue placeholder="Escolha o próximo status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {availableTransitions.map((status) => {
                  const StatusIcon = statusConfig[status].icon;
                  return (
                    <SelectItem
                      key={status}
                      value={status}
                      className="h-11 hover:bg-gray-700 text-gray-200"
                    >
                      <div className="flex items-center gap-3 py-1">
                        <StatusIcon
                          className={`h-4 w-4 ${statusConfig[status].color}`}
                        />
                        <div>
                          <p className="font-medium text-gray-200">
                            {statusConfig[status].label}
                          </p>
                          <p className="text-xs text-gray-400">
                            {statusConfig[status].description}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Visualização da Transição */}
          {selectedStatus && (
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <Label className="text-sm font-medium text-gray-300 mb-2 block">
                Prévia da Alteração
              </Label>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-full ${statusConfig[currentStatus].bgColor} border ${statusConfig[currentStatus].borderColor}`}
                  >
                    <CurrentIcon
                      className={`h-4 w-4 ${statusConfig[currentStatus].color}`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-200">
                      {statusConfig[currentStatus].label}
                    </p>
                    <p className="text-xs text-gray-400">Atual</p>
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 text-gray-500 mx-3" />

                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-full ${
                      statusConfig[selectedStatus as StatusPedido].bgColor
                    } border ${
                      statusConfig[selectedStatus as StatusPedido].borderColor
                    }`}
                  >
                    {SelectedIcon && (
                      <SelectedIcon
                        className={`h-4 w-4 ${
                          statusConfig[selectedStatus as StatusPedido].color
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-200">
                      {statusConfig[selectedStatus as StatusPedido].label}
                    </p>
                    <p className="text-xs text-gray-400">Novo</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informações da Transição */}
          {transitionData && (
            <Alert
              className={`border-l-4 ${
                transitionData.type === "warning"
                  ? "border-amber-500 bg-amber-950/30"
                  : ""
              } ${
                transitionData.type === "success"
                  ? "border-green-500 bg-green-950/30"
                  : ""
              } ${
                transitionData.type === "info"
                  ? "border-blue-500 bg-blue-950/30"
                  : ""
              }`}
            >
              <AlertTriangle
                className={`h-4 w-4 ${
                  transitionData.type === "warning"
                    ? "text-amber-400"
                    : transitionData.type === "success"
                    ? "text-green-400"
                    : "text-blue-400"
                }`}
              />
              <AlertDescription className="text-gray-200">
                <div className="space-y-1">
                  <p className="font-medium">{transitionData.message}</p>
                  <p className="text-sm text-gray-400">
                    {transitionData.impact}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Campo de Observações */}
          {selectedStatus && (
            <div className="space-y-2">
              <Label
                htmlFor="observacoes"
                className="flex items-center gap-2 text-gray-300"
              >
                <MessageSquare className="h-4 w-4" />
                Observações
                {selectedStatus === "CANCELADO" && (
                  <span className="text-red-400 font-medium">*</span>
                )}
              </Label>
              <Textarea
                id="observacoes"
                placeholder={
                  selectedStatus === "CANCELADO"
                    ? "Informe o motivo do cancelamento (obrigatório)"
                    : "Adicione observações sobre esta alteração (opcional)"
                }
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className={`min-h-[70px] bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500 ${
                  selectedStatus === "CANCELADO"
                    ? "border-red-500 focus:border-red-400"
                    : ""
                }`}
                required={selectedStatus === "CANCELADO"}
              />
              {selectedStatus === "CANCELADO" && !observacoes.trim() && (
                <p className="text-sm text-red-400">
                  Este campo é obrigatório para cancelamentos
                </p>
              )}
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex justify-between pt-3 border-t border-gray-700">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={
                !selectedStatus ||
                isLoading ||
                (selectedStatus === "CANCELADO" && !observacoes.trim())
              }
              className={`min-w-[140px] font-medium ${
                selectedStatus === "CANCELADO"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Alterando...
                </div>
              ) : (
                "Confirmar Alteração"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
