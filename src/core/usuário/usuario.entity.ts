import { User } from "@/infrastructure/generated/prisma";

export type TUsuario = User;

export type CreateUsuarioInput = Omit<
  TUsuario,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateUsuarioInput = Partial<CreateUsuarioInput>;

export interface IUsuarioRepository {
  create(data: CreateUsuarioInput): Promise<TUsuario>;
  update(id: string, data: UpdateUsuarioInput): Promise<TUsuario>;
  delete(id: string): Promise<TUsuario>;
  findAll(): Promise<TUsuario[]>;
  findById(id: string): Promise<TUsuario | null>;
  findByEmail(email: string): Promise<TUsuario | null>;
  findByNome(nome: string): Promise<TUsuario[]>;
  existsById(id: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
}
