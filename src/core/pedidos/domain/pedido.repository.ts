import { PrismaClient, StatusPedido } from "@/infrastructure/generated/prisma";
import { prisma, PrismaTransaction } from "@/infrastructure";
import {
  IPedidoRepository,
  CreatePedidoInput,
  UpdatePedidoInput,
  TPedido,
  TPedidoWithRelations,
  IPaginatedResponse,
  pedidoWithRelationsInclude,
} from "./pedido.entity";

export class PedidoRepository implements IPedidoRepository {
  constructor(private readonly db: PrismaClient | PrismaTransaction = prisma) {}

  async create(data: CreatePedidoInput): Promise<TPedido> {
    try {
      return await this.db.pedido.create({
        data: {
          total: data.total,
          status: data.status,
          formaPagamento: data.formaPagamento,
          observacoes: data.observacoes,
          desconto: data.desconto,
          taxaEntrega: data.taxaEntrega,
          clienteId: data.clienteId,
          criadoPorId: data.criadoPorId,
          itens: {
            createMany: {
              data: data.itens.map((item) => ({
                produtoId: item.produtoId,
                quantidade: item.quantidade,
                preco: item.preco,
                criadoPorId: data.criadoPorId,
              })),
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
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
        itens: {
          select: {
            id: true,
            produtoId: true,
            quantidade: true,
            preco: true,
            produto: {
              select: {
                nome: true,
              },
            },
          },
        },
        endereco: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: {
      clienteId?: string;
      status?: StatusPedido;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<IPaginatedResponse<TPedidoWithRelations>> {
    // Validar parâmetros de paginação
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.min(Math.max(1, limit), 100); // Máximo 100 itens por página
    const skip = (validatedPage - 1) * validatedLimit;

    // Construir filtros WHERE
    const where: typeof filters & { createdAt?: { gte?: Date; lte?: Date } } =
      {};

    if (filters?.clienteId) {
      where.clienteId = filters.clienteId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.startDate && filters?.endDate) {
      where.createdAt = {
        gte: filters.startDate,
        lte: filters.endDate,
      };
    } else if (filters?.startDate) {
      where.createdAt = {
        gte: filters.startDate,
      };
    } else if (filters?.endDate) {
      where.createdAt = {
        lte: filters.endDate,
      };
    }

    // Executar consultas em paralelo para otimizar performance
    const [data, total] = await Promise.all([
      this.db.pedido.findMany({
        where,
        include: pedidoWithRelationsInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take: validatedLimit,
      }),
      this.db.pedido.count({ where }),
    ]);

    // Calcular informações de paginação
    const totalPages = Math.ceil(total / validatedLimit);
    const hasNext = validatedPage < totalPages;
    const hasPrev = validatedPage > 1;

    return {
      data,
      pagination: {
        page: validatedPage,
        limit: validatedLimit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }

  async findById(id: string): Promise<TPedidoWithRelations | null> {
    return await this.db.pedido.findUnique({
      where: { id },
      include: {
        cliente: true,
        itens: {
          select: {
            id: true,
            produtoId: true,
            quantidade: true,
            preco: true,
            produto: {
              select: {
                nome: true,
              },
            },
          },
        },
        endereco: true,
      },
    });
  }

  async findByClienteId(clienteId: string): Promise<TPedidoWithRelations[]> {
    return await this.db.pedido.findMany({
      where: { clienteId },
      include: {
        cliente: true,
        itens: {
          select: {
            id: true,
            produtoId: true,
            quantidade: true,
            preco: true,
            produto: {
              select: {
                nome: true,
              },
            },
          },
        },
        endereco: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByStatus(status: StatusPedido): Promise<TPedidoWithRelations[]> {
    return await this.db.pedido.findMany({
      where: { status },
      include: {
        cliente: true,
        itens: {
          select: {
            id: true,
            produtoId: true,
            quantidade: true,
            preco: true,
            produto: {
              select: {
                nome: true,
              },
            },
          },
        },
        endereco: true,
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
        dataEntrega: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        cliente: true,
        itens: {
          select: {
            id: true,
            produtoId: true,
            quantidade: true,
            preco: true,
            produto: {
              select: {
                nome: true,
              },
            },
          },
        },
        endereco: true,
      },
      orderBy: { dataEntrega: "desc" },
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
        dataEntrega: {
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
        itens: {
          select: {
            id: true,
            produtoId: true,
            quantidade: true,
            preco: true,
            produto: {
              select: {
                nome: true,
              },
            },
          },
        },
        endereco: true,
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
