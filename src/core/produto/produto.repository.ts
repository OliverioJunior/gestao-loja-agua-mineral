import { PrismaClient } from "@/infrastructure/generated/prisma";
import { prisma } from "@/infrastructure";
import {
  IProdutoRepository,
  CreateProdutoInput,
  UpdateProdutoInput,
  TProduto,
} from "./produto.entity";

export class ProdutoRepository implements IProdutoRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  async create(data: CreateProdutoInput): Promise<TProduto> {
    return await this.db.$transaction(async (prisma) => {
      return await prisma.produto.create({ data });
    });
  }

  async update(id: string, data: UpdateProdutoInput): Promise<TProduto> {
    return await this.db.$transaction(async (prisma) => {
      return await prisma.produto.update({
        where: { id },
        data,
      });
    });
  }

  async delete(id: string): Promise<TProduto> {
    return await this.db.$transaction(async (prisma) => {
      return await prisma.produto.delete({
        where: { id },
      });
    });
  }

  async findAll(): Promise<TProduto[]> {
    return await this.db.produto.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<TProduto | null> {
    return await this.db.produto.findUnique({
      where: { id },
    });
  }

  async findByNome(nome: string): Promise<TProduto[]> {
    return await this.db.produto.findMany({
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
    const count = await this.db.produto.count({
      where: { id },
    });
    return count > 0;
  }
}
