import { NextRequest, NextResponse } from "next/server";
import { PedidoService } from "@/core/pedidos/pedido.service";
import { PedidoRepository } from "@/core/pedidos/pedido.repository";

import { StatusCode } from "@/core/error";
import { getCurrentUser } from "@/shared/lib/user";

const pedidoService = new PedidoService(new PedidoRepository());

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: StatusCode.UNAUTHORIZED }
      );
    }

    const id = request.url.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "ID do pedido é obrigatório" },
        { status: StatusCode.BAD_REQUEST }
      );
    }

    // Buscar pedido por ID usando findAll e filtrar
    const pedido = await pedidoService.findById(id);

    if (!pedido) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: StatusCode.NOT_FOUND }
      );
    }

    return NextResponse.json(pedido, { status: StatusCode.OK });
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
