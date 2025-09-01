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

    // Buscar produtos com estoque baixo ou crítico
    const lowStockProducts = await prisma.produto.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                estoque: {
                  lte: prisma.produto.fields.estoqueMinimo,
                },
              },
              {
                estoque: 0,
              },
            ],
          },
          {
            ativo: true,
          },
        ],
      },
      select: {
        id: true,
        nome: true,
        estoque: true,
        estoqueMinimo: true,
      },
      orderBy: [
        {
          estoque: "asc", // Produtos com menor estoque primeiro
        },
        {
          nome: "asc",
        },
      ],
      take: 10, // Limitar a 10 produtos para não sobrecarregar
    });

    // Mapear produtos para o formato esperado
    const stockAlerts = lowStockProducts.map((product) => {
      let status: "low" | "critical";

      if (product.estoque === 0) {
        status = "critical";
      } else if (product.estoque <= (product.estoqueMinimo || 0)) {
        status = "low";
      } else {
        status = "low"; // Fallback
      }

      return {
        id: product.id,
        product: product.nome,
        currentStock: product.estoque,
        minimumStock: product.estoqueMinimo,
        status,
      };
    });

    return NextResponse.json(stockAlerts, { status: StatusCode.OK });
  } catch (error) {
    console.error("Erro ao buscar alertas de estoque:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
