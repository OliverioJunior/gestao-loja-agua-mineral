import { StatusCode } from "@/core/error";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/user";
import { ClienteRepository } from "@/core/cliente/cliente.repository";
import { ClienteService } from "@/core/cliente/cliente.service";
import { Client } from "@/core/cliente/cliente";

export async function POST(req: NextRequest) {
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

    const clienteData = {
      ...body,
      criadoPorId: currentUser.id,
      atualizadoPorId: currentUser.id,
    };

    const data = new Client(clienteData, "create").validationData();

    console.log({ data });
    const cliente = await clienteService.create(data);

    return NextResponse.json(cliente);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao criar cliente" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
