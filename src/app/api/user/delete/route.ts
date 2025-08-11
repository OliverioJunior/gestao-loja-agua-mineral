import { StatusCode } from "@/core/error";
import { UsuarioRepository } from "@/core/usuário/usuario.repository";
import { UsuarioService } from "@/core/usuário/usuario.service";

import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const usuarioService = new UsuarioService(new UsuarioRepository());
    const body = await req.json();

    const usuario = await usuarioService.delete(body.id);

    return NextResponse.json(usuario);
  } catch {
    return NextResponse.json(
      { message: "Erro interno no servidor ao deletar usuário" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
