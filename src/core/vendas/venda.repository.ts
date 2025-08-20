import { prisma, PrismaTransaction, PrismaClient } from "@/infrastructure";
import {
  IVendaRepository,
  CreateVendaInput,
  UpdateVendaInput,
  TVendas,
  TVendaWithRelations,
  TVendaComplete,
} from "./venda.entity";

export class VendaRepository implements IVendaRepository {
  constructor(private readonly db: PrismaClient | PrismaTransaction = prisma) {}

  async create(data: CreateVendaInput): Promise<TVendas> {
    return await this.db.vendas.create({
      data: {
        clienteId: data.clienteId,
        pedidoId: data.pedidoId,
        total: data.total,
        criadoPorId: data.criadoPorId,
        atualizadoPorId: data.atualizadoPorId,
      },
    });
  }

  async update(id: string, data: UpdateVendaInput): Promise<TVendas> {
    return await this.db.vendas.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<TVendas> {
    return await this.db.vendas.delete({
      where: { id },
    });
  }

  async findAll(): Promise<TVendaWithRelations[]> {
    return await this.db.vendas.findMany({
      include: {
        cliente: true,
        pedido: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<TVendaComplete | null> {
    return await this.db.vendas.findUnique({
      where: { id },
      include: {
        cliente: true,
        pedido: {
          include: {
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
        },
      },
    });
  }

  async findByClienteId(clienteId: string): Promise<TVendaWithRelations[]> {
    return await this.db.vendas.findMany({
      where: { clienteId },
      include: {
        cliente: true,
        pedido: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByPedidoId(pedidoId: string): Promise<TVendas | null> {
    return await this.db.vendas.findFirst({
      where: { pedidoId },
    });
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<TVendaWithRelations[]> {
    return await this.db.vendas.findMany({
      where: {
        data: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        cliente: true,
        pedido: true,
      },
      orderBy: { data: "desc" },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const venda = await this.db.vendas.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!venda;
  }

  async existsByPedidoId(pedidoId: string): Promise<boolean> {
    const venda = await this.db.vendas.findFirst({
      where: { pedidoId },
      select: { id: true },
    });
    return !!venda;
  }

  async calculateTotalByPeriod(
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const result = await this.db.vendas.aggregate({
      where: {
        data: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        total: true,
      },
    });

    return result._sum.total || 0;
  }

  async getStatistics(): Promise<{
    totalVendas: number;
    faturamentoDiario: number;
    faturamentoMensal: number;
    faturamentoAnual: number;
    ticketMedio: number;
    vendasPorFormaPagamento: {
      dinheiro: number;
      cartao_debito: number;
      cartao_credito: number;
      pix: number;
    };
  }> {
    // Datas para cálculos
    const hoje = new Date();
    const inicioHoje = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate()
    );
    const fimHoje = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate() + 1
    );

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const inicioAno = new Date(hoje.getFullYear(), 0, 1);
    const fimAno = new Date(hoje.getFullYear() + 1, 0, 0);

    // Contar total de vendas
    const totalVendas = await this.db.vendas.count();

    // Faturamento diário
    const faturamentoDiario = await this.calculateTotalByPeriod(
      inicioHoje,
      fimHoje
    );

    // Faturamento mensal
    const faturamentoMensal = await this.calculateTotalByPeriod(
      inicioMes,
      fimMes
    );

    // Faturamento anual
    const faturamentoAnual = await this.calculateTotalByPeriod(
      inicioAno,
      fimAno
    );

    // Ticket médio
    const ticketMedio = totalVendas > 0 ? faturamentoAnual / totalVendas : 0;

    // Vendas por forma de pagamento (simulado - seria necessário adicionar campo no schema)
    const vendasPorFormaPagamento = {
      dinheiro: 0,
      cartao_debito: 0,
      cartao_credito: 0,
      pix: 0,
    };

    return {
      totalVendas,
      faturamentoDiario,
      faturamentoMensal,
      faturamentoAnual,
      ticketMedio,
      vendasPorFormaPagamento,
    };
  }

  async getTopClientes(limit: number = 10): Promise<
    {
      clienteId: string;
      nomeCliente: string;
      totalCompras: number;
      quantidadeCompras: number;
    }[]
  > {
    const result = await this.db.vendas.groupBy({
      by: ["clienteId"],
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          total: "desc",
        },
      },
      take: limit,
    });

    // Buscar nomes dos clientes
    const clientesIds = result.map((item) => item.clienteId);
    const clientes = await this.db.cliente.findMany({
      where: {
        id: {
          in: clientesIds,
        },
      },
      select: {
        id: true,
        nome: true,
      },
    });

    // Combinar dados
    return result.map((item) => {
      const cliente = clientes.find((c) => c.id === item.clienteId);
      return {
        clienteId: item.clienteId,
        nomeCliente: cliente?.nome || "Cliente não encontrado",
        totalCompras: item._sum.total || 0,
        quantidadeCompras: item._count.id,
      };
    });
  }

  async getVendasByMonth(year: number): Promise<
    {
      mes: number;
      totalVendas: number;
      faturamento: number;
    }[]
  > {
    const result = await this.db.vendas.groupBy({
      by: ["data"],
      where: {
        data: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        },
      },
      _count: {
        id: true,
      },
      _sum: {
        total: true,
      },
    });

    // Agrupar por mês
    const vendasPorMes: {
      [key: number]: { totalVendas: number; faturamento: number };
    } = {};

    result.forEach((item) => {
      const mes = item.data.getMonth() + 1; // getMonth() retorna 0-11
      if (!vendasPorMes[mes]) {
        vendasPorMes[mes] = { totalVendas: 0, faturamento: 0 };
      }
      vendasPorMes[mes].totalVendas += item._count.id;
      vendasPorMes[mes].faturamento += item._sum.total || 0;
    });

    // Converter para array
    const meses = [];
    for (let mes = 1; mes <= 12; mes++) {
      meses.push({
        mes,
        totalVendas: vendasPorMes[mes]?.totalVendas || 0,
        faturamento: vendasPorMes[mes]?.faturamento || 0,
      });
    }

    return meses;
  }

  async findRecentVendas(limit: number = 10): Promise<TVendaWithRelations[]> {
    return await this.db.vendas.findMany({
      include: {
        cliente: true,
        pedido: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async countVendasByCliente(clienteId: string): Promise<number> {
    return await this.db.vendas.count({
      where: { clienteId },
    });
  }

  async getTotalVendasByCliente(clienteId: string): Promise<number> {
    const result = await this.db.vendas.aggregate({
      where: { clienteId },
      _sum: {
        total: true,
      },
    });

    return result._sum.total || 0;
  }
}
