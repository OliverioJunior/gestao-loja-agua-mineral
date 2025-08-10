import { ValidationError, ConflictError, NotFoundError } from "../error";
type TMessages = {
  id_required: "ID é obrigatório";
  nome_required: "Nome do usuário é obrigatório";
  nome_min_length: "Nome do usuário deve ter pelo menos 2 caracteres";
  email_required: "Email é obrigatório";
  email_invalid: "Email deve ter um formato válido";
  senha_required: "Senha é obrigatória";
  senha_min_length: "Senha deve ter pelo menos 6 caracteres";
  role_required: "Role é obrigatório";
  role_invalid: "Role deve ser ADMIN ou USER";
  usuario_required_to_update: "Pelo menos um campo deve ser fornecido para atualização";
  all_field_required: "Todos os campos obrigatórios devem ser fornecidos";
};
export class UsuarioValidation extends ValidationError {
  constructor(field: string, value: unknown, rule: keyof TMessages) {
    const messages: TMessages = {
      id_required: "ID é obrigatório",
      nome_required: "Nome do usuário é obrigatório",
      nome_min_length: "Nome do usuário deve ter pelo menos 2 caracteres",
      email_required: "Email é obrigatório",
      email_invalid: "Email deve ter um formato válido",
      senha_required: "Senha é obrigatória",
      senha_min_length: "Senha deve ter pelo menos 6 caracteres",
      role_required: "Role é obrigatório",
      role_invalid: "Role deve ser ADMIN ou USER",
      usuario_required_to_update:
        "Pelo menos um campo deve ser fornecido para atualização",
      all_field_required: "Todos os campos obrigatórios devem ser fornecidos",
    };
    const message = messages[rule];
    super(message, field, value);
    this.context = { ...this.context, rule };
  }
}

export class UsuarioNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Usuário`, identifier);
  }
}

export class UsuarioConflictError extends ConflictError {
  constructor(field: string, value: string) {
    super(`Usuário com ${field} '${value}' já existe`, "usuario_conflict", {
      field,
      value,
    });
  }
}
