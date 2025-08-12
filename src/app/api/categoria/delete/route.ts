import { CategoriaService } from "@/core/categoria/categoria.service";
import { CategoriaRepository } from "@/core/categoria/categoria.repository";
import { StatusCode } from "@/core/error";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/user";

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: StatusCode.UNAUTHORIZED }
      );
    }

    const categoryService = new CategoriaService(new CategoriaRepository());
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID da categoria é obrigatório" },
        { status: StatusCode.BAD_REQUEST }
      );
    }

    const categoria = await categoryService.delete(id);

    return NextResponse.json(categoria);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao deletar categoria" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}