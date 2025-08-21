import {
  TPedido,
  StatusPedido,
  CreatePedidoInput,
  UpdatePedidoInput,
} from "./pedido.entity";
import { PedidoValidator } from "./pedido.validator";

export class Pedido {
  private data: TPedido;

  constructor(data: TPedido) {
    this.data = data;
  }

  static create(data: CreatePedidoInput) {
    return PedidoValidator.validateCreateInput(data);
  }

  static update(data: UpdatePedidoInput) {
    PedidoValidator.validateUpdateInput(data);
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
}
