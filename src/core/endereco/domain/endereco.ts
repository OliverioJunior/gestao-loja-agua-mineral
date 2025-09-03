import {
  TEndereco,
  CreateEnderecoInput,
  UpdateEnderecoInput,
} from "./endereco.entity";
import { EnderecoValidation } from "./endereco.validation";

export class Endereco {
  private constructor(private readonly data: TEndereco) {}

  static create(input: CreateEnderecoInput): CreateEnderecoInput {
    const validatedData = EnderecoValidation.validateCreateInput(input);
    return validatedData;
  }

  static update(input: UpdateEnderecoInput): UpdateEnderecoInput {
    const validatedData = EnderecoValidation.validateUpdateInput(input);
    return validatedData;
  }

  getData(): TEndereco {
    const validatedData = EnderecoValidation.validateInput(this.data);
    return { ...validatedData };
  }
}
