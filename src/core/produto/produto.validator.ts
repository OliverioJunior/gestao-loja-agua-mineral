import { BusinessRulesError } from "../error/domain.errors";
import {
  CreateProdutoInput,
  TProduto,
  UpdateProdutoInput,
} from "./produto.entity";
import { ProdutoValidation } from "./produto.errors";

export class ProdutoValidator {
  private static readonly MAX_PRICE = 999999.99;
  private static readonly MIN_NAME_LENGTH = 2;

  static validateInput(data: TProduto): { data: TProduto; validate: boolean } {
    this.validateAllField(data);
    this.validateNome(data.nome);
    this.validatePreco(data.precoVenda, "precoVenda");
    this.validatePreco(data.precoCusto, "precoCusto");
    this.validatePrecoVendaMaiorQueCusto(data.precoVenda, data.precoCusto);
    return { data, validate: true };
  }

  static validateCreateInput(data: CreateProdutoInput) {
    this.validateNome(data.nome);
    this.validatePreco(data.precoVenda, "precoVenda");
    this.validatePreco(data.precoCusto, "precoCusto");
    this.validatePrecoVendaMaiorQueCusto(data.precoVenda, data.precoCusto);
    this.validateAllField(data);

    return { data, validate: true };
  }

  static validateUpdateInput(data: UpdateProdutoInput) {
    if (data.nome !== undefined) {
      this.validateNome(data.nome);
    }

    if (data.precoVenda !== undefined) {
      this.validatePrecoPositivo(data.precoVenda, "precoVenda");
    }

    if (data.precoCusto !== undefined) {
      this.validatePrecoPositivo(data.precoCusto, "precoCusto");
    }

    if (data.precoVenda !== undefined && data.precoCusto !== undefined) {
      this.validatePrecoVendaMaiorQueCusto(data.precoVenda, data.precoCusto);
    }
    this.validateAtLeastOneField(data);

    return { update: true, data };
  }

  static validateId(id: string) {
    if (!id) {
      throw new ProdutoValidation("id", id, "id_required");
    }
    return { id, validate: true };
  }

  private static validateNome(nome: string) {
    if (!nome?.trim()) {
      throw new ProdutoValidation("nome", nome, "nome_required");
    }
    if (nome.trim().length < this.MIN_NAME_LENGTH) {
      throw new ProdutoValidation("nome", nome, "nome_min_length");
    }
  }

  private static validatePreco(preco: number, campo: string) {
    this.validatePrecoPositivo(preco, campo);
    this.validatePrecoMaximo(preco, campo);
  }

  private static validatePrecoPositivo(preco: number, campo: string) {
    if (preco <= 0) {
      throw new ProdutoValidation(campo, preco, "preco_positive");
    }
  }

  private static validatePrecoMaximo(preco: number, campo: string) {
    if (preco > this.MAX_PRICE) {
      throw new ProdutoValidation(campo, preco, "preco_max_value");
    }
  }

  private static validatePrecoVendaMaiorQueCusto(
    precoVenda: number,
    precoCusto: number
  ) {
    if (precoVenda <= precoCusto) {
      throw new BusinessRulesError(
        "Preço de venda deve ser maior que o preço de custo",
        "preco_venda_maior_custo",
        { precoVenda, precoCusto }
      );
    }
  }

  private static validateAtLeastOneField(data: UpdateProdutoInput) {
    const fields = [
      "nome",
      "descricao",
      "precoCusto",
      "precoVenda",
      "estoqueMinimo",
      "ativo",
      "promocao",
      "categoriaId",
      "precoRevenda",
      "marca",
      "precoPromocao",
      "estoque",
    ];

    const hasAtLeastOneField = fields.some(
      (field) => data[field as keyof UpdateProdutoInput] !== undefined
    );

    if (!hasAtLeastOneField) {
      throw new ProdutoValidation(
        "produto",
        data,
        "produto_required_to_update"
      );
    }
  }
  private static validateAllField(data: CreateProdutoInput) {
    // Validar apenas campos obrigatórios
    const requiredFields: (keyof CreateProdutoInput)[] = [
      "nome",
      "precoCusto",
      "precoVenda",
      "estoque",
      "ativo",
      "promocao",
    ];

    requiredFields.forEach((field) => {
      if (data[field] === undefined || data[field] === null) {
        throw new ProdutoValidation(
          "produto",
          data[field],
          `all_field_required`
        );
      }
    });

    // Validar campos numéricos específicos
    if (typeof data.estoque !== "number" || data.estoque < 0) {
      throw new ProdutoValidation(
        "estoque",
        data.estoque,
        "all_field_required"
      );
    }

    if (data.estoqueMinimo !== undefined && data.estoqueMinimo !== null) {
      if (typeof data.estoqueMinimo !== "number" || data.estoqueMinimo < 0) {
        throw new ProdutoValidation(
          "estoqueMinimo",
          data.estoqueMinimo,
          "all_field_required"
        );
      }
    }
  }
}
