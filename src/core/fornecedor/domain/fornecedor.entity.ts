import { Fornecedor, Prisma } from "@/infrastructure/generated/prisma";

// Tipo base da entidade
export type TFornecedor = Fornecedor;

// Tipo com relacionamentos
export type TFornecedorWithRelations = Prisma.FornecedorGetPayload<{
  include: {
    compras: {
      include: {
        itens: true;
      };
    };
  };
}>;

// Tipo para criação
export type CreateFornecedorInput = Omit<
  TFornecedor,
  "id" | "createdAt" | "updatedAt" | "criadoPorId" | "atualizadoPorId"
> & {
  criadoPorId: string;
};

// Tipo para atualização
export type UpdateFornecedorInput = Partial<
  Omit<CreateFornecedorInput, "criadoPorId">
> & {
  atualizadoPorId: string;
};

// Interface do repositório
export interface IFornecedorRepository {
  // Operações CRUD obrigatórias
  create(data: CreateFornecedorInput): Promise<TFornecedor>;
  update(id: string, data: UpdateFornecedorInput): Promise<TFornecedor>;
  delete(id: string): Promise<TFornecedor>;
  findById(id: string): Promise<TFornecedorWithRelations | null>;
  findAll(): Promise<TFornecedorWithRelations[]>;
  
  // Operações de verificação
  existsById(id: string): Promise<boolean>;
  
  // Operações específicas do domínio
  findByStatus(status: string): Promise<TFornecedorWithRelations[]>;
  findByCnpj(cnpj: string): Promise<TFornecedorWithRelations | null>;
  findByCpf(cpf: string): Promise<TFornecedorWithRelations | null>;
  findByEmail(email: string): Promise<TFornecedorWithRelations | null>;
  searchByName(name: string): Promise<TFornecedorWithRelations[]>;
  getStatistics(): Promise<{
    total: number;
    ativos: number;
    inativos: number;
    totalCompras: number;
  }>;
}