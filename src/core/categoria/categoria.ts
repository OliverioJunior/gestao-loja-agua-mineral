import { TCategoria } from "./categoria.entity";
import { CategoriaValidator } from "./categoria.validator";

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
      CategoriaValidator.validateCreateInput(this.data);
    if (this.action === "update")
      CategoriaValidator.validateUpdateInput(this.data);
    return CategoriaValidator.validateInput(this.data).data;
  }
}