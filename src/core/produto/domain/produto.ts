import {
  CreateProdutoInput,
  TProduto,
  UpdateProdutoInput,
} from "./produto.entity";
import { ProdutoValidation } from "./produto.validation";

type TAction = "create" | "update";

export class Product {
  private data: TProduto;
  private action: TAction | undefined;

  constructor(data: TProduto, action?: TAction) {
    this.data = data;
    this.action = action;
  }

  validationData(): CreateProdutoInput;
  validationData(): UpdateProdutoInput;
  validationData(): TProduto;
  validationData(): CreateProdutoInput | UpdateProdutoInput | TProduto {
    if (this.action === "create") {
      return ProdutoValidation.validateCreateInput(this.data).data;
    }

    if (this.action === "update") {
      return ProdutoValidation.validateUpdateInput(this.data).data;
    }

    return ProdutoValidation.validateInput(this.data).data;
  }
}
