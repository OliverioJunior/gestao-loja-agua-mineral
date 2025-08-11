import { StatusCode } from "@/core/error/statusCode.enum";

import { UsuarioRepository } from "@/core/usuário/usuario.repository";
import { UsuarioService } from "@/core/usuário/usuario.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const usuarioService = new UsuarioService(new UsuarioRepository());
    const usuarios = await usuarioService.findAll();
    return NextResponse.json(usuarios);
  } catch {
    return NextResponse.json(
      { message: "Erro interno no servidor ao buscar usuários" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
