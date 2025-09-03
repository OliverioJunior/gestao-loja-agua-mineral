import { TItem } from "./item.entity";
import { ItemValidation } from "./item.validation";

type TAction = "create" | "update";

export class Item {
  private data: TItem;
  private action: TAction | undefined;

  constructor(data: TItem, action?: TAction) {
    this.data = data;
    this.action = action;
  }

  validationData() {
    if (this.action === "create") {
      ItemValidation.validateCreateInput(this.data);
    }
    if (this.action === "update") {
      ItemValidation.validateUpdateInput(this.data);
    }
    return ItemValidation.validateInput(this.data).data;
  }

  calculateSubtotal(): number {
    return this.data.preco * this.data.quantidade;
  }

  getData(): TItem {
    return this.data;
  }

  updateQuantidade(novaQuantidade: number): void {
    ItemValidation.validateUpdateInput({ quantidade: novaQuantidade });
    this.data.quantidade = novaQuantidade;
  }

  updatePreco(novoPreco: number): void {
    ItemValidation.validateUpdateInput({ preco: novoPreco });
    this.data.preco = novoPreco;
  }
}
