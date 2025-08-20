import { ErrorHandler } from "../error/errors-handler";
import {
  IItemRepository,
  CreateItemInput,
  UpdateItemInput,
  TItem,
  TItemWithRelations,
} from "./item.entity";
import {
  ItemNotFoundError,
  ItemConflictError,
  ItemBusinessRulesError,
} from "./item.errors";
import { ItemValidator } from "./item.validator";
import { PrismaClient } from "@/infrastructure/generated/prisma";
import { prisma, PrismaTransaction } from "@/infrastructure";
import { ProdutoService } from "../produto/produto.service";
import { ProdutoRepository } from "../produto/produto.repository";

export class ItemService {
  private produtoService: ProdutoService;

  constructor(
    private itemRepository: IItemRepository,
    private readonly db: PrismaClient | PrismaTransaction = prisma
  ) {
    // Inicializar ProdutoService para delegar operações de produto
    this.produtoService = new ProdutoService(new ProdutoRepository(this.db));
  }

  async create(data: CreateItemInput): Promise<TItem> {
    try {
      ItemValidator.validateCreateInput(data);
      // Criar o item
      const item = await this.itemRepository.create(data);

      return item;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "criação de item");
    }
  }

  async update(id: string, data: UpdateItemInput): Promise<TItem> {
    try {
      ItemValidator.validateId(id);
      ItemValidator.validateUpdateInput(data);

      const existingItem = await this.itemRepository.findById(id);
      if (!existingItem) {
        throw new ItemNotFoundError(id);
      }

      // Se a quantidade está sendo alterada, validar estoque
      if (data.quantidade !== undefined) {
        const diferenca = data.quantidade - existingItem.quantidade;
        if (diferenca > 0) {
          // Aumentando quantidade - verificar estoque
          await this.validateStockAvailability(
            existingItem.produtoId,
            diferenca
          );
        }
      }

      // Se o preço está sendo alterado, validar
      if (data.preco !== undefined) {
        await this.validateItemPrice(existingItem.produtoId, data.preco);
      }

      const updatedItem = await this.itemRepository.update(id, data);

      // Ajustar estoque se a quantidade foi alterada
      if (data.quantidade !== undefined) {
        const diferenca = data.quantidade - existingItem.quantidade;
        if (diferenca !== 0) {
          await this.adjustProductStock(existingItem.produtoId, diferenca);
        }
      }

      return updatedItem;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "atualização de item");
    }
  }

  async delete(id: string): Promise<TItem> {
    try {
      ItemValidator.validateId(id);

      const existingItem = await this.itemRepository.findById(id);
      if (!existingItem) {
        throw new ItemNotFoundError(id);
      }

      // Verificar se o pedido ainda permite alterações
      await this.validatePedidoCanBeModified(existingItem.pedidoId!);

      const deletedItem = await this.itemRepository.delete(id);

      // Restaurar estoque do produto
      await this.restoreProductStock(
        existingItem.produtoId,
        existingItem.quantidade
      );

      return deletedItem;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "exclusão de item");
    }
  }

  async findById(id: string): Promise<TItemWithRelations | null> {
    try {
      ItemValidator.validateId(id);
      return await this.itemRepository.findById(id);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de item");
    }
  }

  async findAll(): Promise<TItemWithRelations[]> {
    try {
      return await this.itemRepository.findAll();
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de itens");
    }
  }

  async findByPedidoId(pedidoId: string): Promise<TItemWithRelations[]> {
    try {
      return await this.itemRepository.findByPedidoId(pedidoId);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de itens por pedido"
      );
    }
  }

  async findByProdutoId(produtoId: string): Promise<TItemWithRelations[]> {
    try {
      return await this.itemRepository.findByProdutoId(produtoId);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de itens por produto"
      );
    }
  }

  async calculateTotalByPedido(pedidoId: string): Promise<number> {
    try {
      return await this.itemRepository.calculateTotalByPedido(pedidoId);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "cálculo de total do pedido"
      );
    }
  }

  // Métodos privados de validação
  private async validateProdutoExists(produtoId: string): Promise<void> {
    // Usar ProdutoService para obter dados do produto - responsabilidade do módulo produto
    const produto = await this.produtoService.findById(produtoId);

    if (!produto) {
      throw new ItemBusinessRulesError(
        `Produto com ID ${produtoId} não encontrado`,
        "produto_inactive",
        { produtoId }
      );
    }

    if (!produto.ativo) {
      throw new ItemBusinessRulesError(
        `Produto ${produto.nome} está inativo`,
        "produto_inactive",
        { produtoId, nome: produto.nome }
      );
    }
  }

  private async validatePedidoExists(pedidoId: string): Promise<void> {
    const pedido = await this.db.pedido.findUnique({
      where: { id: pedidoId },
      select: { id: true, status: true },
    });

    if (!pedido) {
      throw new ItemBusinessRulesError(
        `Pedido com ID ${pedidoId} não encontrado`,
        "pedido_closed",
        { pedidoId }
      );
    }

    if (pedido.status !== "PENDENTE") {
      throw new ItemBusinessRulesError(
        `Pedido ${pedidoId} não pode ser modificado (status: ${pedido.status})`,
        "pedido_closed",
        { pedidoId, status: pedido.status }
      );
    }
  }

  private async validateDuplicateItem(
    pedidoId: string,
    produtoId: string
  ): Promise<void> {
    const existingItem = await this.db.item.findFirst({
      where: { pedidoId, produtoId },
    });

    if (existingItem) {
      throw new ItemConflictError("pedido_produto", `${pedidoId}-${produtoId}`);
    }
  }

  private async validateStockAvailability(
    produtoId: string,
    quantidade: number
  ): Promise<void> {
    // Usar ProdutoService para obter dados do produto - responsabilidade do módulo produto
    const produto = await this.produtoService.findById(produtoId);

    if (!produto) {
      throw new ItemBusinessRulesError(
        `Produto com ID ${produtoId} não encontrado`,
        "produto_inactive",
        { produtoId }
      );
    }

    ItemValidator.validateQuantidadeVsEstoque(quantidade, produto.estoque);
  }

  private async validateItemPrice(
    produtoId: string,
    precoItem: number
  ): Promise<void> {
    // Usar ProdutoService para obter dados do produto - responsabilidade do módulo produto
    const produto = await this.produtoService.findById(produtoId);

    if (!produto) {
      throw new ItemBusinessRulesError(
        `Produto com ID ${produtoId} não encontrado`,
        "produto_inactive",
        { produtoId }
      );
    }

    ItemValidator.validatePrecoVsProduto(precoItem, produto.precoVenda);
  }

  private async validatePedidoCanBeModified(pedidoId: string): Promise<void> {
    const pedido = await this.db.pedido.findUnique({
      where: { id: pedidoId },
      select: { status: true },
    });

    if (!pedido || pedido.status !== "PENDENTE") {
      throw new ItemBusinessRulesError(
        `Pedido ${pedidoId} não pode ser modificado`,
        "pedido_closed",
        { pedidoId, status: pedido?.status }
      );
    }
  }

  // Métodos delegados para operações de estoque - responsabilidade do módulo produto
  private async updateProductStock(
    produtoId: string,
    quantidade: number
  ): Promise<void> {
    // Delegar para o ProdutoService - operação de estoque é responsabilidade do produto
    const produto = await this.produtoService.findById(produtoId);
    if (produto) {
      await this.produtoService.update(produtoId, {
        estoque: produto.estoque - quantidade,
      });
    }
  }

  private async restoreProductStock(
    produtoId: string,
    quantidade: number
  ): Promise<void> {
    // Delegar para o ProdutoService - operação de estoque é responsabilidade do produto
    const produto = await this.produtoService.findById(produtoId);
    if (produto) {
      await this.produtoService.update(produtoId, {
        estoque: produto.estoque + quantidade,
      });
    }
  }

  private async adjustProductStock(
    produtoId: string,
    diferenca: number
  ): Promise<void> {
    if (diferenca > 0) {
      // Reduzir estoque
      await this.updateProductStock(produtoId, diferenca);
    } else {
      // Aumentar estoque
      await this.restoreProductStock(produtoId, Math.abs(diferenca));
    }
  }
}
