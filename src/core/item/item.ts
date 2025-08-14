import { TItem } from "./item.entity";
import { ItemValidator } from "./item.validator";

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
      ItemValidator.validateCreateInput(this.data);
    }
    if (this.action === "update") {
      ItemValidator.validateUpdateInput(this.data);
    }
    return ItemValidator.validateInput(this.data).data;
  }

  calculateSubtotal(): number {
    return this.data.preco * this.data.quantidade;
  }

  getData(): TItem {
    return this.data;
  }

  updateQuantidade(novaQuantidade: number): void {
    ItemValidator.validateUpdateInput({ quantidade: novaQuantidade });
    this.data.quantidade = novaQuantidade;
  }

  updatePreco(novoPreco: number): void {
    ItemValidator.validateUpdateInput({ preco: novoPreco });
    this.data.preco = novoPreco;
  }
}