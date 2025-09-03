import {
  CreateCategoriaInput,
  TCategoria,
  UpdateCategoriaInput,
} from "./categoria.entity";
import { CategoriaValidationError } from "./categoria.errors";

export class CategoriaValidation {
  private static readonly MIN_NAME_LENGTH = 2;

  private static readonly ALLOWED_CREATE_FIELDS = [
    "nome",
    "description",
    "productsCount",
    "criadoPorId",
    "atualizadoPorId",
  ];

  private static readonly ALLOWED_UPDATE_FIELDS = [
    "nome",
    "description",
    "productsCount",
    "createdAt",
    "updatedAt",
    "criadoPorId",
    "atualizadoPorId",
  ];

  static validateInput(data: TCategoria): {
    data: TCategoria;
    validate: boolean;
  } {
    this.validateAllField(data);
    this.validateNome(data.nome);
    return { data, validate: true };
  }

  static validateCreateInput(data: CreateCategoriaInput) {
    this.validateNoExtraFields(data, this.ALLOWED_CREATE_FIELDS);
    this.validateNome(data.nome);
    this.validateAllField(data);

    return { data, validate: true };
  }

  static validateUpdateInput(data: UpdateCategoriaInput) {
    this.validateNoExtraFields(data, this.ALLOWED_UPDATE_FIELDS);

    if (data.nome !== undefined) {
      this.validateNome(data.nome);
    }

    this.validateAtLeastOneField(data);

    return { update: true, data };
  }

  static validateId(id: string) {
    if (!id) {
      throw new CategoriaValidationError("id", id, "id_required");
    }
    return { id, validate: true };
  }

  private static validateNome(nome: string) {
    if (!nome?.trim()) {
      throw new CategoriaValidationError("nome", nome, "nome_required");
    }
    if (nome.trim().length < this.MIN_NAME_LENGTH) {
      throw new CategoriaValidationError("nome", nome, "nome_min_length");
    }
  }

  private static validateAtLeastOneField(data: UpdateCategoriaInput) {
    const fields = ["nome", "descricao", "ativo"];

    const hasAtLeastOneField = fields.some(
      (field) => data[field as keyof UpdateCategoriaInput] !== undefined
    );

    if (!hasAtLeastOneField) {
      throw new CategoriaValidationError(
        "categoria",
        data,
        "categoria_required_to_update"
      );
    }
  }

  private static validateAllField(data: CreateCategoriaInput) {
    const fields: (keyof CreateCategoriaInput)[] = ["nome"];

    fields.forEach((field) => {
      if (data[field] === undefined) {
        throw new CategoriaValidationError(
          "categoria",
          data[field],
          "all_field_required"
        );
      }
    });
  }

  private static validateNoExtraFields(
    data: Record<string, unknown>,
    allowedFields: string[]
  ) {
    const dataKeys = Object.keys(data);
    const extraFields = dataKeys.filter((key) => !allowedFields.includes(key));

    if (extraFields.length > 0) {
      throw new CategoriaValidationError(
        "categoria",
        extraFields,
        "field_not_allowed"
      );
    }
  }
}
