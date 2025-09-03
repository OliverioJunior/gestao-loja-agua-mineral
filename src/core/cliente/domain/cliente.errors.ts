import { ConflictError, NotFoundError, ValidationError } from "../../error";

export class ClienteValidationError extends ValidationError {
  constructor(field: string, value: unknown, rule: string) {
    const message = ClienteValidationError.getValidationMessage(
      field,
      value,
      rule
    );
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
      nome_required: "Nome do cliente é obrigatório",
      nome_min_length: "Nome do cliente deve ter pelo menos 2 caracteres",
      email_required: "Email é obrigatório",
      email_invalid: "Email deve ter um formato válido",
      telefone_required: "Telefone é obrigatório",
      telefone_invalid: "Telefone deve ter um formato válido",
      address_required: "Endereço é obrigatório",
      city_required: "Cidade é obrigatória",
      state_required: "Estado é obrigatório",
      zipCode_required: "CEP é obrigatório",
      zipCode_invalid: "CEP deve ter um formato válido",
      cliente_required_to_update:
        "Pelo menos um campo deve ser fornecido para atualização",
      all_field_required: "Todos os campos obrigatórios devem ser fornecidos",
    };

    return messages[code] || `Erro de validação no campo ${field}`;
  }
}

export class ClienteNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super("Cliente", identifier);
  }
}

export class ClienteConflictError extends ConflictError {
  constructor(field: string, value: string) {
    super(`Cliente com ${field} '${value}' já existe`, "cliente_conflict", {
      field,
      value,
    });
  }
}
