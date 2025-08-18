import { Endereco } from "@/infrastructure/generated/prisma";

export type TEndereco = Endereco;

export type CreateEnderecoInput = Omit<
  TEndereco,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateEnderecoInput = Partial<CreateEnderecoInput>;

export interface IEnderecoRepository {
  create(data: CreateEnderecoInput): Promise<TEndereco>;
  update(id: string, data: UpdateEnderecoInput): Promise<TEndereco>;
  delete(id: string): Promise<TEndereco>;
  findAll(): Promise<TEndereco[]>;
  findById(id: string): Promise<TEndereco | null>;
  findByLogradouro(logradouro: string): Promise<TEndereco[]>;
  existsById(id: string): Promise<boolean>;
}
