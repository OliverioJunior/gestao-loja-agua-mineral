import { PrismaClient, StatusPedido } from "@/infrastructure/generated/prisma";
import { prisma, PrismaTransaction } from "@/infrastructure";
import {
  IPedidoRepository,
  CreatePedidoInput,
  UpdatePedidoInput,
  TPedido,
  TPedidoWithRelations,
  TPedidoComplete,
} from "./pedido.entity";

export class PedidoRepository implements IPedidoRepository {
  constructor(private readonly db: PrismaClient | PrismaTransaction = prisma) {}

  async create(data: CreatePedidoInput): Promise<TPedido> {
    return await this.db.pedido.create({
      data: {
        clienteId: data.clienteId,
        total: data.total,
        status: data.status,
        criadoPorId: data.criadoPorId,
        atualizadoPorId: data.atualizadoPorId,
        enderecoId: data.enderecoId,
      },
    });
  }

  async update(id: string, data: UpdatePedidoInput): Promise<TPedido> {
    return await this.db.pedido.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<TPedido> {
    await this.db.item.deleteMany({
      where: { pedidoId: id },
    });

    // Depois, deletar o pedido
    return await this.db.pedido.delete({
      where: { id },
    });
  }

  async findAll(): Promise<TPedidoWithRelations[]> {
    return await this.db.pedido.findMany({
      include: {
        cliente: true,
        itens: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<TPedidoComplete | null> {
    return await this.db.pedido.findUnique({
      where: { id },
      include: {
        cliente: true,
        itens: {
          include: {
            produto: {
              include: {
                categoria: true,
              },
            },
          },
        },
      },
    });
  }

  async findByClienteId(clienteId: string): Promise<TPedidoWithRelations[]> {
    return await this.db.pedido.findMany({
      where: { clienteId },
      include: {
        cliente: true,
        itens: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByStatus(status: StatusPedido): Promise<TPedidoWithRelations[]> {
    return await this.db.pedido.findMany({
      where: { status },
      include: {
        cliente: true,
        itens: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<TPedidoWithRelations[]> {
    return await this.db.pedido.findMany({
      where: {
        data: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        cliente: true,
        itens: true,
      },
      orderBy: { data: "desc" },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const pedido = await this.db.pedido.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!pedido;
  }

  async calculateTotalByPeriod(
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const result = await this.db.pedido.aggregate({
      where: {
        data: {
          gte: startDate,
          lte: endDate,
        },
        status: "ENTREGUE", // Apenas pedidos entregues
      },
      _sum: {
        total: true,
      },
    });

    return result._sum.total || 0;
  }

  async getStatistics(): Promise<{
    total: number;
    pendentes: number;
    confirmados: number;
    preparando: number;
    entregues: number;
    cancelados: number;
    faturamentoMensal: number;
  }> {
    // Contar pedidos por status
    const statusCounts = await this.db.pedido.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    // Calcular faturamento do mês atual
    const currentMonth = new Date();
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    const faturamentoMensal = await this.calculateTotalByPeriod(
      startOfMonth,
      endOfMonth
    );

    // Processar contadores
    const stats = {
      total: 0,
      pendentes: 0,
      confirmados: 0,
      preparando: 0,
      entregues: 0,
      cancelados: 0,
      faturamentoMensal,
    };

    statusCounts.forEach((item) => {
      stats.total += item._count.id;
      switch (item.status) {
        case "PENDENTE":
          stats.pendentes = item._count.id;
          break;
        case "CONFIRMADO":
          stats.confirmados = item._count.id;
          break;
        case "ENTREGUE":
          stats.entregues = item._count.id;
          break;
        case "CANCELADO":
          stats.cancelados = item._count.id;
          break;
      }
    });

    return stats;
  }

  async findActivePedidoByCliente(clienteId: string): Promise<TPedido | null> {
    return await this.db.pedido.findFirst({
      where: {
        clienteId,
        status: "PENDENTE",
      },
    });
  }

  async countPedidosByCliente(clienteId: string): Promise<number> {
    return await this.db.pedido.count({
      where: { clienteId },
    });
  }

  async findRecentPedidos(limit: number = 10): Promise<TPedidoWithRelations[]> {
    return await this.db.pedido.findMany({
      include: {
        cliente: true,
        itens: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async updateStatus(
    id: string,
    status: StatusPedido,
    userId: string
  ): Promise<TPedido> {
    return await this.db.pedido.update({
      where: { id },
      data: {
        status,
        atualizadoPorId: userId,
      },
    });
  }
}
