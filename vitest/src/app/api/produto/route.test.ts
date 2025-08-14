import { GET } from "@/app/api/produto/route";
import { TProduto } from "@/core/produto/produto.entity";
import { ProdutoService } from "@/core/produto/produto.service";
import { NextResponse } from "next/server";

vitest.mock("next/server", () => ({
  NextResponse: {
    json: vitest.fn(),
  },
}));

vitest.mock("@/core/produto/produto.service", () => ({
  ProdutoService: vitest.fn().mockImplementation(() => ({
    findAll: vitest.fn(),
  })),
}));

vitest.mock("@/core/produto/produto.repository");

const MockedNextResponse = vitest.mocked(NextResponse);
const MockedProdutoService = vitest.mocked(ProdutoService);

describe("Get /api/produto", () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it("should return all produtos", async () => {
    const expectedResult: TProduto[] = [
      {
        id: "1",
        nome: "Produto 1",
        descricao: null,
        marca: null,
        categoriaId: null,
        precoCusto: 100,
        precoVenda: 200,
        precoRevenda: null,
        precoPromocao: null,
        estoqueMinimo: 10,
        estoque: 0,
        ativo: true,
        promocao: false,
        atualizadoPorId: "1",
        criadoPorId: "1",

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockServiceInstance: Partial<ProdutoService> = {
      findAll: vitest.fn().mockResolvedValue(expectedResult),
    };
    MockedProdutoService.mockImplementation(
      () => mockServiceInstance as ProdutoService
    );

    await GET();

    expect(mockServiceInstance.findAll).toHaveBeenCalled();
    expect(MockedNextResponse.json).toHaveBeenCalledWith(expectedResult);
  });

  it("should return 500 when an error occurs", async () => {
    const mockServiceInstance: Partial<ProdutoService> = {
      update: vitest.fn(),
      delete: vitest.fn(),
      findById: vitest.fn(),
      create: vitest.fn(),
      findAll: vitest
        .fn()
        .mockRejectedValue(new Error("Erro ao buscar produtos")),
    };
    MockedProdutoService.mockImplementation(
      () => mockServiceInstance as ProdutoService
    );

    await GET();

    expect(mockServiceInstance.findAll).toHaveBeenCalled();
    expect(MockedNextResponse.json).toHaveBeenCalledWith(
      { message: "Erro interno no servidor ao buscar produtos" },
      { status: 500 }
    );
  });
});
