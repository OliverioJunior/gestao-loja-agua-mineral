import { PrismaClient } from "@/infrastructure/generated/prisma";
import {
  IUsuarioRepository,
  TUsuario,
  CreateUsuarioInput,
  UpdateUsuarioInput,
} from "./usuario.entity";
import { prisma } from "@/infrastructure";

export class UsuarioRepository implements IUsuarioRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  async create(data: CreateUsuarioInput): Promise<TUsuario> {
    return await this.db.$transaction(async (prisma) => {
      return await prisma.user.create({
        data,
      });
    });
  }

  async update(id: string, data: UpdateUsuarioInput): Promise<TUsuario> {
    return await this.db.$transaction(async (prisma) => {
      return await prisma.user.update({
        where: { id },
        data,
      });
    });
  }

  async delete(id: string): Promise<TUsuario> {
    return await this.db.user.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<TUsuario | null> {
    return await this.db.user.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<TUsuario[]> {
    return await this.db.user.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findByEmail(email: string): Promise<TUsuario | null> {
    return await this.db.user.findUnique({
      where: { email },
    });
  }

  async findByNome(nome: string): Promise<TUsuario[]> {
    return await this.db.user.findMany({
      where: {
        name: {
          contains: nome,
          mode: "insensitive",
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.db.user.count({
      where: { id },
    });
    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.db.user.count({
      where: { email },
    });
    return count > 0;
  }
}
