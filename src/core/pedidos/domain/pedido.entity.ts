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

export type CreatePedidoInput = Omit<Prisma.PedidoCreateInput, "criadoPor"> & {
  clienteId: string;
  criadoPorId: string;
  itens: { produtoId: string; quantidade: number; preco: number }[];
};

export type UpdatePedidoInput = Prisma.PedidoUncheckedUpdateInput;

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface IPedidoRepository {
  create(data: CreatePedidoInput): Promise<TPedido>;
  update(id: string, data: UpdatePedidoInput): Promise<TPedido>;
  delete(id: string): Promise<TPedido>;
  findAll(): Promise<TPedidoWithRelations[]>;
  findAllPaginated(
    page: number,
    limit: number,
    filters?: {
      clienteId?: string;
      status?: StatusPedido;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<IPaginatedResponse<TPedidoWithRelations>>;
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
  | "pix"
  | "boleto";

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
