import { NextResponse } from "next/server";
import { CompraRepository } from "@/core/compra/domain/compra.repository";

// GET - Obter estatísticas das compras
export async function GET() {
  try {
    const compraRepository = new CompraRepository();
    const stats = await compraRepository.getStatistics();

    return NextResponse.json({
      success: true,
      data: stats,
      message: "Estatísticas obtidas com sucesso",
    });
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
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
