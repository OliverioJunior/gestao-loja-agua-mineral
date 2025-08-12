import { CategoriaRepository } from "@/core/categoria/categoria.repository";
import { CategoriaService } from "@/core/categoria/categoria.service";
import { StatusCode } from "@/core/error";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categoryService = new CategoriaService(new CategoriaRepository());
    const categories = await categoryService.findAll();
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao buscar categorias" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
