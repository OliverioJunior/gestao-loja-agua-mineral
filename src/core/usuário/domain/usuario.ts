import { TUsuario } from "./usuario.entity";
import { UsuarioValidation } from "./usuario.validation";

type TAction = "create" | "update";

export class User {
  private data: TUsuario;
  private action: TAction | undefined;

  constructor(data: TUsuario, action?: TAction) {
    this.data = data;
    this.action = action;
  }

  validationData() {
    if (this.action === "create")
      return UsuarioValidation.validateCreateInput(this.data).data;
    if (this.action === "update")
      return UsuarioValidation.validateUpdateInput(this.data).data;
    return UsuarioValidation.validateInput(this.data).data;
  }
}
