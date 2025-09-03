import {
  Pedido,
  StatusPedido,
  Prisma,
} from "@/infrastructure/generated/prisma";

export type TPedido = Pedido;

export const pedidoWithRelationsInclude = {
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
} satisfies Prisma.PedidoInclude;

export type TPedidoWithRelations = Prisma.PedidoGetPayload<{
  include: typeof pedidoWithRelationsInclude;
}>;
export type TPedidoComplete = Prisma.PedidoGetPayload<{
  include: {
    cliente: true;
    itens: {
      include: {
        produto: {
          include: {
            categoria: true;
          };
        };
      };
    };
  };
}>;

export type CreatePedidoInput = Omit<
  TPedido,
  "id" | "createdAt" | "updatedAt" | "data"
> & {
  // Campos adicionais para criação
  tipoEntrega?: "balcao" | "entrega";
  formaPagamento?: "dinheiro" | "cartao_debito" | "cartao_credito" | "pix";
  enderecoEntrega?: string;
  observacoes?: string;
  desconto?: number;
  taxaEntrega?: number;
};

export type UpdatePedidoInput = Partial<
  Omit<CreatePedidoInput, "clienteId">
> & {
  status?: StatusPedido;
};

export interface IPedidoRepository {
  create(data: CreatePedidoInput): Promise<TPedido>;
  update(id: string, data: UpdatePedidoInput): Promise<TPedido>;
  delete(id: string): Promise<TPedido>;
  findAll(): Promise<TPedidoWithRelations[]>;
  findById(id: string): Promise<TPedidoWithRelations | null>;
  findByClienteId(clienteId: string): Promise<TPedidoWithRelations[]>;
  findByStatus(status: StatusPedido): Promise<TPedidoWithRelations[]>;
  findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<TPedidoWithRelations[]>;
  existsById(id: string): Promise<boolean>;
  calculateTotalByPeriod(startDate: Date, endDate: Date): Promise<number>;
  getStatistics(): Promise<{
    total: number;
    pendentes: number;
    confirmados: number;
    preparando: number;
    entregues: number;
    cancelados: number;
    faturamentoMensal: number;
  }>;
  findActivePedidoByCliente(clienteId: string): Promise<TPedido | null>;
  updateStatus(
    id: string,
    status: StatusPedido,
    userId: string
  ): Promise<TPedido>;
}

// Enums e tipos auxiliares
export { StatusPedido };

export type TipoEntrega = "balcao" | "entrega";
export type FormaPagamento =
  | "dinheiro"
  | "cartao_debito"
  | "cartao_credito"
  | "pix";

export interface IPedidoStats {
  total: number;
  pendentes: number;
  confirmados: number;
  preparando: number;
  entregues: number;
  cancelados: number;
  faturamentoMensal: number;
  ticketMedio: number;
}
