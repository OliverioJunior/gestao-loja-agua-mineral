import { StatusCode } from "@/core/error";
import { VendaRepository, VendaService } from "@/core/vendas/domain";
import { getCurrentUser } from "@/shared/lib/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: StatusCode.UNAUTHORIZED }
      );
    }
    const vendasService = new VendaService(new VendaRepository());

    const venda = await vendasService.findAll();

    return NextResponse.json(venda);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao criar cliente" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
