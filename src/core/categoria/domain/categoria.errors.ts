import { ConflictError, NotFoundError, ValidationError } from "../../error";

type TMessages = {
  id_required: "ID é obrigatório";
  nome_required: "Nome da categoria é obrigatório";
  nome_min_length: "Nome da categoria deve ter pelo menos 2 caracteres";
  categoria_required_to_update: "Pelo menos um campo deve ser fornecido para atualização";
  all_field_required: "Todos os campos obrigatórios devem ser fornecidos";
  field_not_allowed: "Campo não permitido";
};

export class CategoriaValidationError extends ValidationError {
  constructor(field: string, value: unknown, rule: keyof TMessages) {
    const messages: TMessages = {
      id_required: "ID é obrigatório",
      nome_required: "Nome da categoria é obrigatório",
      nome_min_length: "Nome da categoria deve ter pelo menos 2 caracteres",
      categoria_required_to_update:
        "Pelo menos um campo deve ser fornecido para atualização",
      all_field_required: "Todos os campos obrigatórios devem ser fornecidos",
      field_not_allowed: "Campo não permitido",
    };

    const message = messages[rule as keyof typeof messages];
    super(message, field, value);
    this.context = { ...this.context, rule };
  }
}

export class CategoriaNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Categoria não encontrada: ${identifier}`);
  }
}

export class CategoriaConflictError extends ConflictError {
  constructor(field: string, value: string) {
    super(`Categoria com ${field} '${value}' já existe`, "categoria_conflict", {
      field,
      value,
    });
  }
}
