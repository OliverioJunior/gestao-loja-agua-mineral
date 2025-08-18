import {
  TEndereco,
  CreateEnderecoInput,
  UpdateEnderecoInput,
} from "./endereco.entity";
import { EnderecoValidator } from "./endereco.validator";

export class Endereco {
  private constructor(private readonly data: TEndereco) {}

  static create(input: CreateEnderecoInput): CreateEnderecoInput {
    const validatedData = EnderecoValidator.validateCreateInput(input);
    return validatedData;
  }

  static update(input: UpdateEnderecoInput): UpdateEnderecoInput {
    const validatedData = EnderecoValidator.validateUpdateInput(input);
    return validatedData;
  }

  getData(): TEndereco {
    const validatedData = EnderecoValidator.validateInput(this.data);
    return { ...validatedData };
  }
}
