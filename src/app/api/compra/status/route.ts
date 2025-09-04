import { NextRequest, NextResponse } from "next/server";
import { CompraService } from "@/core/compra/domain/compra.service";
import { CompraRepository } from "@/core/compra/domain/compra.repository";
import { StatusCompra } from "@/infrastructure/generated/prisma";
import { getCurrentUser } from "@/shared/lib/user";

// POST - Atualizar status da compra
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { compraId, status } = body;

    if (!compraId || !status) {
      return NextResponse.json(
        {
          success: false,
          error: "ID da compra e status são obrigatórios",
        },
        { status: 400 }
      );
    }

    const userIdToUse = currentUser?.id || "system"; // TODO: Obter do contexto de autenticação
    const compraRepository = new CompraRepository();
    const compraService = new CompraService(compraRepository);
    let compra;

    switch (status) {
      case "CONFIRMADA":
        compra = await compraService.confirmarCompra(compraId, userIdToUse);
        break;
      case "RECEBIDA":
        compra = await compraService.receberCompra(compraId, userIdToUse);
        break;
      case "CANCELADA":
        compra = await compraService.cancelarCompra(compraId, userIdToUse);
        break;
      default:
        compra = await compraService.updateStatus(
          compraId,
          status as StatusCompra,
          userIdToUse
        );
    }

    return NextResponse.json({
      success: true,
      data: compra,
      message: `Compra ${status.toLowerCase()} com sucesso`,
    });
  } catch (error) {
    console.error("Erro ao atualizar status da compra:", error);
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
