import {
  TItemCompra,
  TItemCompraWithRelations,
  CreateItemCompraInput,
  UpdateItemCompraInput,
  IItemCompraRepository,
} from "./item-compra.entity";
import { ItemCompraValidation } from "./item-compra.validation";
import { ItemCompraNotFoundError } from "./item-compra.errors";
import { ErrorHandler } from "../../error/errors-handler";

export interface IItemCompraService {
  // Operações CRUD
  create(data: CreateItemCompraInput): Promise<TItemCompra>;
  update(id: string, data: UpdateItemCompraInput): Promise<TItemCompra>;
  delete(id: string): Promise<TItemCompra>;
  findById(id: string): Promise<TItemCompraWithRelations | null>;
  findAll(): Promise<TItemCompraWithRelations[]>;

  // Operações específicas do domínio
  findByCompraId(compraId: string): Promise<TItemCompraWithRelations[]>;
  findByProdutoId(produtoId: string): Promise<TItemCompraWithRelations[]>;
  calculateTotalByCompra(compraId: string): Promise<number>;

  // Operações de negócio
  createMultipleItems(items: CreateItemCompraInput[]): Promise<TItemCompra[]>;
  updateCompraTotal(compraId: string): Promise<void>;
}

export class ItemCompraService implements IItemCompraService {
  constructor(private itemCompraRepository: IItemCompraRepository) {}

  /**
   * Cria um novo item de compra
   */
  async create(data: CreateItemCompraInput): Promise<TItemCompra> {
    try {
      // Validar entrada
      ItemCompraValidation.validateCreateInput(data);

      // Validar UUIDs
      ItemCompraValidation.validateUUID(data.compraId, "compraId");
      ItemCompraValidation.validateUUID(data.produtoId, "produtoId");
      ItemCompraValidation.validateUUID(data.criadoPorId, "criadoPorId");

      // Executar operação
      const itemCompra = await this.itemCompraRepository.create(data);

      // Atualizar total da compra
      await this.updateCompraTotal(data.compraId);

      return itemCompra;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "criação de item de compra"
      );
    }
  }

  /**
   * Atualiza um item de compra existente
   */
  async update(id: string, data: UpdateItemCompraInput): Promise<TItemCompra> {
    try {
      // Validar entrada
      ItemCompraValidation.validateUpdateInput(data);
      ItemCompraValidation.validateUUID(id, "id");

      if (data.produtoId) {
        ItemCompraValidation.validateUUID(data.produtoId, "produtoId");
      }

      if (data.atualizadoPorId) {
        ItemCompraValidation.validateUUID(
          data.atualizadoPorId,
          "atualizadoPorId"
        );
      }

      // Buscar item atual para obter compraId
      const currentItem = await this.itemCompraRepository.findById(id);
      if (!currentItem) {
        throw new ItemCompraNotFoundError("id", id);
      }

      // Executar operação
      const itemCompra = await this.itemCompraRepository.update(id, data);

      // Atualizar total da compra
      await this.updateCompraTotal(currentItem.compraId);

      return itemCompra;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "atualização de item de compra"
      );
    }
  }

  /**
   * Remove um item de compra
   */
  async delete(id: string): Promise<TItemCompra> {
    try {
      ItemCompraValidation.validateUUID(id, "id");

      // Buscar item para obter compraId antes da exclusão
      const item = await this.itemCompraRepository.findById(id);
      if (!item) {
        throw new ItemCompraNotFoundError("id", id);
      }

      // Executar operação
      const deletedItem = await this.itemCompraRepository.delete(id);

      // Atualizar total da compra
      await this.updateCompraTotal(item.compraId);

      return deletedItem;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "exclusão de item de compra"
      );
    }
  }

  /**
   * Busca um item de compra por ID
   */
  async findById(id: string): Promise<TItemCompraWithRelations | null> {
    try {
      ItemCompraValidation.validateUUID(id, "id");
      return await this.itemCompraRepository.findById(id);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de item de compra por ID"
      );
    }
  }

  /**
   * Lista todos os itens de compra
   */
  async findAll(): Promise<TItemCompraWithRelations[]> {
    try {
      return await this.itemCompraRepository.findAll();
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "listagem de itens de compra"
      );
    }
  }

  /**
   * Busca itens de compra por ID da compra
   */
  async findByCompraId(compraId: string): Promise<TItemCompraWithRelations[]> {
    try {
      ItemCompraValidation.validateUUID(compraId, "compraId");
      return await this.itemCompraRepository.findByCompraId(compraId);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de itens por compra"
      );
    }
  }

  /**
   * Busca itens de compra por ID do produto
   */
  async findByProdutoId(
    produtoId: string
  ): Promise<TItemCompraWithRelations[]> {
    try {
      ItemCompraValidation.validateUUID(produtoId, "produtoId");
      return await this.itemCompraRepository.findByProdutoId(produtoId);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de itens por produto"
      );
    }
  }

  /**
   * Calcula o total dos itens de uma compra
   */
  async calculateTotalByCompra(compraId: string): Promise<number> {
    try {
      ItemCompraValidation.validateUUID(compraId, "compraId");
      return await this.itemCompraRepository.calculateTotalByCompra(compraId);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "cálculo de total por compra"
      );
    }
  }

  /**
   * Cria múltiplos itens de compra em uma transação
   */
  async createMultipleItems(
    items: CreateItemCompraInput[]
  ): Promise<TItemCompra[]> {
    try {
      // Validar todos os itens
      items.forEach((item, index) => {
        try {
          ItemCompraValidation.validateCreateInput(item);
          ItemCompraValidation.validateUUID(item.compraId, "compraId");
          ItemCompraValidation.validateUUID(item.produtoId, "produtoId");
          ItemCompraValidation.validateUUID(item.criadoPorId, "criadoPorId");
        } catch (error) {
          ErrorHandler.handleRepositoryError(
            error,
            `validação do item ${index + 1}`
          );
        }
      });

      // Criar todos os itens
      const createdItems: TItemCompra[] = [];
      for (const item of items) {
        const createdItem = await this.itemCompraRepository.create(item);
        createdItems.push(createdItem);
      }

      // Atualizar total da compra (assumindo que todos os itens são da mesma compra)
      if (items.length > 0) {
        await this.updateCompraTotal(items[0].compraId);
      }

      return createdItems;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "criação múltipla de itens de compra"
      );
    }
  }

  /**
   * Atualiza o total da compra baseado nos itens
   */
  async updateCompraTotal(compraId: string): Promise<void> {
    try {
      // Esta funcionalidade seria implementada em conjunto com o CompraService
      // Por enquanto, apenas calculamos o total para validação
      const total = await this.calculateTotalByCompra(compraId);

      // TODO: Implementar atualização do total na tabela Compra
      // await this.compraService.updateTotal(compraId, total);

      console.log(`Total calculado para compra ${compraId}: ${total}`);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "atualização de total da compra"
      );
    }
  }
}
