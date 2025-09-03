import { StatusCode } from "@/core/error";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/user";
import { ProdutoService } from "@/core/produto/domain/produto.service";
import { ProdutoRepository } from "@/core/produto/domain/produto.repository";

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: StatusCode.UNAUTHORIZED }
      );
    }

    const produtoService = new ProdutoService(new ProdutoRepository());
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID do produto é obrigatório" },
        { status: StatusCode.BAD_REQUEST }
      );
    }

    const produto = await produtoService.delete(id);

    return NextResponse.json(produto);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao deletar produto" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
