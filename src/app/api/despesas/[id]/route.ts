import { NextRequest, NextResponse } from "next/server";
import {
  DespesaService,
  DespesaRepository,
  IUpdateDespesa,
} from "@/core/despesas";
import { prisma } from "@/infrastructure";
import { getCurrentUser } from "@/shared/lib/user";
import { StatusCode } from "@/core/error";
import {
  CategoriaDespesa,
  FormaPagamentoDespesa,
} from "@/infrastructure/generated/prisma";

const despesaRepository = new DespesaRepository(prisma);
const despesaService = new DespesaService(despesaRepository);

// GET - Buscar despesa por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: StatusCode.UNAUTHORIZED }
      );
    }

    const { id } = params;
    const result = await despesaService.getDespesaById(id);

    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    console.error("Erro ao buscar despesa:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}

// PUT - Atualizar despesa
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: StatusCode.UNAUTHORIZED }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Preparar dados de atualização
    const updateData: IUpdateDespesa = {
      atualizadoPorId: user.id,
    };

    if (body.descricao !== undefined) {
      updateData.descricao = body.descricao;
    }

    if (body.valor !== undefined) {
      updateData.valor = parseInt(body.valor);
    }

    if (body.data !== undefined) {
      updateData.data = new Date(body.data);
    }

    if (body.categoria !== undefined) {
      updateData.categoria = body.categoria as CategoriaDespesa;
    }

    if (body.formaPagamento !== undefined) {
      updateData.formaPagamento = body.formaPagamento as FormaPagamentoDespesa;
    }

    if (body.observacoes !== undefined) {
      updateData.observacoes = body.observacoes;
    }

    const result = await despesaService.updateDespesa(id, updateData, user.id);

    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    console.error("Erro ao atualizar despesa:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}

// DELETE - Excluir despesa
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: StatusCode.UNAUTHORIZED }
      );
    }

    const { id } = params;
    const result = await despesaService.deleteDespesa(id);

    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    console.error("Erro ao excluir despesa:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
