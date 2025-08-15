import { NextRequest, NextResponse } from "next/server";
import { PedidoService } from "@/core/pedidos/pedido.service";
import { PedidoRepository } from "@/core/pedidos/pedido.repository";
import { getCurrentUser } from "@/shared/lib/user";
import { UpdatePedidoInput } from "@/core/pedidos/pedido.entity";
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
    
    // Validar ID do pedido
    if (!body.id) {
      return NextResponse.json(
        { error: "ID do pedido é obrigatório" },
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

    // Preparar dados para atualização
    const updateData: UpdatePedidoInput = {
      atualizadoPorId: currentUser.id,
    };

    // Adicionar campos opcionais se fornecidos
    if (body.total !== undefined) updateData.total = Number(body.total);
    if (body.status !== undefined) updateData.status = body.status;
    if (body.tipoEntrega !== undefined) updateData.tipoEntrega = body.tipoEntrega;
    if (body.formaPagamento !== undefined) updateData.formaPagamento = body.formaPagamento;
    if (body.enderecoEntrega !== undefined) updateData.enderecoEntrega = body.enderecoEntrega;
    if (body.observacoes !== undefined) updateData.observacoes = body.observacoes;
    if (body.desconto !== undefined) updateData.desconto = Number(body.desconto);
    if (body.taxaEntrega !== undefined) updateData.taxaEntrega = Number(body.taxaEntrega);

    const pedidoAtualizado = await pedidoService.update(body.id, updateData);

    return NextResponse.json(pedidoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    
    if (error instanceof Error) {
      if (error.name === "PedidoNotFoundError") {
        return NextResponse.json(
          { error: error.message },
          { status: StatusCode.NOT_FOUND }
        );
      }

      if (error.name === "PedidoValidation" || error.name === "PedidoBusinessRulesError") {
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