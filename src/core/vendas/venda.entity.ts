import { Vendas, Prisma } from "@/infrastructure/generated/prisma";

export type TVenda = Vendas;

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
  TVenda,
  "id" | "createdAt" | "updatedAt" | "data"
> & {
  // Campos adicionais para criação
  formaPagamento?: "dinheiro" | "cartao_debito" | "cartao_credito" | "pix";
  observacoes?: string;
  desconto?: number;
  troco?: number;
};

export type UpdateVendaInput = Partial<
  Omit<CreateVendaInput, "clienteId" | "pedidoId">
>;

export interface IVendaRepository {
  create(data: CreateVendaInput): Promise<TVenda>;
  update(id: string, data: UpdateVendaInput): Promise<TVenda>;
  delete(id: string): Promise<TVenda>;
  findAll(): Promise<TVendaWithRelations[]>;
  findById(id: string): Promise<TVendaComplete | null>;
  findByClienteId(clienteId: string): Promise<TVendaWithRelations[]>;
  findByPedidoId(pedidoId: string): Promise<TVenda | null>;
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

export interface IVendaStats {
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
  crescimentoMensal: number;
  metaMensal?: number;
  percentualMeta?: number;
}

export interface ITopCliente {
  clienteId: string;
  nomeCliente: string;
  totalCompras: number;
  quantidadeCompras: number;
  ultimaCompra: Date;
}

export interface IVendaMensal {
  mes: number;
  nomesMes: string;
  totalVendas: number;
  faturamento: number;
  crescimento: number;
}
