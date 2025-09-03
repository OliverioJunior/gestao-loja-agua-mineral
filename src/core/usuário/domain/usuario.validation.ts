import {
  CreateUsuarioInput,
  TUsuario,
  UpdateUsuarioInput,
} from "./usuario.entity";
import { UsuarioValidationError } from "./usuario.errors";

export class UsuarioValidation {
  private static readonly MIN_NAME_LENGTH = 2;
  private static readonly MIN_PASSWORD_LENGTH = 6;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly VALID_ROLES = ["ADMIN", "MANAGER", "USER"];

  static validateInput(data: TUsuario): { data: TUsuario; validate: boolean } {
    this.validateAllField(data);
    this.validateNome(data.name);
    this.validateEmail(data.email);
    this.validateSenha(data.password);
    this.validateRole(data.role);
    return { data, validate: true };
  }

  static validateCreateInput(data: CreateUsuarioInput) {
    this.validateNome(data.name);
    this.validateEmail(data.email);
    this.validateSenha(data.password);
    this.validateRole(data.role);
    this.validateAllField(data);

    return { data, validate: true };
  }

  static validateUpdateInput(data: UpdateUsuarioInput) {
    if (data.name !== undefined) {
      this.validateNome(data.name);
    }

    if (data.email !== undefined) {
      this.validateEmail(data.email);
    }

    if (data.password !== undefined) {
      this.validateSenha(data.password);
    }

    if (data.role !== undefined) {
      this.validateRole(data.role);
    }

    this.validateAtLeastOneField(data);

    return { update: true, data };
  }

  static validateId(id: string) {
    if (!id) {
      throw new UsuarioValidationError("id", id, "id_required");
    }
    return { id, validate: true };
  }

  private static validateNome(nome: string) {
    if (!nome?.trim()) {
      throw new UsuarioValidationError("nome", nome, "nome_required");
    }
    if (nome.trim().length < this.MIN_NAME_LENGTH) {
      throw new UsuarioValidationError("nome", nome, "nome_min_length");
    }
  }

  private static validateEmail(email: string) {
    if (!email?.trim()) {
      throw new UsuarioValidationError("email", email, "email_required");
    }
    if (!this.EMAIL_REGEX.test(email.trim())) {
      throw new UsuarioValidationError("email", email, "email_invalid");
    }
  }

  private static validateSenha(senha: string) {
    if (!senha) {
      throw new UsuarioValidationError("senha", senha, "senha_required");
    }
    if (senha.length < this.MIN_PASSWORD_LENGTH) {
      throw new UsuarioValidationError("senha", senha, "senha_min_length");
    }
  }

  private static validateRole(role: string) {
    if (!role) {
      throw new UsuarioValidationError("role", role, "role_required");
    }
    if (!this.VALID_ROLES.includes(role.toUpperCase())) {
      throw new UsuarioValidationError("role", role, "role_invalid");
    }
  }

  private static validateAtLeastOneField(data: UpdateUsuarioInput) {
    const fields = ["nome", "email", "senha", "role", "ativo"];

    const hasAtLeastOneField = fields.some(
      (field) => data[field as keyof UpdateUsuarioInput] !== undefined
    );

    if (!hasAtLeastOneField) {
      throw new UsuarioValidationError(
        "usuario",
        data,
        "usuario_required_to_update"
      );
    }
  }

  private static validateAllField(data: CreateUsuarioInput) {
    const fields: (keyof CreateUsuarioInput)[] = [
      "name",
      "email",
      "password",
      "role",
    ];

    fields.forEach((field) => {
      if (data[field] === undefined) {
        throw new UsuarioValidationError(
          "usuario",
          data[field],
          "all_field_required"
        );
      }
    });
  }
}
