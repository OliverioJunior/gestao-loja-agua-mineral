import { StatusCode } from "@/core/error";
import { UpdateUsuarioInput } from "@/core/usuário/domain/usuario.entity";
import { UsuarioRepository } from "@/core/usuário/domain/usuario.repository";
import { UsuarioService } from "@/core/usuário/domain/usuario.service";
import { User } from "@/core/usuário/domain/usuario";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const usuarioService = new UsuarioService(new UsuarioRepository());
    const body = await req.json();
    const user = new User(
      body,
      "update"
    ).validationData() as UpdateUsuarioInput;

    const usuario = await usuarioService.update(body.id, user);

    return NextResponse.json(usuario);
  } catch {
    return NextResponse.json(
      { message: "Erro interno no servidor ao atualizar usuário" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
