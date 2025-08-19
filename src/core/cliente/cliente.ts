import {
  CreateClienteInput,
  TCliente,
  UpdateClienteInput,
} from "./cliente.entity";
import { ClienteValidator } from "./cliente.validator";

export class Client {
  constructor(private readonly data: TCliente) {}
  static create(input: CreateClienteInput) {
    return ClienteValidator.validateCreateInput(input);
  }
  static update(input: UpdateClienteInput) {
    return ClienteValidator.validateUpdateInput(input);
  }

  getData(): TCliente {
    const validatedData = ClienteValidator.validateInput(this.data);
    return { ...validatedData };
  }
}
