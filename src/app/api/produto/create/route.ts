import { StatusCode } from "@/core/error";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/user";
import { ProdutoRepository } from "@/core/produto/produto.repository";
import { ProdutoService } from "@/core/produto/produto.service";
import { Product } from "@/core/produto/produto";

export async function POST(req: NextRequest) {
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

    const produtoData = {
      ...body,
      criadoPorId: currentUser.id,
      atualizadoPorId: currentUser.id,
    };

    const convertBrazilianCurrencyToCents = (value: string) => {
      if (!value) return 0;

      const numericValue = value
        .toString()
        .replace(/\./g, "")
        .replace(",", ".");
      return Math.round(parseFloat(numericValue) * 100);
    };

    produtoData.precoCusto = convertBrazilianCurrencyToCents(
      produtoData.precoCusto
    );
    produtoData.precoVenda = convertBrazilianCurrencyToCents(
      produtoData.precoVenda
    );
    produtoData.precoRevenda = produtoData.precoRevenda
      ? convertBrazilianCurrencyToCents(produtoData.precoRevenda)
      : null;
    produtoData.precoPromocao = produtoData.precoPromocao
      ? convertBrazilianCurrencyToCents(produtoData.precoPromocao)
      : null;
    produtoData.quantidade = Number(produtoData.quantidade);
    produtoData.estoqueMinimo = Number(produtoData.estoqueMinimo);

    const data = new Product(produtoData).validationData();

    const produto = await produtoService.create(data);

    return NextResponse.json(produto);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao criar produto" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
