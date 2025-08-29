import {
  ICreateDespesa,
  IUpdateDespesa,
  IDespesaFilters,
  TDespesaWithUser,
} from "./despesa.entity";
import { prisma, PrismaTransaction, PrismaClient } from "@/infrastructure";
import { Despesa, Prisma } from "@/infrastructure/generated/prisma";

export class DespesaRepository {
  constructor(private readonly db: PrismaClient | PrismaTransaction = prisma) {}

  async create(data: ICreateDespesa, userId: string): Promise<Despesa> {
    return this.db.despesa.create({
      data: {
        categoria: data.categoria,
        data: data.data,
        descricao: data.descricao,
        valor: data.valor,
        formaPagamento: data.formaPagamento,
        observacoes: data.observacoes,
        criadoPor: {
          connect: {
            id: userId,
          },
        },
        atualizadoPor: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<TDespesaWithUser | null> {
    return this.db.despesa.findUnique({
      where: { id },
      include: {
        criadoPor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        atualizadoPor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(filters?: IDespesaFilters): Promise<TDespesaWithUser[]> {
    const where: Prisma.DespesaWhereInput = {};

    if (filters?.dataInicio && filters?.dataFim) {
      where.data = {
        gte: filters.dataInicio,
        lte: filters.dataFim,
      };
    } else if (filters?.dataInicio) {
      where.data = {
        gte: filters.dataInicio,
      };
    } else if (filters?.dataFim) {
      where.data = {
        lte: filters.dataFim,
      };
    }

    if (filters?.categoria) {
      where.categoria = filters.categoria;
    }

    if (filters?.formaPagamento) {
      where.formaPagamento = filters.formaPagamento;
    }

    if (filters?.valorMinimo && filters?.valorMaximo) {
      where.valor = {
        gte: filters.valorMinimo,
        lte: filters.valorMaximo,
      };
    } else if (filters?.valorMinimo) {
      where.valor = {
        gte: filters.valorMinimo,
      };
    } else if (filters?.valorMaximo) {
      where.valor = {
        lte: filters.valorMaximo,
      };
    }

    if (filters?.searchTerm) {
      where.OR = [
        {
          descricao: {
            contains: filters.searchTerm,
            mode: "insensitive",
          },
        },
        {
          observacoes: {
            contains: filters.searchTerm,
            mode: "insensitive",
          },
        },
      ];
    }

    return this.db.despesa.findMany({
      where,
      include: {
        criadoPor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        atualizadoPor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        data: "desc",
      },
    });
  }

  async update(
    id: string,
    data: IUpdateDespesa,
    userId: string
  ): Promise<Despesa> {
    return this.db.despesa.update({
      where: { id },
      data: {
        categoria: data.categoria,
        data: data.data,
        descricao: data.descricao,
        valor: data.valor,
        formaPagamento: data.formaPagamento,
        observacoes: data.observacoes,
        atualizadoPor: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.despesa.delete({
      where: { id },
    });
  }

  async getStats(filters?: { dataInicio?: Date; dataFim?: Date }) {
    const where: Prisma.DespesaWhereInput = {};

    if (filters?.dataInicio && filters?.dataFim) {
      where.data = {
        gte: filters.dataInicio,
        lte: filters.dataFim,
      };
    }

    const [totalDespesas, despesasPorCategoria, despesasPorFormaPagamento] =
      await Promise.all([
        this.db.despesa.aggregate({
          where,
          _sum: {
            valor: true,
          },
          _count: true,
        }),
        this.db.despesa.groupBy({
          by: ["categoria"],
          where,
          _sum: {
            valor: true,
          },
          _count: true,
        }),
        this.db.despesa.groupBy({
          by: ["formaPagamento"],
          where,
          _sum: {
            valor: true,
          },
          _count: true,
        }),
      ]);

    // Calcular totais do mês e ano atual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [totalMes, totalAno] = await Promise.all([
      this.db.despesa.aggregate({
        where: {
          data: {
            gte: startOfMonth,
          },
        },
        _sum: {
          valor: true,
        },
      }),
      this.db.despesa.aggregate({
        where: {
          data: {
            gte: startOfYear,
          },
        },
        _sum: {
          valor: true,
        },
      }),
    ]);

    return {
      totalDespesas: totalDespesas._sum.valor || 0,
      totalMes: totalMes._sum.valor || 0,
      totalAno: totalAno._sum.valor || 0,
      despesasPorCategoria: despesasPorCategoria.map((item) => ({
        categoria: item.categoria,
        total: item._sum.valor || 0,
        count: item._count,
      })),
      despesasPorFormaPagamento: despesasPorFormaPagamento.map((item) => ({
        formaPagamento: item.formaPagamento,
        total: item._sum.valor || 0,
        count: item._count,
      })),
    };
  }
}
