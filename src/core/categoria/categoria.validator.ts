import {
  CreateCategoriaInput,
  TCategoria,
  UpdateCategoriaInput,
} from "./categoria.entity";
import { CategoriaValidation } from "./categoria.errors";

export class CategoriaValidator {
  private static readonly MIN_NAME_LENGTH = 2;

  static validateInput(data: TCategoria): {
    data: TCategoria;
    validate: boolean;
  } {
    this.validateAllField(data);
    this.validateNome(data.nome);
    return { data, validate: true };
  }

  static validateCreateInput(data: CreateCategoriaInput) {
    this.validateNome(data.nome);
    this.validateAllField(data);

    return { data, validate: true };
  }

  static validateUpdateInput(data: UpdateCategoriaInput) {
    if (data.nome !== undefined) {
      this.validateNome(data.nome);
    }

    this.validateAtLeastOneField(data);

    return { update: true, data };
  }

  static validateId(id: string) {
    if (!id) {
      throw new CategoriaValidation("id", id, "id_required");
    }
    return { id, validate: true };
  }

  private static validateNome(nome: string) {
    if (!nome?.trim()) {
      throw new CategoriaValidation("nome", nome, "nome_required");
    }
    if (nome.trim().length < this.MIN_NAME_LENGTH) {
      throw new CategoriaValidation("nome", nome, "nome_min_length");
    }
  }

  private static validateAtLeastOneField(data: UpdateCategoriaInput) {
    const fields = ["nome", "descricao", "ativo"];

    const hasAtLeastOneField = fields.some(
      (field) => data[field as keyof UpdateCategoriaInput] !== undefined
    );

    if (!hasAtLeastOneField) {
      throw new CategoriaValidation(
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
        throw new CategoriaValidation(
          "categoria",
          data[field],
          "all_field_required"
        );
      }
    });
  }
}
