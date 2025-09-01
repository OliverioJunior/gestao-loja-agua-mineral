import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure";
import { getCurrentUser } from "@/shared/lib/user";
import { StatusCode } from "@/core/error";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: StatusCode.UNAUTHORIZED }
      );
    }

    // Buscar os 5 pedidos mais recentes
    const recentOrders = await prisma.pedido.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        status: {
          equals: "PENDENTE",
        },
      },
      include: {
        cliente: {
          select: {
            nome: true,
          },
        },
      },
    });

    // Mapear pedidos para o formato esperado
    const formattedOrders = recentOrders.map((order) => ({
      id: `#${order.id.slice(-6).toUpperCase()}`, // Usar últimos 6 caracteres do ID
      customer: order.cliente?.nome || "Cliente Desconhecido",
      value: order.total / 100, // Valor já está em centavos
      status: order.status.toLowerCase(), // Converter para lowercase
      date: order.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedOrders, { status: StatusCode.OK });
  } catch (error) {
    console.error("Erro ao buscar pedidos recentes:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
