import { BusinessRulesError } from "../error/domain.errors";
import { CreateProdutoInput, UpdateProdutoInput } from "./produto.entity";
import { ProdutoValidation } from "./produto.errors";

export class ProdutoValidator {
  static validateCreateInput(data: CreateProdutoInput) {
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
    return { data, validate: true };
  }

  static validateUpdateInput(data: UpdateProdutoInput) {
    if (
      !data.ativo &&
      !data.categoria &&
      !data.descricao &&
      !data.estoqueMinimo &&
      !data.marca &&
      !data.nome &&
      !data.precoCusto &&
      !data.precoPromocao &&
      !data.precoRevenda &&
      !data.precoVenda &&
      !data.promocao &&
      !data.quantidade
    ) {
      throw new ProdutoValidation(
        "produto",
        data,
        "produto_required_to_update"
      );
    }
    if (data.nome !== undefined) {
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
    return { update: true, data };
  }

  static validateId(id: string) {
    if (!id) {
      throw new ProdutoValidation("id", id, "id_required");
    }
    return {
      id: id,
      validate: true,
    };
  }
}
