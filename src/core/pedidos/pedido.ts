import { TPedido, StatusPedido } from "./pedido.entity";
import { PedidoValidator } from "./pedido.validator";

type TAction = "create" | "update";

export class Pedido {
  private data: TPedido;
  private action: TAction | undefined;
  
  constructor(data: TPedido, action?: TAction) {
    this.data = data;
    this.action = action;
  }

  validationData() {
    if (this.action === "create") {
      PedidoValidator.validateCreateInput(this.data);
    }
    if (this.action === "update") {
      PedidoValidator.validateUpdateInput(this.data);
    }
    return PedidoValidator.validateInput(this.data).data;
  }

  getData(): TPedido {
    return this.data;
  }

  updateStatus(novoStatus: StatusPedido): void {
    PedidoValidator.validateStatusTransition(this.data.status, novoStatus);
    this.data.status = novoStatus;
  }

  updateTotal(novoTotal: number): void {
    PedidoValidator.validateUpdateInput({ total: novoTotal });
    this.data.total = novoTotal;
  }

  isPendente(): boolean {
    return this.data.status === "PENDENTE";
  }

  isEntregue(): boolean {
    return this.data.status === "ENTREGUE";
  }

  isCancelado(): boolean {
    return this.data.status === "CANCELADO";
  }

  canBeModified(): boolean {
    return this.isPendente();
  }

  canBeDeleted(): boolean {
    return this.data.status !== "ENTREGUE";
  }

  getStatusText(): string {
    switch (this.data.status) {
      case "PENDENTE":
        return "Pendente";
      case "ENTREGUE":
        return "Entregue";
      case "CANCELADO":
        return "Cancelado";
      default:
        return "Desconhecido";
    }
  }

  getFormattedTotal(): string {
    return (this.data.total / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  getFormattedDate(): string {
    return this.data.data.toLocaleDateString("pt-BR");
  }
}