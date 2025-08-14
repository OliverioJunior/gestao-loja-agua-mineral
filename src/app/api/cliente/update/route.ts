import { ClienteService } from "@/core/cliente/cliente.service";
import { ClienteRepository } from "@/core/cliente/cliente.repository";

import { StatusCode } from "@/core/error";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/user";
import { Client } from "@/core/cliente/cliente";

export async function PUT(req: NextRequest) {
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
    const { id, ...clienteToUpdate } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID do cliente é obrigatório" },
        { status: StatusCode.BAD_REQUEST }
      );
    }

    clienteToUpdate.atualizadoPorId = currentUser.id;

    // Converter data de aniversário se fornecida
    if (clienteToUpdate.aniversario) {
      clienteToUpdate.aniversario = new Date(clienteToUpdate.aniversario);
    }

    const data = new Client(clienteToUpdate, "update").validationData();

    const cliente = await clienteService.update(id, data);

    return NextResponse.json(cliente);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao atualizar cliente" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
