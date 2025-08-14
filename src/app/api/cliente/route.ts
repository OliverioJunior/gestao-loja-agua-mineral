import { StatusCode } from "@/core/error/statusCode.enum";
import { ClienteRepository } from "@/core/cliente/cliente.repository";
import { ClienteService } from "@/core/cliente/cliente.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clienteService = new ClienteService(new ClienteRepository());
    const clientes = await clienteService.findAll();
    return NextResponse.json(clientes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao buscar clientes" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
