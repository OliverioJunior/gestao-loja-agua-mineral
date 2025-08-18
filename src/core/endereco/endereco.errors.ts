import { ConflictError, NotFoundError, ValidationError } from "../error";

export class EnderecoValidation extends ValidationError {
  constructor(field: string, value: unknown, rule: string) {
    const message = EnderecoValidation.getValidationMessage(field, value, rule);
    super(message, field, value);
    this.context = { ...this.context, rule };
  }

  private static getValidationMessage(
    field: string,
    value: unknown,
    code: string
  ): string {
    const messages: Record<string, string> = {
      id_required: "ID é obrigatório",
      clienteId_required: "ID do cliente é obrigatório",
      logradouro_min_length: "Logradouro deve ter pelo menos 2 caracteres",
      numero_min_length: "Número deve ter pelo menos 2 caracteres",
      bairro_min_length: "Bairro deve ter pelo menos 2 caracteres",
      cidade_min_length: "Cidade deve ter pelo menos 2 caracteres",
      estado_min_length: "Estado deve ter pelo menos 2 caracteres",
      cep: "CEP deve ter 8 dígitos",
      tipo: "Tipo deve ser RESIDENCIAL ou COMERCIAL",
      principal: "Principal deve ser true ou false",
      all_field_required_to_create:
        "Todos os campos são obrigatórios para criação",
    };

    return messages[code] || `Erro de validação no campo ${field}`;
  }
}

export class EnderecoNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super("Endereço", identifier);
  }
}

export class EnderecoConflictError extends ConflictError {
  constructor(field: string, value: string) {
    super(`Endereço com ${field} '${value}' já existe`, "endereco_conflict", {
      field,
      value,
    });
  }
}
