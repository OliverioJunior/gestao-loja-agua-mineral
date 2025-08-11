import { StatusCode } from "@/core/error";
import { User } from "@/core/usuário/usuario";
import { CreateUsuarioInput } from "@/core/usuário/usuario.entity";
import { UsuarioRepository } from "@/core/usuário/usuario.repository";
import { UsuarioService } from "@/core/usuário/usuario.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const usuarioService = new UsuarioService(new UsuarioRepository());
    const body = await req.json();
    console.log({ body });
    const user = new User(body, "create").validationData();
    const usuario = await usuarioService.create(user as CreateUsuarioInput);

    return NextResponse.json(usuario);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao criar usuário" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
