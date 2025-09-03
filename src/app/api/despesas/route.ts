import { NextRequest, NextResponse } from "next/server";
import {
  DespesaService,
  DespesaRepository,
  ICreateDespesa,
} from "@/core/despesas/domain";
import { prisma } from "@/infrastructure";
import { getCurrentUser } from "@/shared/lib/user";
import { StatusCode } from "@/core/error";
import {
  CategoriaDespesa,
  FormaPagamentoDespesa,
} from "@/infrastructure/generated/prisma";

const despesaRepository = new DespesaRepository(prisma);
const despesaService = new DespesaService(despesaRepository);

// GET - Listar despesas
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: StatusCode.UNAUTHORIZED }
      );
    }

    const { searchParams } = new URL(request.url);

    const filters: {
      searchTerm?: string;
      categoria?: CategoriaDespesa;
      formaPagamento?: FormaPagamentoDespesa;
      dataInicio?: Date;
      dataFim?: Date;
      valorMinimo?: number;
      valorMaximo?: number;
    } = {
      searchTerm: undefined,
      categoria: undefined,
      formaPagamento: undefined,
      dataInicio: undefined,
      dataFim: undefined,
      valorMinimo: undefined,
      valorMaximo: undefined,
    };

    // Filtros de busca
    const search = searchParams.get("search");
    if (search) {
      filters.searchTerm = search;
    }

    // Filtro de categoria
    const categoria = searchParams.get("categoria");
    if (
      categoria &&
      Object.values(CategoriaDespesa).includes(categoria as CategoriaDespesa)
    ) {
      filters.categoria = categoria as CategoriaDespesa;
    }

    // Filtro de forma de pagamento
    const formaPagamento = searchParams.get("formaPagamento");
    if (
      formaPagamento &&
      Object.values(FormaPagamentoDespesa).includes(
        formaPagamento as FormaPagamentoDespesa
      )
    ) {
      filters.formaPagamento = formaPagamento as FormaPagamentoDespesa;
    }

    // Filtros de data
    const dataInicio = searchParams.get("dataInicio");
    if (dataInicio) {
      filters.dataInicio = new Date(dataInicio);
    }

    const dataFim = searchParams.get("dataFim");
    if (dataFim) {
      filters.dataFim = new Date(dataFim);
    }

    // Filtros de valor
    const valorMinimo = searchParams.get("valorMinimo");
    if (valorMinimo) {
      filters.valorMinimo = parseInt(valorMinimo);
    }

    const valorMaximo = searchParams.get("valorMaximo");
    if (valorMaximo) {
      filters.valorMaximo = parseInt(valorMaximo);
    }

    const result = await despesaService.getAllDespesas(filters);

    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    console.error("Erro ao buscar despesas:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}

// POST - Criar despesa
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: StatusCode.UNAUTHORIZED }
      );
    }

    const body = await request.json();

    // Validar e converter dados
    const despesaData: ICreateDespesa = {
      descricao: body.descricao,
      valor: parseInt(body.valor), // Converter para centavos se necessário
      data: new Date(body.data),
      categoria: body.categoria as CategoriaDespesa,
      formaPagamento: body.formaPagamento as FormaPagamentoDespesa,
      observacoes: body.observacoes,
      criadoPorId: user.id,
      atualizadoPor: {
        connect: {
          id: user.id,
        },
      },
      criadoPor: {
        connect: {
          id: user.id,
        },
      },
    };

    const result = await despesaService.createDespesa(despesaData, user.id);

    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    console.error("Erro ao criar despesa:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
