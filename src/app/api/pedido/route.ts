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
       if (startDate) {
         // Criar data no fuso horário do Brasil (UTC-3)
         const startDateBR = new Date(startDate + 'T00:00:00.000-03:00');
         filters.startDate = startDateBR;
       }
       if (endDate) {
         // Criar data no fuso horário do Brasil (UTC-3)
         const endDateBR = new Date(endDate + 'T23:59:59.999-03:00');
         filters.endDate = endDateBR;
       }
       
       result = await pedidoService.findAllPaginated(page, limit, filters);
    } else {
      // Usar sempre paginação para garantir filtros combinados
      const filters: {
        clienteId?: string;
        status?: StatusPedido;
        startDate?: Date;
        endDate?: Date;
      } = {};
      
      if (clienteId) filters.clienteId = clienteId;
       if (status) filters.status = status as StatusPedido;
       if (startDate) {
         // Criar data no fuso horário do Brasil (UTC-3)
         const startDateBR = new Date(startDate + 'T00:00:00.000-03:00');
         filters.startDate = startDateBR;
       }
       if (endDate) {
         // Criar data no fuso horário do Brasil (UTC-3)
         const endDateBR = new Date(endDate + 'T23:59:59.999-03:00');
         filters.endDate = endDateBR;
       }
      
      // Usar paginação com limite alto para simular busca sem paginação
      const paginatedResult = await pedidoService.findAllPaginated(1, 1000, filters);
      result = paginatedResult.data;
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
