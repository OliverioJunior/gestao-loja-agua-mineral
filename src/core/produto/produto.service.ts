import { BusinessRulesError } from "../error/domain.errors";
import { ErrorHandler } from "../error/errors-handler";
import {
  IProdutoRepository,
  CreateProdutoInput,
  UpdateProdutoInput,
  TProduto,
} from "./produto.entity";
import { ProdutoNotFoundError } from "./produto.errors";
import { ProdutoValidator } from "./produto.validator";

export class ProdutoService {
  constructor(private produtoRepository: IProdutoRepository) {}

  async create(data: CreateProdutoInput): Promise<TProduto> {
    try {
      ProdutoValidator.validateCreateInput(data);
      return await this.produtoRepository.create(data);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "criação de produto");
    }
  }

  async update(id: string, data: UpdateProdutoInput): Promise<TProduto> {
    try {
      ProdutoValidator.validateId(id);
      ProdutoValidator.validateUpdateInput(data);

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
  async delete(id: string): Promise<void> {
    try {
      ProdutoValidator.validateId(id);

      const exists = await this.produtoRepository.existsById(id);
      if (!exists) {
        throw new ProdutoNotFoundError(id);
      }

      await this.produtoRepository.delete(id);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "exclusão de produto");
    }
  }

  async findById(id: string): Promise<TProduto | null> {
    try {
      ProdutoValidator.validateId(id);

      const produto = await this.produtoRepository.findById(id);
      if (!produto) {
        throw new ProdutoNotFoundError(id);
      }

      return produto;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de produto");
    }
  }

  async findAll(filtros?: {
    nome?: string;
    page?: number;
    limit?: number;
  }): Promise<
    | { data: TProduto[]; total: number; page: number; totalPages: number }
    | TProduto[]
  > {
    try {
      if (filtros?.nome) {
        return await this.produtoRepository.findByNome(filtros.nome);
      }

      if (filtros?.page && filtros?.limit) {
        const { page, limit } = ProdutoValidator.validatePaginationParams(
          filtros.page,
          filtros.limit
        );

        return await this.produtoRepository.findWithPagination(page, limit);
      }

      return await this.produtoRepository.findAll();
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de produtos");
    }
  }
}
