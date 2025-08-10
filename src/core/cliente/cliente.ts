import { TCliente } from "./cliente.entity";
import { ClienteValidator } from "./cliente.validator";

type TAction = "create" | "update";

export class Client {
  private data: TCliente;
  private action: TAction | undefined;
  
  constructor(data: TCliente, action?: TAction) {
    this.data = data;
    this.action = action;
  }
  
  validationData() {
    if (this.action === "create")
      ClienteValidator.validateCreateInput(this.data);
    if (this.action === "update")
      ClienteValidator.validateUpdateInput(this.data);
    return ClienteValidator.validateInput(this.data).data;
  }
}