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
      ProdutoValidator.validateCreateInput(this.data);
    if (this.action === "update")
      ProdutoValidator.validateUpdateInput(this.data);
    return ProdutoValidator.validateInput(this.data).data;
  }
}
