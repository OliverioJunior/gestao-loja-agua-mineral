import { Categoria } from "@/infrastructure/generated/prisma";

export type TCategoria = Categoria;

export type CreateCategoriaInput = Omit<
  TCategoria,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateCategoriaInput = Partial<CreateCategoriaInput>;

export interface ICategoriaRepository {
  create(data: CreateCategoriaInput): Promise<TCategoria>;
  update(id: string, data: UpdateCategoriaInput): Promise<TCategoria>;
  delete(id: string): Promise<TCategoria>;
  findAll(): Promise<TCategoria[]>;
  findById(id: string): Promise<TCategoria | null>;
  findByNome(nome: string): Promise<TCategoria[]>;
  existsById(id: string): Promise<boolean>;
}
