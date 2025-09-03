import {
  CreateClienteInput,
  TCliente,
  UpdateClienteInput,
} from "./cliente.entity";
import { ClienteValidationError } from "./cliente.errors";

export class ClienteValidation {
  private static readonly MIN_NAME_LENGTH = 2;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly PHONE_REGEX = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;

  static validateInput(data: TCliente) {
    this.validateAllField(data);
    this.validateNome(data.nome);
    this.validateEmail(data.email);
    this.validateTelefone(data.telefone);
    return data;
  }

  static validateCreateInput(data: CreateClienteInput) {
    this.validateNome(data.nome);
    this.validateEmail(data.email);
    this.validateTelefone(data.telefone);
    this.validateAllField(data);
    return data;
  }

  static validateUpdateInput(data: UpdateClienteInput) {
    if (data.nome !== undefined) {
      this.validateNome(data.nome);
    }

    if (data.email !== undefined) {
      this.validateEmail(data.email);
    }

    if (data.telefone !== undefined) {
      this.validateTelefone(data.telefone);
    }

    this.validateAtLeastOneField(data);

    return data;
  }

  static validateId(id: string) {
    if (!id) {
      throw new ClienteValidationError("id", id, "id_required");
    }
    return { id, validate: true };
  }

  private static validateNome(nome: string) {
    if (!nome?.trim()) {
      throw new ClienteValidationError("nome", nome, "nome_required");
    }
    if (nome.trim().length < this.MIN_NAME_LENGTH) {
      throw new ClienteValidationError("nome", nome, "nome_min_length");
    }
  }

  private static validateEmail(email: string) {
    if (!email?.trim()) {
      throw new ClienteValidationError("email", email, "email_required");
    }
    if (!this.EMAIL_REGEX.test(email.trim())) {
      throw new ClienteValidationError("email", email, "email_invalid");
    }
  }

  private static validateTelefone(telefone: string) {
    if (!telefone?.trim()) {
      throw new ClienteValidationError(
        "telefone",
        telefone,
        "telefone_required"
      );
    }
    if (!this.PHONE_REGEX.test(telefone.trim())) {
      throw new ClienteValidationError(
        "telefone",
        telefone,
        "telefone_invalid"
      );
    }
  }

  private static validateAtLeastOneField(data: UpdateClienteInput) {
    const fields = [
      "nome",
      "email",
      "telefone",
      "aniversario",
      "status",
      "atualizadoPorId",
    ];

    const hasAtLeastOneField = fields.some(
      (field) => data[field as keyof UpdateClienteInput] !== undefined
    );

    if (!hasAtLeastOneField) {
      throw new ClienteValidationError(
        "cliente",
        data,
        "cliente_required_to_update"
      );
    }
  }

  private static validateAllField(data: CreateClienteInput) {
    const fields: (keyof CreateClienteInput)[] = [
      "nome",
      "email",
      "telefone",
      "criadoPorId",
    ];

    fields.forEach((field) => {
      if (data[field] === undefined) {
        throw new ClienteValidationError(
          "cliente",
          data[field],
          "all_field_required"
        );
      }
    });
  }
}
