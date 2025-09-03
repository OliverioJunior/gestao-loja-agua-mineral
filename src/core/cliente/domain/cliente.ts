import {
  CreateClienteInput,
  TCliente,
  UpdateClienteInput,
} from "./cliente.entity";
import { ClienteValidation } from "./cliente.validation";

export class Client {
  constructor(private readonly data: TCliente) {}
  static create(input: CreateClienteInput) {
    return ClienteValidation.validateCreateInput(input);
  }
  static update(input: UpdateClienteInput) {
    return ClienteValidation.validateUpdateInput(input);
  }

  getData(): TCliente {
    const validatedData = ClienteValidation.validateInput(this.data);
    return { ...validatedData };
  }
}
