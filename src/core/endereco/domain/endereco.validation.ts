import {
  CreateEnderecoInput,
  TEndereco,
  UpdateEnderecoInput,
} from "./endereco.entity";
import { EnderecoValidationError } from "./endereco.errors";

export class EnderecoValidation {
  private static readonly MIN_NAME_LENGTH = 2;
  private static readonly ZIP_CODE_REGEX = /^\d{5}-?\d{3}$/;

  static validateInput(data: TEndereco) {
    this.validateAllField(data);
    this.validateClienteId(data.clienteId);
    this.validateLogradouro(data.logradouro);
    this.validateNumero(data.numero);
    this.validateComplemento(data.complemento);
    this.validateBairro(data.bairro);
    this.validateCidade(data.cidade);
    this.validateEstado(data.estado);
    this.validateCEP(data.cep);
    this.validateTipo(data.tipo);
    this.validatePrincipal(data.principal);
    return data;
  }

  static validateCreateInput(data: CreateEnderecoInput) {
    this.validateClienteId(data.clienteId);
    this.validateLogradouro(data.logradouro);
    this.validateNumero(data.numero);
    this.validateComplemento(data.complemento);
    this.validateBairro(data.bairro);
    this.validateCidade(data.cidade);
    this.validateEstado(data.estado);
    this.validateCEP(data.cep);
    this.validateTipo(data.tipo);
    this.validatePrincipal(data.principal);
    this.validateAllField(data);
    return data;
  }

  static validateUpdateInput(data: UpdateEnderecoInput) {
    if (data.clienteId !== undefined) this.validateClienteId(data.clienteId);
    if (data.logradouro !== undefined) this.validateLogradouro(data.logradouro);
    if (data.numero !== undefined) this.validateNumero(data.numero);
    if (data.complemento !== undefined)
      this.validateComplemento(data.complemento);
    if (data.bairro !== undefined) this.validateBairro(data.bairro);
    if (data.cidade !== undefined) this.validateCidade(data.cidade);
    if (data.estado !== undefined) this.validateEstado(data.estado);
    if (data.cep !== undefined) this.validateCEP(data.cep);
    if (data.tipo !== undefined) this.validateTipo(data.tipo);
    if (data.principal !== undefined) this.validatePrincipal(data.principal);

    this.validateAtLeastOneField(data);

    return data as UpdateEnderecoInput;
  }

  static validateId(id: string) {
    if (!id) {
      throw new EnderecoValidationError("id", id, "id_required");
    }
    return { id, validate: true };
  }
  static validateLogradouro(logradouro: string) {
    if (!logradouro?.trim()) {
      throw new EnderecoValidationError(
        "logradouro",
        logradouro,
        "logradouro_required"
      );
    }
    if (logradouro.length < this.MIN_NAME_LENGTH) {
      throw new EnderecoValidationError(
        "logradouro",
        logradouro,
        "logradouro_invalid"
      );
    }
  }
  private static validateCEP(zipCode: string) {
    if (!zipCode?.trim()) {
      throw new EnderecoValidationError("cep", zipCode, "cep_required");
    }
    if (!this.ZIP_CODE_REGEX.test(zipCode.trim())) {
      throw new EnderecoValidationError("cep", zipCode, "cep_invalid");
    }
  }

  private static validateAtLeastOneField(data: UpdateEnderecoInput) {
    const fields: (keyof UpdateEnderecoInput)[] = [
      "clienteId",
      "logradouro",
      "numero",
      "complemento",
      "bairro",
      "cidade",
      "estado",
      "cep",
      "tipo",
      "principal",
    ];

    const hasAtLeastOneField = fields.some(
      (field) => data[field as keyof UpdateEnderecoInput] !== undefined
    );

    if (!hasAtLeastOneField) {
      throw new EnderecoValidationError(
        "cliente",
        data,
        "cliente_required_to_update"
      );
    }
  }

  private static validateAllField(data: CreateEnderecoInput) {
    const fields: (keyof CreateEnderecoInput)[] = [
      "clienteId",
      "logradouro",
      "numero",
      "complemento",
      "bairro",
      "cidade",
      "estado",
      "cep",
      "tipo",
      "principal",
    ];

    fields.forEach((field) => {
      if (data[field] === undefined) {
        throw new EnderecoValidationError(
          "endereco",
          data[field],
          "all_field_required_to_create"
        );
      }
    });
  }
  private static validateClienteId(clienteId: string) {
    if (!clienteId?.trim()) {
      throw new EnderecoValidationError(
        "clienteId",
        clienteId,
        "clienteId_required"
      );
    }
  }

  private static validateNumero(numero: string) {
    if (!numero?.trim()) {
      throw new EnderecoValidationError("numero", numero, "numero_required");
    }
  }
  private static validateComplemento(complemento: string | null) {
    if (complemento !== null) {
      if (complemento.length < this.MIN_NAME_LENGTH) {
        throw new EnderecoValidationError(
          "complemento",
          complemento,
          "complemento_invalid"
        );
      }
    }
  }
  private static validateBairro(bairro: string) {
    if (!bairro?.trim()) {
      throw new EnderecoValidationError("bairro", bairro, "bairro_required");
    }
  }
  private static validateCidade(cidade: string) {
    if (!cidade?.trim()) {
      throw new EnderecoValidationError("cidade", cidade, "cidade_required");
    }
  }
  private static validateEstado(estado: string) {
    if (!estado?.trim()) {
      throw new EnderecoValidationError("estado", estado, "estado_required");
    }
  }
  private static validateTipo(tipo: string) {
    if (!tipo?.trim()) {
      throw new EnderecoValidationError("tipo", tipo, "tipo_required");
    }
  }
  private static validatePrincipal(principal: boolean) {
    if (principal === undefined) {
      throw new EnderecoValidationError(
        "principal",
        principal,
        "principal_required"
      );
    }
  }
}
