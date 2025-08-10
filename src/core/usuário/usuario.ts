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
      UsuarioValidator.validateCreateInput(this.data);
    if (this.action === "update")
      UsuarioValidator.validateUpdateInput(this.data);
    return UsuarioValidator.validateInput(this.data).data;
  }
}