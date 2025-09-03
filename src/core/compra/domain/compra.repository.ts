import { prisma } from "@/infrastructure";
import {
  TCompra,
  TCompraWithRelations,
  CreateCompraInput,
  UpdateCompraInput,
  ICompraRepository,
} from "./compra.entity";
import {
  CompraNotFoundError,
  FornecedorNotFoundError,
  NumeroNotaAlreadyExistsError,
  CompraHasItensError,
} from "./compra.errors";
import { ErrorHandler } from "../../error/errors-handler";
import { StatusCompra } from "@/infrastructure/generated/prisma";

export class CompraRepository implements ICompraRepository {
  /**
   * Cria uma nova compra
   */
  async create(data: CreateCompraInput): Promise<TCompra> {
    try {
      // Verificar se o fornecedor existe
      const fornecedorExists = await prisma.fornecedor.findUnique({
        where: { id: data.fornecedorId },
      });

      if (!fornecedorExists) {
        throw new FornecedorNotFoundError(data.fornecedorId);
      }

      // Verificar se já existe compra com mesmo número de nota (se fornecido)
      if (data.numeroNota) {
        const existingNota = await this.findByNumeroNota(data.numeroNota);
        if (existingNota) {
          throw new NumeroNotaAlreadyExistsError(data.numeroNota);
        }
      }

      return await prisma.compra.create({
        data,
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "criação de compra");
    }
  }

  /**
   * Atualiza uma compra existente
   */
  async update(id: string, data: UpdateCompraInput): Promise<TCompra> {
    try {
      // Verificar se a compra existe
      const exists = await this.existsById(id);
      if (!exists) {
        throw new CompraNotFoundError("id", id);
      }

      // Verificar conflito de número de nota apenas se foi alterado
      if (data.numeroNota) {
        const existingNota = await this.findByNumeroNota(data.numeroNota);
        if (existingNota && existingNota.id !== id) {
          throw new NumeroNotaAlreadyExistsError(data.numeroNota);
        }
      }

      return await prisma.compra.update({
        where: { id },
        data,
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "atualização de compra");
    }
  }

  /**
   * Remove uma compra
   */
  async delete(id: string): Promise<TCompra> {
    try {
      const exists = await this.existsById(id);
      if (!exists) {
        throw new CompraNotFoundError("id", id);
      }

      // Verificar se a compra tem itens associados
      const itensCount = await prisma.itemCompra.count({
        where: { compraId: id },
      });

      if (itensCount > 0) {
        throw new CompraHasItensError(id, itensCount);
      }

      return await prisma.compra.delete({
        where: { id },
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "exclusão de compra");
    }
  }

  /**
   * Busca uma compra por ID com relacionamentos
   */
  async findById(id: string): Promise<TCompraWithRelations | null> {
    try {
      return await prisma.compra.findUnique({
        where: { id },
        include: {
          fornecedor: true,
          itens: {
            include: {
              produto: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de compra por ID"
      );
    }
  }

  /**
   * Lista todas as compras com relacionamentos
   */
  async findAll(): Promise<TCompraWithRelations[]> {
    try {
      return await prisma.compra.findMany({
        include: {
          fornecedor: true,
          itens: {
            include: {
              produto: true,
            },
          },
        },
        orderBy: {
          dataCompra: "desc",
        },
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "listagem de compras");
    }
  }

  /**
   * Verifica se uma compra existe
   */
  async existsById(id: string): Promise<boolean> {
    try {
      const count = await prisma.compra.count({
        where: { id },
      });
      return count > 0;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "verificação de existência de compra"
      );
    }
  }

  /**
   * Busca compras por fornecedor
   */
  async findByFornecedorId(
    fornecedorId: string
  ): Promise<TCompraWithRelations[]> {
    try {
      return await prisma.compra.findMany({
        where: { fornecedorId },
        include: {
          fornecedor: true,
          itens: {
            include: {
              produto: true,
            },
          },
        },
        orderBy: {
          dataCompra: "desc",
        },
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de compras por fornecedor"
      );
    }
  }

  /**
   * Busca compras por status
   */
  async findByStatus(status: StatusCompra): Promise<TCompraWithRelations[]> {
    try {
      return await prisma.compra.findMany({
        where: { status },
        include: {
          fornecedor: true,
          itens: {
            include: {
              produto: true,
            },
          },
        },
        orderBy: {
          dataCompra: "desc",
        },
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de compras por status"
      );
    }
  }

  /**
   * Busca compras por intervalo de datas
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<TCompraWithRelations[]> {
    try {
      return await prisma.compra.findMany({
        where: {
          dataCompra: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          fornecedor: true,
          itens: {
            include: {
              produto: true,
            },
          },
        },
        orderBy: {
          dataCompra: "desc",
        },
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de compras por intervalo de datas"
      );
    }
  }

  /**
   * Busca compra por número da nota
   */
  async findByNumeroNota(
    numeroNota: string
  ): Promise<TCompraWithRelations | null> {
    try {
      return await prisma.compra.findFirst({
        where: { numeroNota },
        include: {
          fornecedor: true,
          itens: {
            include: {
              produto: true,
            },
          },
        },
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de compra por número da nota"
      );
    }
  }

  /**
   * Calcula total de compras por fornecedor
   */
  async calculateTotalByFornecedor(fornecedorId: string): Promise<number> {
    try {
      const result = await prisma.compra.aggregate({
        where: {
          fornecedorId,
          status: {
            in: ["CONFIRMADA", "RECEBIDA"],
          },
        },
        _sum: {
          total: true,
        },
      });

      return result._sum.total || 0;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "cálculo de total por fornecedor"
      );
    }
  }

  /**
   * Obtém estatísticas das compras
   */
  async getStatistics(): Promise<{
    total: number;
    pendentes: number;
    confirmadas: number;
    recebidas: number;
    canceladas: number;
    valorTotal: number;
    valorMedio: number;
  }> {
    try {
      const [
        total,
        pendentes,
        confirmadas,
        recebidas,
        canceladas,
        valorAggregate,
      ] = await Promise.all([
        prisma.compra.count(),
        prisma.compra.count({ where: { status: "PENDENTE" } }),
        prisma.compra.count({ where: { status: "CONFIRMADA" } }),
        prisma.compra.count({ where: { status: "RECEBIDA" } }),
        prisma.compra.count({ where: { status: "CANCELADA" } }),
        prisma.compra.aggregate({
          where: {
            status: {
              in: ["CONFIRMADA", "RECEBIDA"],
            },
          },
          _sum: {
            total: true,
          },
          _avg: {
            total: true,
          },
        }),
      ]);

      return {
        total,
        pendentes,
        confirmadas,
        recebidas,
        canceladas,
        valorTotal: valorAggregate._sum.total || 0,
        valorMedio: Math.round(valorAggregate._avg.total || 0),
      };
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "obtenção de estatísticas de compras"
      );
    }
  }
}
