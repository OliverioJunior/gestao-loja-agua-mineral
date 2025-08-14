import { StatusCode } from "@/core/error";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/user";
import { ClienteService } from "@/core/cliente/cliente.service";
import { ClienteRepository } from "@/core/cliente/cliente.repository";

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: StatusCode.UNAUTHORIZED }
      );
    }

    const clienteService = new ClienteService(new ClienteRepository());
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID do cliente é obrigatório" },
        { status: StatusCode.BAD_REQUEST }
      );
    }

    const cliente = await clienteService.delete(id);

    return NextResponse.json(cliente);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao deletar cliente" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
