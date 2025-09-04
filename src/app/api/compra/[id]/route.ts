import { NextRequest, NextResponse } from "next/server";
import { CompraRepository } from "@/core/compra/domain/compra.repository";
import { UpdateCompraInput } from "@/core/compra/domain/compra.entity";
import { getCurrentUser } from "@/shared/lib/user";

// GET - Buscar compra por ID
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    const compraRepository = new CompraRepository();
    const compra = await compraRepository.findById(id || "");

    if (!compra) {
      return NextResponse.json(
        {
          success: false,
          error: "Compra não encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: compra,
      message: "Compra encontrada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao buscar compra:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

// PUT - Atualizar compra
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Usuário não autenticado",
        },
        { status: 401 }
      );
    }
    const body = await request.json();

    const updateData: UpdateCompraInput = {
      numeroNota: body.numeroNota || null,
      dataCompra: body.dataCompra ? new Date(body.dataCompra) : undefined,
      dataVencimento: body.dataVencimento
        ? new Date(body.dataVencimento)
        : null,
      total: body.total,
      desconto: body.desconto || null,
      frete: body.frete || null,
      impostos: body.impostos || null,
      formaPagamento: body.formaPagamento,
      status: body.status,
      observacoes: body.observacoes || null,
      atualizadoPorId: user.id,
    };

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    console.log({ status: updateData.status });
    const compraRepository = new CompraRepository();
    const compra = await compraRepository.update(id || "", updateData);

    return NextResponse.json({
      success: true,
      data: compra,
      message: "Compra atualizada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar compra:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

// DELETE - Excluir compra
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    const compraRepository = new CompraRepository();
    await compraRepository.delete(id || "");

    return NextResponse.json({
      success: true,
      message: "Compra excluída com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir compra:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
