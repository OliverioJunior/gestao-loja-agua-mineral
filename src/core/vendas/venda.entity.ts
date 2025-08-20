import { Vendas, Prisma } from "@/infrastructure/generated/prisma";

export type TVendas = Vendas;

export const vendaWithRelationsInclude = {
  cliente: true,
  pedido: true,
} satisfies Prisma.VendasInclude;

export type TVendaWithRelations = Prisma.VendasGetPayload<{
  include: typeof vendaWithRelationsInclude;
}>;

export const vendaCompleteInclude = {
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
} satisfies Prisma.VendasInclude;

export type TVendaComplete = Prisma.VendasGetPayload<{
  include: typeof vendaCompleteInclude;
}>;

export type CreateVendaInput = Omit<
  TVendas,
  "id" | "createdAt" | "updatedAt" | "data"
>;

export type UpdateVendaInput = Partial<
  Omit<CreateVendaInput, "clienteId" | "pedidoId">
>;

export interface IVendaRepository {
  create(data: CreateVendaInput): Promise<TVendas>;
  update(id: string, data: UpdateVendaInput): Promise<TVendas>;
  delete(id: string): Promise<TVendas>;
  findAll(): Promise<TVendaWithRelations[]>;
  findById(id: string): Promise<TVendaComplete | null>;
  findByClienteId(clienteId: string): Promise<TVendaWithRelations[]>;
  findByPedidoId(pedidoId: string): Promise<TVendas | null>;
  findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<TVendaWithRelations[]>;
  existsById(id: string): Promise<boolean>;
  existsByPedidoId(pedidoId: string): Promise<boolean>;
  calculateTotalByPeriod(startDate: Date, endDate: Date): Promise<number>;
  getStatistics(): Promise<{
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
  }>;
  getTopClientes(limit?: number): Promise<
    {
      clienteId: string;
      nomeCliente: string;
      totalCompras: number;
      quantidadeCompras: number;
    }[]
  >;
  getVendasByMonth(year: number): Promise<
    {
      mes: number;
      totalVendas: number;
      faturamento: number;
    }[]
  >;
}

// Tipos auxiliares
export type FormaPagamentoVenda =
  | "dinheiro"
  | "cartao_debito"
  | "cartao_credito"
  | "pix";
