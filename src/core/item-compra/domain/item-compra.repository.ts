import { prisma } from "@/infrastructure";
import {
  TItemCompra,
  TItemCompraWithRelations,
  CreateItemCompraInput,
  UpdateItemCompraInput,
  IItemCompraRepository
} from "./item-compra.entity";
import {
  ItemCompraNotFoundError,
  CompraNotFoundError,
  ProdutoNotFoundError
} from "./item-compra.errors";
import { ErrorHandler } from "../../error/errors-handler";

export class ItemCompraRepository implements IItemCompraRepository {
  /**
   * Cria um novo item de compra
   */
  async create(data: CreateItemCompraInput): Promise<TItemCompra> {
    try {
      // Verificar se a compra existe
      const compraExists = await prisma.compra.findUnique({
        where: { id: data.compraId }
      });
      
      if (!compraExists) {
        throw new CompraNotFoundError(data.compraId);
      }

      // Verificar se o produto existe
      const produtoExists = await prisma.produto.findUnique({
        where: { id: data.produtoId }
      });
      
      if (!produtoExists) {
        throw new ProdutoNotFoundError(data.produtoId);
      }

      return await prisma.itemCompra.create({
        data
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "criação de item de compra");
    }
  }

  /**
   * Atualiza um item de compra existente
   */
  async update(id: string, data: UpdateItemCompraInput): Promise<TItemCompra> {
    try {
      // Verificar se o item existe
      const exists = await this.existsById(id);
      if (!exists) {
        throw new ItemCompraNotFoundError("id", id);
      }

      // Verificar se o produto existe (se fornecido)
      if (data.produtoId) {
        const produtoExists = await prisma.produto.findUnique({
          where: { id: data.produtoId }
        });
        
        if (!produtoExists) {
          throw new ProdutoNotFoundError(data.produtoId);
        }
      }

      return await prisma.itemCompra.update({
        where: { id },
        data
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "atualização de item de compra");
    }
  }

  /**
   * Remove um item de compra
   */
  async delete(id: string): Promise<TItemCompra> {
    try {
      const exists = await this.existsById(id);
      if (!exists) {
        throw new ItemCompraNotFoundError("id", id);
      }

      return await prisma.itemCompra.delete({
        where: { id }
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "exclusão de item de compra");
    }
  }

  /**
   * Busca um item de compra por ID com relacionamentos
   */
  async findById(id: string): Promise<TItemCompraWithRelations | null> {
    try {
      return await prisma.itemCompra.findUnique({
        where: { id },
        include: {
          compra: {
            include: {
              fornecedor: true
            }
          },
          produto: true
        }
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de item de compra por ID");
    }
  }

  /**
   * Lista todos os itens de compra com relacionamentos
   */
  async findAll(): Promise<TItemCompraWithRelations[]> {
    try {
      return await prisma.itemCompra.findMany({
        include: {
          compra: {
            include: {
              fornecedor: true
            }
          },
          produto: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "listagem de itens de compra");
    }
  }

  /**
   * Verifica se um item de compra existe
   */
  async existsById(id: string): Promise<boolean> {
    try {
      const count = await prisma.itemCompra.count({
        where: { id }
      });
      return count > 0;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "verificação de existência de item de compra");
    }
  }

  /**
   * Busca itens de compra por ID da compra
   */
  async findByCompraId(compraId: string): Promise<TItemCompraWithRelations[]> {
    try {
      return await prisma.itemCompra.findMany({
        where: { compraId },
        include: {
          compra: {
            include: {
              fornecedor: true
            }
          },
          produto: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de itens por compra");
    }
  }

  /**
   * Busca itens de compra por ID do produto
   */
  async findByProdutoId(produtoId: string): Promise<TItemCompraWithRelations[]> {
    try {
      return await prisma.itemCompra.findMany({
        where: { produtoId },
        include: {
          compra: {
            include: {
              fornecedor: true
            }
          },
          produto: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de itens por produto");
    }
  }

  /**
   * Calcula o total dos itens de uma compra
   */
  async calculateTotalByCompra(compraId: string): Promise<number> {
    try {
      const result = await prisma.itemCompra.aggregate({
        where: { compraId },
        _sum: {
          precoTotal: true
        }
      });
      
      return result._sum.precoTotal || 0;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "cálculo de total por compra");
    }
  }
}