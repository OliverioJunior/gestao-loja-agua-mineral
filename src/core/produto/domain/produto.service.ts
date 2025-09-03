import { BusinessRulesError } from "../../error/domain.errors";
import { ErrorHandler } from "../../error/errors-handler";
import {
  IProdutoRepository,
  CreateProdutoInput,
  UpdateProdutoInput,
  TProduto,
} from "./produto.entity";
import { ProdutoNotFoundError } from "./produto.errors";
import { ProdutoValidation } from "./produto.validation";

export class ProdutoService {
  constructor(private produtoRepository: IProdutoRepository) {}

  async create(data: CreateProdutoInput): Promise<TProduto> {
    try {
      ProdutoValidation.validateCreateInput(data);
      return await this.produtoRepository.create(data);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "criação de produto");
    }
  }

  async update(id: string, data: UpdateProdutoInput): Promise<TProduto> {
    try {
      ProdutoValidation.validateId(id);
      ProdutoValidation.validateUpdateInput(data);

      const exists = await this.produtoRepository.existsById(id);
      if (!exists) {
        throw new ProdutoNotFoundError("Produto não encontrado");
      }
      if (
        (data.precoVenda !== undefined && data.precoCusto === undefined) ||
        (data.precoCusto !== undefined && data.precoVenda === undefined)
      ) {
        const produtoAtual = await this.produtoRepository.findById(id);
        if (produtoAtual) {
          const novoPrecoVenda = data.precoVenda ?? produtoAtual.precoVenda;
          const novoPrecoCusto = data.precoCusto ?? produtoAtual.precoCusto;

          if (novoPrecoVenda <= novoPrecoCusto) {
            throw new BusinessRulesError(
              "Preço de venda deve ser maior que o preço de custo",
              "preco_venda_maior_custo",
              { precoVenda: novoPrecoVenda, precoCusto: novoPrecoCusto }
            );
          }
        }
      }
      return await this.produtoRepository.update(id, data);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "atualização de produto"
      );
    }
  }
  async delete(id: string): Promise<TProduto> {
    try {
      ProdutoValidation.validateId(id);

      const exists = await this.produtoRepository.existsById(id);
      if (!exists) {
        throw new ProdutoNotFoundError(id);
      }

      return await this.produtoRepository.delete(id);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "exclusão de produto");
    }
  }

  async findById(id: string): Promise<TProduto | null> {
    try {
      ProdutoValidation.validateId(id);

      const produto = await this.produtoRepository.findById(id);
      if (!produto) {
        throw new ProdutoNotFoundError(id);
      }

      return produto;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de produto");
    }
  }
  async findAll(): Promise<TProduto[]> {
    try {
      return await this.produtoRepository.findAll();
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de produtos");
    }
  }
}
