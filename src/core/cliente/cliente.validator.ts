import {
  CreateClienteInput,
  TCliente,
  UpdateClienteInput,
} from "./cliente.entity";
import { ClienteValidation } from "./cliente.errors";

export class ClienteValidator {
  private static readonly MIN_NAME_LENGTH = 2;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly PHONE_REGEX = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
  private static readonly ZIP_CODE_REGEX = /^\d{5}-?\d{3}$/;

  static validateInput(data: TCliente): { data: TCliente; validate: boolean } {
    this.validateAllField(data);
    this.validateNome(data.nome);
    this.validateEmail(data.email);
    this.validateTelefone(data.telefone);
    this.validateAddress(data.endereco);
    this.validateCity(data.cidade);
    this.validateState(data.estado);
    this.validateCEP(data.cep);
    return { data, validate: true };
  }

  static validateCreateInput(data: CreateClienteInput) {
    this.validateNome(data.nome);
    this.validateEmail(data.email);
    this.validateTelefone(data.telefone);
    this.validateAddress(data.endereco);
    this.validateCity(data.cidade);
    this.validateState(data.estado);
    this.validateCEP(data.cep);
    this.validateAllField(data);

    return { data, validate: true };
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

    if (data.endereco !== undefined) {
      this.validateAddress(data.endereco);
    }

    if (data.cidade !== undefined) {
      this.validateCity(data.cidade);
    }

    if (data.estado !== undefined) {
      this.validateState(data.estado);
    }

    if (data.cep !== undefined) {
      this.validateCEP(data.cep);
    }

    this.validateAtLeastOneField(data);

    return { update: true, data };
  }

  static validateId(id: string) {
    if (!id) {
      throw new ClienteValidation("id", id, "id_required");
    }
    return { id, validate: true };
  }

  private static validateNome(nome: string) {
    if (!nome?.trim()) {
      throw new ClienteValidation("nome", nome, "nome_required");
    }
    if (nome.trim().length < this.MIN_NAME_LENGTH) {
      throw new ClienteValidation("nome", nome, "nome_min_length");
    }
  }

  private static validateEmail(email: string) {
    if (!email?.trim()) {
      throw new ClienteValidation("email", email, "email_required");
    }
    if (!this.EMAIL_REGEX.test(email.trim())) {
      throw new ClienteValidation("email", email, "email_invalid");
    }
  }

  private static validateTelefone(telefone: string) {
    if (!telefone?.trim()) {
      throw new ClienteValidation("telefone", telefone, "telefone_required");
    }
    if (!this.PHONE_REGEX.test(telefone.trim())) {
      throw new ClienteValidation("telefone", telefone, "telefone_invalid");
    }
  }

  private static validateAddress(address: string) {
    if (!address?.trim()) {
      throw new ClienteValidation("address", address, "address_required");
    }
  }

  private static validateCity(city: string) {
    if (!city?.trim()) {
      throw new ClienteValidation("city", city, "city_required");
    }
  }

  private static validateState(state: string) {
    if (!state?.trim()) {
      throw new ClienteValidation("state", state, "state_required");
    }
  }

  private static validateCEP(zipCode: string) {
    if (!zipCode?.trim()) {
      throw new ClienteValidation("zipCode", zipCode, "zipCode_required");
    }
    if (!this.ZIP_CODE_REGEX.test(zipCode.trim())) {
      throw new ClienteValidation("zipCode", zipCode, "zipCode_invalid");
    }
  }

  private static validateAtLeastOneField(data: UpdateClienteInput) {
    const fields = [
      "nome",
      "email",
      "telefone",
      "endereco",
      "cidade",
      "estado",
      "cep",
    ];

    const hasAtLeastOneField = fields.some(
      (field) => data[field as keyof UpdateClienteInput] !== undefined
    );

    if (!hasAtLeastOneField) {
      throw new ClienteValidation(
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
      "endereco",
      "cidade",
      "estado",
      "cep",
    ];

    fields.forEach((field) => {
      if (data[field] === undefined) {
        throw new ClienteValidation(
          "cliente",
          data[field],
          "all_field_required"
        );
      }
    });
  }
}
