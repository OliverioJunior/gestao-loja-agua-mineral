import {
  CategoriaDespesa,
  FormaPagamentoDespesa,
  Prisma,
} from "@/infrastructure/generated/prisma";

export interface ICreateDespesa extends Prisma.DespesaCreateInput {
  criadoPorId?: string;
}

export interface IUpdateDespesa extends Prisma.DespesaUpdateInput {
  atualizadoPorId?: string;
}

export interface IDespesaStats {
  totalDespesas: number;
  totalMes: number;
  totalAno: number;
  despesasPorCategoria: Array<{
    categoria: CategoriaDespesa;
    total: number;
    count: number;
  }>;
  despesasPorFormaPagamento: Array<{
    formaPagamento: FormaPagamentoDespesa;
    total: number;
    count: number;
  }>;
}

export interface IDespesaFilters {
  dataInicio?: Date;
  dataFim?: Date;
  categoria?: CategoriaDespesa;
  formaPagamento?: FormaPagamentoDespesa;
  valorMinimo?: number;
  valorMaximo?: number;
  searchTerm?: string;
}

export type TDespesaWithUser = Prisma.DespesaGetPayload<{
  include: {
    criadoPor: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    atualizadoPor: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;
