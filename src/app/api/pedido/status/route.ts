import { NextRequest, NextResponse } from "next/server";
import { PedidoService } from "@/core/pedidos/domain/pedido.service";
import { PedidoRepository } from "@/core/pedidos/domain/pedido.repository";
import { getCurrentUser } from "@/shared/lib/user";
import { StatusCode } from "@/core/error";

const pedidoService = new PedidoService(new PedidoRepository());

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validar campos obrigatórios
    if (!body.id || !body.status) {
      return NextResponse.json(
        { error: "ID do pedido e status são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o pedido existe
    const pedidoExistente = await pedidoService.findById(body.id);
    if (!pedidoExistente) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    const pedidoAtualizado = await pedidoService.updateStatus(
      body.id,
      body.status,
      currentUser.id
    );

    return NextResponse.json(pedidoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);

    if (error instanceof Error) {
      if (error.name === "PedidoNotFoundError") {
        return NextResponse.json(
          { error: error.message },
          { status: StatusCode.NOT_FOUND }
        );
      }

      if (
        error.name === "PedidoValidation" ||
        error.name === "PedidoBusinessRulesError"
      ) {
        return NextResponse.json(
          { error: error.message },
          { status: StatusCode.BAD_REQUEST }
        );
      }
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
