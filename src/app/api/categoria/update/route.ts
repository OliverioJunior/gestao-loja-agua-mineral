import { CategoriaService } from "@/core/categoria/dominio/categoria.service";
import { CategoriaRepository } from "@/core/categoria/dominio/categoria.repository";
import { Category } from "@/core/categoria/dominio/categoria";
import { StatusCode } from "@/core/error";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/user";

export async function PUT(req: NextRequest) {
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
    const { id, ...categoryToUpdate } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID da categoria é obrigatório" },
        { status: StatusCode.BAD_REQUEST }
      );
    }

    categoryToUpdate.atualizadoPorId = currentUser.id;

    const data = new Category(categoryToUpdate, "update").validationData();

    const categoria = await categoryService.update(id, data);

    return NextResponse.json(categoria);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao atualizar categoria" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
