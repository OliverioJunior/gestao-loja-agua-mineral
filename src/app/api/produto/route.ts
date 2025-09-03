import { StatusCode } from "@/core/error/statusCode.enum";
import { ProdutoRepository } from "@/core/produto/domain/produto.repository";
import { ProdutoService } from "@/core/produto/domain/produto.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const produtoService = new ProdutoService(new ProdutoRepository());
    const produtos = await produtoService.findAll();
    return NextResponse.json(produtos);
  } catch {
    return NextResponse.json(
      { message: "Erro interno no servidor ao buscar produtos" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
