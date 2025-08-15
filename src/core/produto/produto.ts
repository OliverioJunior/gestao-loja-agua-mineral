import { TProduto } from "./produto.entity";
import { ProdutoValidator } from "./produto.validator";

type TAction = "create" | "update";

export class Product {
  private data: TProduto;
  private action: TAction | undefined;
  constructor(data: TProduto, action?: TAction) {
    this.data = data;
    this.action = action;
  }
  validationData() {
    if (this.action === "create")
      return ProdutoValidator.validateCreateInput(this.data).data;

    if (this.action === "update")
      return ProdutoValidator.validateUpdateInput(this.data).data;
    return ProdutoValidator.validateInput(this.data).data;
  }
}
