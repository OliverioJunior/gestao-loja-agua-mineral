import { NextResponse } from "next/server";
import { PedidoService } from "@/core/pedidos/domain/pedido.service";
import { PedidoRepository } from "@/core/pedidos/domain/pedido.repository";
import { getCurrentUser } from "@/shared/lib/user";
import { StatusCode } from "@/core/error";

const pedidoService = new PedidoService(new PedidoRepository());

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const stats = await pedidoService.getStatistics();

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas dos pedidos:", error);

    return NextResponse.json(
      {
        error: `${
          error instanceof Error ? error.message : "Erro interno do servidor"
        }`,
      },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
