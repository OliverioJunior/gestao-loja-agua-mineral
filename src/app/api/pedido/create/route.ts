import { NextRequest, NextResponse } from "next/server";
import { PedidoService } from "@/core/pedidos/pedido.service";
import { PedidoRepository } from "@/core/pedidos/pedido.repository";
import { getCurrentUser } from "@/shared/lib/user";
import { CreatePedidoInput } from "@/core/pedidos/pedido.entity";
import { StatusCode } from "@/core/error";

const pedidoService = new PedidoService(new PedidoRepository());

export async function POST(request: NextRequest) {
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
    if (!body.clienteId || !body.total || !body.status) {
      return NextResponse.json(
        { error: "Campos obrigatórios: clienteId, total, status" },
        { status: 400 }
      );
    }

    // Preparar dados para criação
    const pedidoData: CreatePedidoInput = {
      clienteId: body.clienteId,
      total: Number(body.total),
      status: body.status,
      criadoPorId: currentUser.id,
      atualizadoPorId: currentUser.id,
      tipoEntrega: body.tipoEntrega,
      formaPagamento: body.formaPagamento,
      enderecoEntrega: body.enderecoEntrega,
      observacoes: body.observacoes,
      desconto: body.desconto ? Number(body.desconto) : 0,
      taxaEntrega: body.taxaEntrega ? Number(body.taxaEntrega) : 0,
    };

    const pedido = await pedidoService.create(pedidoData);

    return NextResponse.json(pedido, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);

    if (error instanceof Error) {
      if (
        error.name === "PedidoValidation" ||
        error.name === "PedidoBusinessRulesError"
      ) {
        return NextResponse.json(
          { error: error.message },
          { status: StatusCode.BAD_REQUEST }
        );
      }

      if (error.name === "PedidoConflictError") {
        return NextResponse.json(
          { error: error.message },
          { status: StatusCode.CONFLICT_ERROR }
        );
      }
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
