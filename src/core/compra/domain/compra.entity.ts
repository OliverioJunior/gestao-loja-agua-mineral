import { Compra, Prisma } from "@/infrastructure/generated/prisma";

// Tipo base da entidade
export type TCompra = Compra;

// Tipo com relacionamentos
export type TCompraWithRelations = Prisma.CompraGetPayload<{
  include: {
    fornecedor: true;
    itens: {
      include: {
        produto: true;
      };
    };
  };
}>;

// Tipo para criação
export type CreateCompraInput = Omit<
  TCompra,
  "id" | "createdAt" | "updatedAt" | "criadoPorId" | "atualizadoPorId"
> & {
  criadoPorId: string;
};

// Tipo para atualização
export type UpdateCompraInput = Partial<
  Omit<CreateCompraInput, "fornecedorId" | "criadoPorId">
> & {
  atualizadoPorId: string;
};

// Interface do repositório
export interface ICompraRepository {
  // Operações CRUD obrigatórias
  create(data: CreateCompraInput): Promise<TCompra>;
  update(id: string, data: UpdateCompraInput): Promise<TCompra>;
  delete(id: string): Promise<TCompra>;
  findById(id: string): Promise<TCompraWithRelations | null>;
  findAll(): Promise<TCompraWithRelations[]>;
  
  // Operações de verificação
  existsById(id: string): Promise<boolean>;
  
  // Operações específicas do domínio
  findByFornecedorId(fornecedorId: string): Promise<TCompraWithRelations[]>;
  findByStatus(status: string): Promise<TCompraWithRelations[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<TCompraWithRelations[]>;
  findByNumeroNota(numeroNota: string): Promise<TCompraWithRelations | null>;
  calculateTotalByFornecedor(fornecedorId: string): Promise<number>;
  getStatistics(): Promise<{
    total: number;
    pendentes: number;
    confirmadas: number;
    recebidas: number;
    canceladas: number;
    valorTotal: number;
    valorMedio: number;
  }>;
}