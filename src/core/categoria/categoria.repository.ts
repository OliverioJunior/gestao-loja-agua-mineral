import { PrismaClient } from "@/infrastructure/generated/prisma";
import {
  ICategoriaRepository,
  TCategoria,
  CreateCategoriaInput,
  UpdateCategoriaInput,
} from "./categoria.entity";
import { prisma } from "@/infrastructure";
export class CategoriaRepository implements ICategoriaRepository {
  private prisma: PrismaClient;
  constructor(private readonly db: PrismaClient = prisma) {
    this.prisma = db as PrismaClient;
  }

  async create(data: CreateCategoriaInput): Promise<TCategoria> {
    return await this.db.$transaction(async (prisma) => {
      return await prisma.categoria.create({
        data,
      });
    });
  }

  async update(id: string, data: UpdateCategoriaInput): Promise<TCategoria> {
    return await this.db.$transaction(async (prisma) => {
      return await prisma.categoria.update({
        where: { id },
        data,
      });
    });
  }

  async delete(id: string): Promise<TCategoria> {
    return await this.db.categoria.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<TCategoria | null> {
    return await this.db.categoria.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<TCategoria[]> {
    return await this.db.categoria.findMany({
      orderBy: { nome: "asc" },
    });
  }

  async findByNome(nome: string): Promise<TCategoria[]> {
    return await this.db.categoria.findMany({
      where: {
        nome: {
          contains: nome,
          mode: "insensitive",
        },
      },
      orderBy: { nome: "asc" },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.db.categoria.count({
      where: { id },
    });
    return count > 0;
  }
}
