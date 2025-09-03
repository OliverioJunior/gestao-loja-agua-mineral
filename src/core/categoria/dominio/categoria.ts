import { TCategoria } from "./categoria.entity";
import { CategoriaValidation } from "./categoria.validation";

type TAction = "create" | "update";

export class Category {
  private data: TCategoria;
  private action: TAction | undefined;

  constructor(data: TCategoria, action?: TAction) {
    this.data = data;
    this.action = action;
  }

  validationData() {
    if (this.action === "create")
      CategoriaValidation.validateCreateInput(this.data);
    if (this.action === "update")
      CategoriaValidation.validateUpdateInput(this.data);
    return CategoriaValidation.validateInput(this.data).data;
  }
}
