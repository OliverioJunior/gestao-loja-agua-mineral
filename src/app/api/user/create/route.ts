import { StatusCode } from "@/core/error";
import { User } from "@/core/usuário/domain/usuario";
import { CreateUsuarioInput } from "@/core/usuário/domain/usuario.entity";
import { UsuarioRepository } from "@/core/usuário/domain/usuario.repository";
import { UsuarioService } from "@/core/usuário/domain/usuario.service";
import { NextResponse } from "next/server";
import { hash } from "argon2";
export async function POST(req: Request) {
  try {
    const usuarioService = new UsuarioService(new UsuarioRepository());
    const body = await req.json();
    const user = new User(body, "create").validationData();
    user.password = await hash(user.password || "");

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
