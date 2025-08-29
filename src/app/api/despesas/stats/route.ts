import { NextRequest, NextResponse } from "next/server";
import { DespesaService, DespesaRepository } from "@/core/despesas";
import { prisma } from "@/infrastructure";
import { getCurrentUser } from "@/shared/lib/user";
import { StatusCode } from "@/core/error";
import { getCurrentMonthRange } from "@/layout/despesas";

const despesaRepository = new DespesaRepository(prisma);
const despesaService = new DespesaService(despesaRepository);

// GET - Buscar estatísticas de despesas
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

    const filters: { dataInicio?: Date; dataFim?: Date } = {
      dataInicio: undefined,
      dataFim: undefined,
    };
    if (!filters.dataInicio && !filters.dataFim) {
      const { firstDay, lastDay } = getCurrentMonthRange();
      filters.dataInicio = firstDay;
      filters.dataFim = lastDay;
    }

    // Filtros de data para estatísticas
    const dataInicio = searchParams.get("dataInicio");
    if (dataInicio) {
      filters.dataInicio = new Date(dataInicio);
    }

    const dataFim = searchParams.get("dataFim");
    if (dataFim) {
      filters.dataFim = new Date(dataFim);
    }

    const result = await despesaService.getDespesasStats(filters);

    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    console.error("Erro ao buscar estatísticas de despesas:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
