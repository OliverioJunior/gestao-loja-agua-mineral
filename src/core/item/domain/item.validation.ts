import { BusinessRulesError } from "../../error/domain.errors";
import { CreateItemInput, TItem, UpdateItemInput } from "./item.entity";
import { ItemValidationError } from "./item.errors";

export class ItemValidation {
  private static readonly MAX_QUANTITY = 999;
  private static readonly MIN_QUANTITY = 1;

  static validateInput(data: TItem): { data: TItem; validate: boolean } {
    this.validateAllFields(data);

    this.validateProdutoId(data.produtoId);
    this.validateQuantidade(data.quantidade);
    this.validatePreco(data.preco);
    return { data, validate: true };
  }

  static validateCreateInput(data: CreateItemInput) {
    this.validateProdutoId(data.produtoId);
    this.validateQuantidade(data.quantidade);
    this.validatePreco(data.preco);
    this.validateAllFields(data);

    return { data, validate: true };
  }

  static validateUpdateInput(data: UpdateItemInput) {
    if (data.quantidade !== undefined) {
      this.validateQuantidade(data.quantidade);
    }

    if (data.preco !== undefined) {
      this.validatePreco(data.preco);
    }

    this.validateAtLeastOneField(data);

    return { update: true, data };
  }

  static validateId(id: string) {
    if (!id?.trim()) {
      throw new ItemValidationError("id", id, "id_required");
    }
    return { id, validate: true };
  }

  static validateQuantidadeVsEstoque(quantidade: number, estoque: number) {
    if (quantidade > estoque) {
      throw new BusinessRulesError(
        `Quantidade solicitada (${quantidade}) excede o estoque disponível (${estoque})`,
        "insufficient_stock",
        { quantidade, estoque }
      );
    }
  }

  static validatePrecoVsProduto(precoItem: number, precoProduto: number) {
    // Permite uma variação de até 10% do preço original do produto
    const variacao = precoProduto * 0.1;
    const precoMinimo = precoProduto - variacao;
    const precoMaximo = precoProduto + variacao;

    if (precoItem < precoMinimo || precoItem > precoMaximo) {
      throw new BusinessRulesError(
        `Preço do item (${precoItem}) está fora da faixa permitida (${precoMinimo} - ${precoMaximo})`,
        "invalid_price",
        { precoItem, precoProduto, precoMinimo, precoMaximo }
      );
    }
  }

  private static validatePedidoId(pedidoId: string) {
    if (!pedidoId?.trim()) {
      throw new ItemValidationError("pedidoId", pedidoId, "pedido_id_required");
    }
  }

  private static validateProdutoId(produtoId: string) {
    if (!produtoId?.trim()) {
      throw new ItemValidationError(
        "produtoId",
        produtoId,
        "produto_id_required"
      );
    }
  }

  private static validateQuantidade(quantidade: number) {
    if (quantidade === undefined || quantidade === null) {
      throw new ItemValidationError(
        "quantidade",
        quantidade,
        "quantidade_required"
      );
    }

    if (typeof quantidade !== "number" || quantidade < this.MIN_QUANTITY) {
      throw new ItemValidationError(
        "quantidade",
        quantidade,
        "quantidade_positive"
      );
    }

    if (quantidade > this.MAX_QUANTITY) {
      throw new ItemValidationError("quantidade", quantidade, "quantidade_max");
    }
  }

  private static validatePreco(preco: number) {
    if (preco === undefined || preco === null) {
      throw new ItemValidationError("preco", preco, "preco_required");
    }

    if (typeof preco !== "number" || preco <= 0) {
      throw new ItemValidationError("preco", preco, "preco_positive");
    }

    // Nota: Validação de preço máximo é responsabilidade do módulo produto
    // A validação de faixa de preço vs produto é feita no service via validatePrecoVsProduto
  }

  private static validateAtLeastOneField(data: UpdateItemInput) {
    const fields = ["quantidade", "preco", "pedidoId"];

    const hasAtLeastOneField = fields.some(
      (field) => data[field as keyof UpdateItemInput] !== undefined
    );

    if (!hasAtLeastOneField) {
      throw new ItemValidationError("item", data, "at_least_one_field");
    }
  }

  private static validateAllFields(data: CreateItemInput) {
    const requiredFields: (keyof CreateItemInput)[] = [
      "pedidoId",
      "produtoId",
      "quantidade",
      "preco",
      "criadoPorId",
      "atualizadoPorId",
    ];

    requiredFields.forEach((field) => {
      if (data[field] === undefined) {
        throw new ItemValidationError(
          "item",
          data[field],
          "all_fields_required"
        );
      }
    });
  }
}
