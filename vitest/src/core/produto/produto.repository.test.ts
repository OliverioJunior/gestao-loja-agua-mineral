import {
  CreateProdutoInput,
  TProduto,
  UpdateProdutoInput,
} from "@/core/produto/produto.entity";
import { ProdutoRepository } from "@/core/produto/produto.repository";
import { PrismaMock, prismaMock } from "vitest/src/infrastructure/prisma.mock";

describe("ProdutoRepository", () => {
  let repository: ProdutoRepository;

  beforeEach(() => {
    vitest.clearAllMocks();
    repository = new ProdutoRepository(prismaMock);
  });

  it("should create 'Produto' with success", async () => {
    const createInput: CreateProdutoInput = {
      nome: "Produto Teste",
      ativo: true,
      descricao: "Descrição do produto",
      estoqueMinimo: 10,
      marca: "Marca teste",
      precoCusto: 100,
      precoVenda: 150,
      precoPromocao: 100,
      precoRevenda: 120,
      promocao: false,
      estoque: 200,
      categoriaId: "1",
      criadoPorId: "1",
      atualizadoPorId: "1",
    };

    const expectedResult: TProduto = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      nome: "Produto Teste",
      ativo: true,
      descricao: "Descrição do produto",
      estoqueMinimo: 10,
      marca: "Marca teste",
      precoCusto: 100,
      precoVenda: 150,
      precoPromocao: 100,
      precoRevenda: 120,
      promocao: false,
      estoque: 200,
      categoriaId: "1",
      criadoPorId: "1",
      atualizadoPorId: "1",

      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    };
    prismaMock.$transaction.mockImplementation(async (callback: PrismaMock) => {
      const mockPrisma = {
        produto: {
          create: vitest.fn().mockResolvedValue(expectedResult),
        },
      };
      return await callback(mockPrisma);
    });

    const result = await repository.create(createInput);

    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });
  it("should update 'Produto' with success", async () => {
    const updateInput: UpdateProdutoInput = {
      nome: "Produto Teste",
    };

    const expectedResult: UpdateProdutoInput = {
      nome: "Produto Teste2",
    };
    prismaMock.$transaction.mockImplementation(async (callback: PrismaMock) => {
      const mockPrisma = {
        produto: {
          update: vitest.fn().mockResolvedValue(expectedResult),
        },
      };
      return await callback(mockPrisma);
    });

    const result = await repository.update("1", updateInput);

    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });
  it("should delete 'Produto' with success", async () => {
    const deleteInput = {
      id: "1",
    };

    const expectedResult: TProduto = {
      id: "1",
      nome: "Produto Teste2",
      ativo: false,
      descricao: null,
      estoqueMinimo: 0,
      marca: null,
      precoCusto: 0,
      precoVenda: 0,
      precoPromocao: null,
      precoRevenda: null,
      promocao: false,
      estoque: 0,
      categoriaId: "1",
      atualizadoPorId: "1",
      criadoPorId: "1",

      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    };
    prismaMock.$transaction.mockImplementation(async (callback: PrismaMock) => {
      const mockPrisma = {
        produto: {
          delete: vitest.fn().mockResolvedValue(expectedResult),
        },
      };
      return await callback(mockPrisma);
    });

    const result = await repository.delete(deleteInput.id);

    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });
  it("should findAll 'Produto' with success", async () => {
    const expectedResult: TProduto = {
      id: "1",
      nome: "Produto Teste2",
      ativo: false,
      descricao: null,
      estoqueMinimo: 0,
      marca: null,
      precoCusto: 0,
      precoVenda: 0,
      precoPromocao: null,
      precoRevenda: null,
      promocao: false,
      estoque: 0,
      categoriaId: null,
      criadoPorId: "1",
      atualizadoPorId: "1",

      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    };
    prismaMock.produto.findMany.mockResolvedValue([expectedResult]);

    const result = await repository.findAll();

    expect(prismaMock.produto.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual([expectedResult]);
  });
  it("should findById 'Produto' with success", async () => {
    const expectedResult: TProduto = {
      id: "1",
      nome: "Produto Teste2",
      ativo: false,
      descricao: null,
      estoqueMinimo: 0,
      marca: null,
      precoCusto: 0,
      precoVenda: 0,
      precoPromocao: null,
      precoRevenda: null,
      promocao: false,
      estoque: 0,
      categoriaId: null,
      criadoPorId: "1",
      atualizadoPorId: "1",
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    };
    prismaMock.produto.findUnique.mockResolvedValue(expectedResult);

    const result = await repository.findById("1");

    expect(prismaMock.produto.findUnique).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });
  it("should findByNome 'Produto' with success", async () => {
    const expectedResult: TProduto = {
      id: "1",
      nome: "Produto Teste2",
      ativo: false,
      descricao: null,
      estoqueMinimo: 0,
      marca: null,
      precoCusto: 0,
      precoVenda: 0,
      precoPromocao: null,
      precoRevenda: null,
      promocao: false,
      estoque: 0,
      categoriaId: null,
      criadoPorId: "1",
      atualizadoPorId: "1",
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    };
    prismaMock.produto.findMany.mockResolvedValue([expectedResult]);

    const result = await repository.findByNome("Produto");

    expect(prismaMock.produto.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual([expectedResult]);
  });
  it("should not find 'Produto' by findByNome with success", async () => {
    const expectedResult: TProduto = {
      id: "1",
      nome: "Produto",
      ativo: false,
      descricao: null,
      estoqueMinimo: 0,
      marca: null,
      precoCusto: 0,
      precoVenda: 0,
      precoPromocao: null,
      precoRevenda: null,
      promocao: false,
      estoque: 0,
      categoriaId: null,
      criadoPorId: "1",
      atualizadoPorId: "1",
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    };
    prismaMock.produto.findMany.mockResolvedValue([]);
    const result = await repository.findByNome(expectedResult.nome);
    expect(prismaMock.produto.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });
  it("should existsById 'Produto' with success", async () => {
    prismaMock.produto.count.mockResolvedValue(1);

    const result = await repository.existsById("1");

    expect(prismaMock.produto.count).toHaveBeenCalledTimes(1);
    expect(result).toEqual(true);
  });
  it("should not existsById 'Produto' with success", async () => {
    prismaMock.produto.count.mockResolvedValue(0);

    const result = await repository.existsById("1");

    expect(prismaMock.produto.count).toHaveBeenCalledTimes(1);
    expect(result).toEqual(false);
  });
});
