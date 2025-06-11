import { Produto } from "@/generated/prisma";

export type TProduto = Produto;

export type CreateProdutoInput = Omit<
  TProduto,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateProdutoInput = Partial<CreateProdutoInput>;

export interface IProdutoRepository {
  create(data: CreateProdutoInput): Promise<TProduto>;
  update(id: string, data: UpdateProdutoInput): Promise<TProduto>;
  delete(id: string): Promise<TProduto>;
  findAll(): Promise<TProduto[]>;
  findById(id: string): Promise<TProduto | null>;
  findByNome(nome: string): Promise<TProduto[]>;
  existsById(id: string): Promise<boolean>;
  findWithPagination(
    page: number,
    limit: number
  ): Promise<{
    data: TProduto[];
    total: number;
    page: number;
    totalPages: number;
  }>;
}
