import { CategoriaService } from "@/core/categoria/categoria.service";
import { CategoriaRepository } from "@/core/categoria/categoria.repository";
import { Category } from "@/core/categoria/categoria";
import { StatusCode } from "@/core/error";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/user";

export async function POST(req: NextRequest) {
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

    const categoryData = {
      ...body,
      criadoPorId: currentUser.id,
      atualizadoPorId: currentUser.id,
    };

    const data = new Category(categoryData).validationData();

    const categoria = await categoryService.create(data);

    return NextResponse.json(categoria);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao criar categoria" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
