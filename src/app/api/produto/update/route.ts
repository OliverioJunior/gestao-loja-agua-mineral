import { ProdutoService } from "@/core/produto/produto.service";
import { ProdutoRepository } from "@/core/produto/produto.repository";

import { StatusCode } from "@/core/error";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/user";
import { Product } from "@/core/produto/produto";

export async function PUT(req: NextRequest) {
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
    const { id, categoria, ...produtoToUpdate } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID do produto é obrigatório" },
        { status: StatusCode.BAD_REQUEST }
      );
    }

    produtoToUpdate.atualizadoPorId = currentUser.id;
    produtoToUpdate.categoriaId = categoria.id;
    const data = new Product(produtoToUpdate, "update").validationData();

    const produto = await produtoService.update(id, data);

    return NextResponse.json(produto);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao atualizar produto" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
