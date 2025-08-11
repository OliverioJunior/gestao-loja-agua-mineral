import { TUsuario } from "./usuario.entity";
import { UsuarioValidator } from "./usuario.validator";

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
      return UsuarioValidator.validateCreateInput(this.data).data;
    if (this.action === "update")
      return UsuarioValidator.validateUpdateInput(this.data).data;
    return UsuarioValidator.validateInput(this.data).data;
  }
}
