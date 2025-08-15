import { NextRequest, NextResponse } from "next/server";
import { PedidoService } from "@/core/pedidos/pedido.service";
import { PedidoRepository } from "@/core/pedidos/pedido.repository";
import { getCurrentUser } from "@/shared/lib/user";
import { StatusPedido } from "@/core/pedidos/pedido.entity";

const pedidoService = new PedidoService(new PedidoRepository());

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get("clienteId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let pedidos;

    if (clienteId) {
      pedidos = await pedidoService.findByClienteId(clienteId);
    } else if (status) {
      // Validar se o status é válido
      const validStatuses = Object.values(StatusPedido);
      if (!validStatuses.includes(status as StatusPedido)) {
        return NextResponse.json(
          { error: "Status inválido" },
          { status: 400 }
        );
      }
      pedidos = await pedidoService.findByStatus(status as StatusPedido);
    } else if (startDate && endDate) {
      pedidos = await pedidoService.findByDateRange(
        new Date(startDate),
        new Date(endDate)
      );
    } else {
      pedidos = await pedidoService.findAll();
    }

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}