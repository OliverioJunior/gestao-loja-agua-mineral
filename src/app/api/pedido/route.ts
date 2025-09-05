import { NextRequest, NextResponse } from "next/server";
import { PedidoService } from "@/core/pedidos/domain/pedido.service";
import { PedidoRepository } from "@/core/pedidos/domain/pedido.repository";
import { getCurrentUser } from "@/shared/lib/user";
import { StatusPedido } from "@/core/pedidos/domain";

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
    
    // Parâmetros de paginação
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const usePagination = searchParams.get("paginated") === "true";
    
    // Parâmetros de filtro
    const clienteId = searchParams.get("clienteId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Validar parâmetros de paginação
    if (page < 1) {
      return NextResponse.json(
        { error: "Número da página deve ser maior que 0" },
        { status: 400 }
      );
    }
    
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Limite deve estar entre 1 e 100" },
        { status: 400 }
      );
    }

    // Validar status se fornecido
    if (status) {
      const validStatuses = Object.values(StatusPedido);
      if (!validStatuses.includes(status as StatusPedido)) {
        return NextResponse.json({ error: "Status inválido" }, { status: 400 });
      }
    }

    let result;

    if (usePagination) {
       // Usar paginação com filtros opcionais
       const filters: {
         clienteId?: string;
         status?: StatusPedido;
         startDate?: Date;
         endDate?: Date;
       } = {};
       
       if (clienteId) filters.clienteId = clienteId;
       if (status) filters.status = status as StatusPedido;
       if (startDate) filters.startDate = new Date(startDate);
       if (endDate) filters.endDate = new Date(endDate);
       
       result = await pedidoService.findAllPaginated(page, limit, filters);
    } else {
      // Manter compatibilidade com a API existente (sem paginação)
      let pedidos;
      
      if (clienteId) {
        pedidos = await pedidoService.findByClienteId(clienteId);
      } else if (status) {
        pedidos = await pedidoService.findByStatus(status as StatusPedido);
      } else if (startDate && endDate) {
        pedidos = await pedidoService.findByDateRange(
          new Date(startDate),
          new Date(endDate)
        );
      } else {
        pedidos = await pedidoService.findAll();
      }
      
      result = pedidos;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
