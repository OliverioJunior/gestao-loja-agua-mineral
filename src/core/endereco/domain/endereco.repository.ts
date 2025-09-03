import { PrismaClient } from "@/infrastructure/generated/prisma";
import {
  CreateEnderecoInput,
  IEnderecoRepository,
  TEndereco,
  UpdateEnderecoInput,
} from "./endereco.entity";
import { prisma, PrismaTransaction } from "@/infrastructure";

export class EnderecoRepository implements IEnderecoRepository {
  constructor(private readonly db: PrismaClient | PrismaTransaction = prisma) {}

  async create(data: CreateEnderecoInput): Promise<TEndereco> {
    return await this.db.endereco.create({
      data,
    });
  }

  async update(id: string, data: UpdateEnderecoInput): Promise<TEndereco> {
    return await this.db.endereco.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<TEndereco> {
    return await this.db.endereco.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<TEndereco | null> {
    return await this.db.endereco.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<TEndereco[]> {
    return await this.db.endereco.findMany();
  }

  async findByLogradouro(logradouro: string): Promise<TEndereco[]> {
    return await this.db.endereco.findMany({
      where: {
        logradouro: {
          contains: logradouro,
          mode: "insensitive",
        },
      },
      orderBy: { logradouro: "asc" },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.db.endereco.count({
      where: { id },
    });
    return count > 0;
  }
}
