import { StatusCode } from "@/core/error";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/user";
import { ProdutoRepository } from "@/core/produto/domain/produto.repository";
import { ProdutoService } from "@/core/produto/domain/produto.service";
import { Product } from "@/core/produto/domain/produto";
import { ProdutoValidationError } from "@/core/produto/domain/produto.errors";

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

    // Converter preços de string formatada para centavos
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

    // Converter campos numéricos
    produtoData.estoque = Number(produtoData.estoque || 0);
    produtoData.estoqueMinimo = Number(produtoData.estoqueMinimo || 0);

    // Garantir que campos opcionais sejam tratados corretamente
    if (!produtoData.descricao) produtoData.descricao = null;
    if (!produtoData.marca) produtoData.marca = null;
    if (!produtoData.categoriaId) produtoData.categoriaId = null;

    const data = new Product(produtoData, "create").validationData();

    const produto = await produtoService.create(data);

    return NextResponse.json(produto);
  } catch (error) {
    console.error({ error });
    if (error instanceof ProdutoValidationError) {
      return new NextResponse(JSON.stringify({ message: error.message }), {
        status: error.statusCode,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new NextResponse(
      JSON.stringify({ message: "Erro interno no servidor ao criar produto" }),
      {
        status: StatusCode.INTERNAL_SERVER_ERROR,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
