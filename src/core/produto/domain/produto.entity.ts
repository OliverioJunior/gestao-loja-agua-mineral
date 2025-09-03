import { Categoria, Produto } from "@/infrastructure/generated/prisma";

export type TProduto = Produto;

export type TProdutoWithCategoria = Produto & {
  categoria: Categoria | null;
};

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
}
