import { BusinessRulesError, ValidationError } from "../error/domain.errors";
import { CreateProdutoInput, UpdateProdutoInput } from "./produto.entity";
import { ProdutoValidation } from "./produto.errors";

export class ProdutoValidator {
  static validateCreateInput(data: CreateProdutoInput): void {
    // Nome obrigatório
    if (!data.nome?.trim()) {
      throw new ProdutoValidation("nome", data.nome, "nome_required");
    }

    // Nome mínimo
    if (data.nome.trim().length < 2) {
      throw new ProdutoValidation("nome", data.nome, "nome_min_length");
    }

    // Preço de venda
    if (data.precoVenda <= 0) {
      throw new ProdutoValidation(
        "precoVenda",
        data.precoVenda,
        "preco_positive"
      );
    }

    if (data.precoVenda > 999999.99) {
      throw new ProdutoValidation(
        "precoVenda",
        data.precoVenda,
        "preco_max_value"
      );
    }

    // Preço de custo
    if (data.precoCusto <= 0) {
      throw new ProdutoValidation(
        "precoCusto",
        data.precoCusto,
        "preco_positive"
      );
    }

    if (data.precoCusto > 999999.99) {
      throw new ProdutoValidation(
        "precoCusto",
        data.precoCusto,
        "preco_max_value"
      );
    }

    // Regra de negócio: preço de venda deve ser maior que custo
    if (data.precoVenda <= data.precoCusto) {
      throw new BusinessRulesError(
        "Preço de venda deve ser maior que o preço de custo",
        "preco_venda_maior_custo",
        { precoVenda: data.precoVenda, precoCusto: data.precoCusto }
      );
    }
  }

  static validateUpdateInput(data: UpdateProdutoInput): void {
    if (data.nome !== undefined) {
      if (!data.nome?.trim()) {
        throw new ProdutoValidation("nome", data.nome, "nome_required");
      }
      if (data.nome.trim().length < 2) {
        throw new ProdutoValidation("nome", data.nome, "nome_min_length");
      }
    }

    if (data.precoVenda !== undefined && data.precoVenda <= 0) {
      throw new ProdutoValidation(
        "precoVenda",
        data.precoVenda,
        "preco_positive"
      );
    }

    if (data.precoCusto !== undefined && data.precoCusto <= 0) {
      throw new ProdutoValidation(
        "precoCusto",
        data.precoCusto,
        "preco_positive"
      );
    }

    // Se ambos os preços estão sendo atualizados, validar regra de negócio
    if (data.precoVenda !== undefined && data.precoCusto !== undefined) {
      if (data.precoVenda <= data.precoCusto) {
        throw new BusinessRulesError(
          "Preço de venda deve ser maior que o preço de custo",
          "preco_venda_maior_custo",
          { precoVenda: data.precoVenda, precoCusto: data.precoCusto }
        );
      }
    }
  }

  static validateId(id: string): void {
    if (!id?.trim()) {
      throw new ValidationError("ID é obrigatório", "id", id);
    }
  }

  static validatePaginationParams(
    page?: number,
    limit?: number
  ): { page: number; limit: number } {
    const validatedPage = Math.max(1, page || 1);
    const validatedLimit = Math.min(Math.max(1, limit || 10), 100);

    return { page: validatedPage, limit: validatedLimit };
  }
}
