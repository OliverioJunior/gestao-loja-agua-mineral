import { ItemCompra, Prisma } from "@/infrastructure/generated/prisma";

// Tipo base da entidade
export type TItemCompra = ItemCompra;

// Tipo com relacionamentos
export type TItemCompraWithRelations = Prisma.ItemCompraGetPayload<{
  include: {
    compra: {
      include: {
        fornecedor: true;
      };
    };
    produto: true;
  };
}>;

// Tipo para criação
export type CreateItemCompraInput = Omit<
  TItemCompra,
  "id" | "createdAt" | "updatedAt" | "criadoPorId" | "atualizadoPorId"
> & {
  criadoPorId: string;
};

// Tipo para atualização
export type UpdateItemCompraInput = Partial<
  Omit<CreateItemCompraInput, "compraId" | "criadoPorId">
> & {
  atualizadoPorId: string;
};

// Interface do repositório
export interface IItemCompraRepository {
  // Operações CRUD obrigatórias
  create(data: CreateItemCompraInput): Promise<TItemCompra>;
  update(id: string, data: UpdateItemCompraInput): Promise<TItemCompra>;
  delete(id: string): Promise<TItemCompra>;
  findById(id: string): Promise<TItemCompraWithRelations | null>;
  findAll(): Promise<TItemCompraWithRelations[]>;
  
  // Operações de verificação
  existsById(id: string): Promise<boolean>;
  
  // Operações específicas do domínio
  findByCompraId(compraId: string): Promise<TItemCompraWithRelations[]>;
  findByProdutoId(produtoId: string): Promise<TItemCompraWithRelations[]>;
  calculateTotalByCompra(compraId: string): Promise<number>;
}