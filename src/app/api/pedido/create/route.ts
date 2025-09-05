import { NextRequest, NextResponse } from "next/server";
import { PedidoService } from "@/core/pedidos/domain/pedido.service";
import { PedidoRepository } from "@/core/pedidos/domain/pedido.repository";
import { getCurrentUser } from "@/shared/lib/user";

import { StatusCode } from "@/core/error";
import { prisma } from "@/infrastructure";
import { CreatePedidoInput } from "@/core/pedidos/domain";

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

    const { itens, ...pedidoData } = body;

    const success = await prisma.$transaction(async (tx) => {
      const pedidoService = new PedidoService(new PedidoRepository(tx));
      const itensService: {
        criadoPorId: string;
        pedidoId: string | null;
        produtoId: string;
        quantidade: number;
        preco: number;
      }[] = itens;

      const total =
        itensService.reduce((acc, item) => {
          return acc + item.preco * item.quantidade;
        }, 0) -
        pedidoData.desconto +
        pedidoData.taxaEntrega;
      const pedidoToCreate: CreatePedidoInput = {
        ...pedidoData,
        itens: itensService,
        total,
        status: "PENDENTE",
        criadoPorId: currentUser.id,
      };
      const pedidoCreated = await pedidoService.create(pedidoToCreate);

      return { itens: pedidoCreated };
    });

    return NextResponse.json(success, { status: 201 });
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
