import { PrismaClient } from "@/infrastructure/generated/prisma";
import { prisma, PrismaTransaction } from "@/infrastructure";
import {
  IItemRepository,
  CreateItemInput,
  UpdateItemInput,
  TItem,
  TItemWithRelations,
} from "./item.entity";

export class ItemRepository implements IItemRepository {
  constructor(private readonly db: PrismaClient | PrismaTransaction = prisma) {}

  async create(data: CreateItemInput): Promise<TItem> {
    return await this.db.item.create({
      data,
    });
  }

  async update(id: string, data: UpdateItemInput): Promise<TItem> {
    return await this.db.item.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<TItem> {
    return await this.db.item.delete({
      where: { id },
    });
  }

  async findAll(): Promise<TItemWithRelations[]> {
    return await this.db.item.findMany({
      include: {
        pedido: true,
        produto: {
          include: {
            categoria: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<TItemWithRelations | null> {
    return await this.db.item.findUnique({
      where: { id },
      include: {
        pedido: true,
        produto: {
          include: {
            categoria: true,
          },
        },
      },
    });
  }

  async findByPedidoId(pedidoId: string): Promise<TItemWithRelations[]> {
    return await this.db.item.findMany({
      where: { pedidoId },
      include: {
        pedido: true,
        produto: {
          include: {
            categoria: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async findByProdutoId(produtoId: string): Promise<TItemWithRelations[]> {
    return await this.db.item.findMany({
      where: { produtoId },
      include: {
        pedido: true,
        produto: {
          include: {
            categoria: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const item = await this.db.item.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!item;
  }

  async calculateTotalByPedido(pedidoId: string): Promise<number> {
    const result = await this.db.item.aggregate({
      where: { pedidoId },
      _sum: {
        preco: true,
      },
    });

    return result._sum.preco || 0;
  }

  async validateStock(produtoId: string, quantidade: number): Promise<boolean> {
    const produto = await this.db.produto.findUnique({
      where: { id: produtoId },
      select: { estoque: true },
    });

    if (!produto) {
      return false;
    }

    return produto.estoque >= quantidade;
  }

  async findDuplicateItem(
    pedidoId: string,
    produtoId: string
  ): Promise<TItem | null> {
    return await this.db.item.findFirst({
      where: {
        pedidoId,
        produtoId,
      },
    });
  }

  async updateProdutoStock(
    produtoId: string,
    quantidadeReduzir: number
  ): Promise<void> {
    await this.db.produto.update({
      where: { id: produtoId },
      data: {
        estoque: {
          decrement: quantidadeReduzir,
        },
      },
    });
  }

  async restoreProdutoStock(
    produtoId: string,
    quantidadeRestaurar: number
  ): Promise<void> {
    await this.db.produto.update({
      where: { id: produtoId },
      data: {
        estoque: {
          increment: quantidadeRestaurar,
        },
      },
    });
  }
}
