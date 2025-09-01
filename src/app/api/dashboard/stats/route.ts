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

    // Data de hoje
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    // Data de ontem
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const startOfYesterday = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );
    const endOfYesterday = new Date(
      startOfYesterday.getTime() + 24 * 60 * 60 * 1000
    );

    // Início do mês atual
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Buscar vendas de hoje
    const todaySales = await prisma.vendas.aggregate({
      where: {
        createdAt: {
          gte: startOfToday,
          lt: endOfToday,
        },
      },
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
    });

    // Buscar vendas de ontem
    const yesterdaySales = await prisma.vendas.aggregate({
      where: {
        createdAt: {
          gte: startOfYesterday,
          lt: endOfYesterday,
        },
      },
      _sum: {
        total: true,
      },
    });

    // Buscar vendas do mês
    const monthSales = await prisma.vendas.aggregate({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
      _sum: {
        total: true,
      },
    });

    // Buscar total de pedidos hoje
    const todayOrdersCount = await prisma.pedido.count({
      where: {
        createdAt: {
          gte: startOfToday,
          lt: endOfToday,
        },
      },
    });

    // Buscar produtos com estoque baixo
    const lowStockProducts = await prisma.produto.count({
      where: {
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
        ativo: true,
      },
    });

    // Calcular percentual da meta mensal (assumindo meta de R$ 50.000)
    const monthlyGoal = 50000; // Meta em centavos (R$ 500,00)
    const monthlyGoalPercentage = monthSales._sum.total
      ? Math.round((monthSales._sum.total / monthlyGoal) * 100)
      : 0;

    // Calcular crescimento em relação a ontem
    const todayGrowthPercentage =
      yesterdaySales._sum.total && yesterdaySales._sum.total > 0
        ? (((todaySales._sum.total || 0) - yesterdaySales._sum.total) /
            yesterdaySales._sum.total) *
          100
        : 0;

    const stats = {
      today: (todaySales._sum.total || 0) / 100,
      yesterday: (yesterdaySales._sum.total || 0) / 100,
      thisMonth: (monthSales._sum.total || 0) / 100,
      orders: todayOrdersCount,
      lowStockCount: lowStockProducts,
      todayOrdersCount,
      monthlyGoalPercentage,
      todayGrowthPercentage: Math.round(todayGrowthPercentage * 10) / 10, // Arredondar para 1 casa decimal
    };

    return NextResponse.json(stats, { status: StatusCode.OK });
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
