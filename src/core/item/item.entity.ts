import { Item, Prisma } from "@/infrastructure/generated/prisma";

export type TItem = Item;

export type TItemWithRelations = Prisma.ItemGetPayload<{
  include: {
    pedido: true;
    produto: {
      include: {
        categoria: true;
      };
    };
  };
}>;

export type CreateItemInput = Omit<TItem, "id" | "createdAt" | "updatedAt">;

export type UpdateItemInput = Partial<Omit<CreateItemInput, "produtoId">>;

export interface IItemRepository {
  create(data: CreateItemInput): Promise<TItem>;
  update(id: string, data: UpdateItemInput): Promise<TItem>;
  delete(id: string): Promise<TItem>;
  findAll(): Promise<TItemWithRelations[]>;
  findById(id: string): Promise<TItemWithRelations | null>;
  findByPedidoId(pedidoId: string): Promise<TItemWithRelations[]>;
  findByProdutoId(produtoId: string): Promise<TItemWithRelations[]>;
  existsById(id: string): Promise<boolean>;
  calculateTotalByPedido(pedidoId: string): Promise<number>;
  validateStock(produtoId: string, quantidade: number): Promise<boolean>;
}
