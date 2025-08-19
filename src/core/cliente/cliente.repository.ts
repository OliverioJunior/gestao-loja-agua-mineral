import { PrismaClient } from "@/infrastructure/generated/prisma";
import {
  IClienteRepository,
  TCliente,
  CreateClienteInput,
  UpdateClienteInput,
  TClienteWithAdressAndCount,
} from "./cliente.entity";
import { prisma, PrismaTransaction } from "@/infrastructure";

export class ClienteRepository implements IClienteRepository {
  constructor(private readonly db: PrismaClient | PrismaTransaction = prisma) {}

  async create(data: CreateClienteInput): Promise<TCliente> {
    return await this.db.cliente.create({
      data,
    });
  }

  async update(id: string, data: UpdateClienteInput): Promise<TCliente> {
    return await this.db.cliente.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            pedidos: {
              where: {
                status: "ENTREGUE",
              },
            },
          },
        },
      },
    });
  }

  async delete(id: string): Promise<TCliente> {
    return await this.db.cliente.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<TCliente | null> {
    return await this.db.cliente.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<TClienteWithAdressAndCount[]> {
    return await this.db.cliente.findMany({
      include: {
        endereco: true,
        _count: {
          select: {
            pedidos: {
              where: { status: "ENTREGUE" },
            },
          },
        },
      },

      orderBy: { nome: "asc" },
    });
  }

  async findByEmail(email: string): Promise<TCliente | null> {
    return await this.db.cliente.findUnique({
      where: { email },
    });
  }

  async findByTelefone(telefone: string): Promise<TCliente | null> {
    return await this.db.cliente.findFirst({
      where: { telefone: telefone },
    });
  }

  async findByNome(nome: string): Promise<TCliente[]> {
    return await this.db.cliente.findMany({
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
    const count = await this.db.cliente.count({
      where: { id },
    });
    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.db.cliente.count({
      where: { email },
    });
    return count > 0;
  }

  async existsByTelefone(telefone: string): Promise<boolean> {
    const count = await this.db.cliente.count({
      where: { telefone: telefone },
    });
    return count > 0;
  }
}
