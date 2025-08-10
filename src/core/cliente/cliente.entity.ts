import { Cliente } from "@/infrastructure/generated/prisma";

export type TCliente = Cliente;

export type CreateClienteInput = Omit<
  TCliente,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateClienteInput = Partial<CreateClienteInput>;

export interface IClienteRepository {
  create(data: CreateClienteInput): Promise<TCliente>;
  update(id: string, data: UpdateClienteInput): Promise<TCliente>;
  delete(id: string): Promise<TCliente>;
  findAll(): Promise<TCliente[]>;
  findById(id: string): Promise<TCliente | null>;
  findByEmail(email: string): Promise<TCliente | null>;
  findByTelefone(telefone: string): Promise<TCliente | null>;
  findByNome(nome: string): Promise<TCliente[]>;
  existsById(id: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  existsByTelefone(telefone: string): Promise<boolean>;
}