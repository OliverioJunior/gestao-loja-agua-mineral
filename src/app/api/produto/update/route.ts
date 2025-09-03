import { ProdutoService } from "@/core/produto/domain/produto.service";
import { ProdutoRepository } from "@/core/produto/domain/produto.repository";

import { StatusCode } from "@/core/error";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/user";
import { Product } from "@/core/produto/domain/produto";

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

    // Tratar categoria se fornecida
    if (categoria && categoria.id) {
      produtoToUpdate.categoriaId = categoria.id;
    }

    // Converter campos numéricos se fornecidos
    if (produtoToUpdate.estoque !== undefined) {
      produtoToUpdate.estoque = Number(produtoToUpdate.estoque);
    }
    if (produtoToUpdate.estoqueMinimo !== undefined) {
      produtoToUpdate.estoqueMinimo = Number(produtoToUpdate.estoqueMinimo);
    }

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
