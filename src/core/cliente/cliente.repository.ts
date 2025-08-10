import { PrismaClient } from "@prisma/client";
import {
  IClienteRepository,
  TCliente,
  CreateClienteInput,
  UpdateClienteInput,
} from "./cliente.entity";

export class ClienteRepository implements IClienteRepository {
  constructor(private db: PrismaClient) {}

  async create(data: CreateClienteInput): Promise<TCliente> {
    return await this.db.cliente.create({
      data,
    });
  }

  async update(id: string, data: UpdateClienteInput): Promise<TCliente> {
    return await this.db.cliente.update({
      where: { id },
      data,
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

  async findAll(): Promise<TCliente[]> {
    return await this.db.cliente.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findByEmail(email: string): Promise<TCliente | null> {
    return await this.db.cliente.findUnique({
      where: { email },
    });
  }

  async findByTelefone(telefone: string): Promise<TCliente | null> {
    return await this.db.cliente.findUnique({
      where: { phone: telefone },
    });
  }

  async findByNome(nome: string): Promise<TCliente[]> {
    return await this.db.cliente.findMany({
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
      where: { phone: telefone },
    });
    return count > 0;
  }
}