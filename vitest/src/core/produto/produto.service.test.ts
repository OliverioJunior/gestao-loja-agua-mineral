import { BusinessRulesError } from "@/core/error";
import {
  CreateProdutoInput,
  IProdutoRepository,
  TProduto,
  UpdateProdutoInput,
} from "@/core/produto/produto.entity";
import { ProdutoNotFoundError } from "@/core/produto/produto.errors";
import { ProdutoRepository } from "@/core/produto/produto.repository";
import { ProdutoService } from "@/core/produto/produto.service";
import { prismaMock, PrismaMock } from "vitest/src/infrastructure/prisma.mock";

describe("ProdutoService", () => {
  let produtoService: ProdutoService;
  let produtoRepository: IProdutoRepository;
  let prisma: PrismaMock;
  beforeEach(() => {
    prisma = prismaMock;
    produtoRepository = new ProdutoRepository(prisma);
    produtoService = new ProdutoService(produtoRepository);
    vitest.clearAllMocks();
  });
  it("should create a produto", async () => {
    const data: CreateProdutoInput = {
      nome: "Produto 1",
      descricao: "Descrição 1",
      precoCusto: 100,
      precoVenda: 200,
      estoqueMinimo: 10,
      ativo: true,
      promocao: false,
      precoRevenda: 150,
      categoriaId: "1",
      marca: "Marca 1",
      precoPromocao: 100,
      estoque: 10,
      criadoPorId: "1",
      atualizadoPorId: "1",
    };
    const expectedResult: TProduto = {
      id: "1",
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prisma.$transaction.mockImplementation(async (callback: PrismaMock) => {
      const mockPrisma = {
        produto: {
          create: vitest.fn().mockResolvedValue(expectedResult),
        },
      };
      return await callback(mockPrisma);
    });
    const produto = await produtoService.create(data);
    expect(produto).toBeDefined();
    expect(produto.nome).toBe(data.nome);
  });
  it("should fail when 'Nome' is empty", async () => {
    const data: CreateProdutoInput = {
      nome: "",
      descricao: "Descrição 1",
      precoCusto: 100,
      precoVenda: 200,
      estoqueMinimo: 10,
      ativo: true,
      promocao: false,
      precoRevenda: 150,
      categoriaId: null,
      marca: "Marca 1",
      precoPromocao: 100,
      estoque: 10,
      criadoPorId: "1",
      atualizadoPorId: "1",
    };
    await expect(produtoService.create(data)).rejects.toThrow(
      "Nome do produto é obrigatório"
    );
  });
  it("should fail when 'Nome' is less than 2 characters", async () => {
    const data: CreateProdutoInput = {
      nome: "2",
      descricao: "Descrição 1",
      precoCusto: 100,
      precoVenda: 200,
      estoqueMinimo: 10,
      ativo: true,
      promocao: false,
      precoRevenda: 150,
      categoriaId: null,
      marca: "Marca 1",
      precoPromocao: 100,
      estoque: 10,
      criadoPorId: "1",
      atualizadoPorId: "1",
    };
    await expect(produtoService.create(data)).rejects.toThrow(
      "Nome do produto deve ter pelo menos 2 caracteres"
    );
  });
  it("should fail when 'Preço de Custo' equal 'Preço de Venda'", async () => {
    const data: CreateProdutoInput = {
      nome: "Produto 1",
      descricao: "Descrição 1",
      precoCusto: 100,
      precoVenda: 100,
      estoqueMinimo: 10,
      ativo: true,
      promocao: false,
      precoRevenda: 150,
      categoriaId: null,
      marca: "Marca 1",
      precoPromocao: 100,
      estoque: 10,
      criadoPorId: "1",
      atualizadoPorId: "1",
    };
    await expect(produtoService.create(data)).rejects.toThrow(
      "Preço de venda deve ser maior que o preço de custo"
    );
  });
  it("should update a produto", async () => {
    const data: UpdateProdutoInput = {
      nome: "Produto 1",
      precoCusto: 100,
      precoVenda: 200,
      estoqueMinimo: 10,
    };
    const expectedResult = {
      id: "1",
      nome: "Produto 2",
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
      createdAt: new Date(),
      updatedAt: new Date(),
      criadoPorId: "1",
      atualizadoPorId: "1",
    };

    vitest.spyOn(produtoRepository, "existsById").mockResolvedValue(true);
    vitest.spyOn(produtoRepository, "update").mockResolvedValue(expectedResult);
    await expect(produtoService.update("1", data)).resolves.toEqual(
      expectedResult
    );
  });
  it("should fail when 'id' is not found", async () => {
    const data: UpdateProdutoInput = {
      nome: "Produto 1",
      precoCusto: 100,
      precoVenda: 200,
      estoqueMinimo: 10,
    };

    vitest.spyOn(produtoRepository, "existsById").mockResolvedValue(false);

    await expect(produtoService.update("1", data)).rejects.toThrow(
      "Produto não encontrado"
    );
  });
  it("should update when 'Preco de Venda' more than 'Preco de Custo'", async () => {
    const data: UpdateProdutoInput = {
      nome: "Produto 1",
      precoCusto: 100,
      precoVenda: 150,
      estoqueMinimo: 10,
    };
    const expectedResult = {
      id: "1",
      nome: "Produto 1",
      descricao: null,
      marca: null,
      categoriaId: null,
      precoCusto: 100,
      precoVenda: 150,
      precoRevenda: null,
      precoPromocao: null,
      estoqueMinimo: 10,
      estoque: 0,
      ativo: true,
      promocao: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      criadoPorId: "1",
      atualizadoPorId: "1",
    };
    vitest.spyOn(produtoRepository, "existsById").mockResolvedValue(true);
    vitest.spyOn(produtoRepository, "update").mockResolvedValue(expectedResult);
    await expect(produtoService.update("1", data)).resolves.toEqual(
      expectedResult
    );
  });
  it("should fail when 'Preco de Venda' less than 'Preco de Custo'", async () => {
    const data: UpdateProdutoInput = {
      nome: "Produto 1",
      precoCusto: 100,
      precoVenda: 90,
      estoqueMinimo: 10,
    };

    vitest.spyOn(produtoRepository, "existsById").mockResolvedValue(true);

    await expect(produtoService.update("1", data)).rejects.toThrow(
      "Preço de venda deve ser maior que o preço de custo"
    );
  });
  it("should fail when 'Preco de Venda' <= than new 'Preco de Custo'", async () => {
    const data = {
      id: "1",
      nome: "Produto 1",
      descricao: null,
      marca: null,
      categoriaId: null,
      precoCusto: 90,
      precoVenda: 100,
      precoRevenda: null,
      precoPromocao: null,
      estoqueMinimo: 10,
      estoque: 0,
      ativo: true,
      promocao: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      criadoPorId: "1",
      atualizadoPorId: "1",
    };
    const updateData = {
      precoCusto: 100,
    };
    vitest.spyOn(produtoRepository, "findById").mockResolvedValue(data);
    vitest.spyOn(produtoRepository, "existsById").mockResolvedValue(true);

    await expect(produtoService.update("1", updateData)).rejects.toThrow(
      BusinessRulesError
    );
  });
  it("should fail when new 'Preco de Venda' <= than  'Preco de Custo'", async () => {
    const data = {
      id: "1",
      nome: "Produto 1",
      descricao: null,
      marca: null,
      categoriaId: null,
      precoCusto: 90,
      precoVenda: 100,
      precoRevenda: null,
      precoPromocao: null,
      estoqueMinimo: 10,
      estoque: 0,
      ativo: true,
      promocao: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      criadoPorId: "1",
      atualizadoPorId: "1",
    };
    const updateData = {
      precoVenda: 90,
    };
    vitest.spyOn(produtoRepository, "findById").mockResolvedValue(data);
    vitest.spyOn(produtoRepository, "existsById").mockResolvedValue(true);

    await expect(produtoService.update("1", updateData)).rejects.toThrow(
      BusinessRulesError
    );
  });
  it("should delete a produto", async () => {
    const expectedResult = {
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
      createdAt: new Date(),
      updatedAt: new Date(),
      criadoPorId: "1",
      atualizadoPorId: "1",
    };

    vitest.spyOn(produtoRepository, "existsById").mockResolvedValue(true);
    vitest.spyOn(produtoRepository, "delete").mockResolvedValue(expectedResult);
    await expect(produtoService.delete("1")).resolves.toEqual(expectedResult);
  });
  it("should fail when 'id' is not found", async () => {
    vitest.spyOn(produtoRepository, "existsById").mockResolvedValue(false);
    vitest
      .spyOn(produtoRepository, "delete")
      .mockRejectedValue(new ProdutoNotFoundError("1"));
    await expect(produtoService.delete("1")).rejects.toThrow(
      "Produto não encontrado"
    );
  });
  it("should find a produto by id", async () => {
    const expectedResult = {
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
      createdAt: new Date(),
      updatedAt: new Date(),
      criadoPorId: "1",
      atualizadoPorId: "1",
    };

    vitest
      .spyOn(produtoRepository, "findById")
      .mockResolvedValue(expectedResult);
    await expect(produtoService.findById("1")).resolves.toEqual(expectedResult);
  });
  it("should fail when 'id' is not found", async () => {
    vitest.spyOn(produtoRepository, "findById").mockResolvedValue(null);
    await expect(produtoService.findById("1")).rejects.toThrow(
      "Produto não encontrado"
    );
  });
  it("should find all produtos", async () => {
    const expectedResult = [
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
        createdAt: new Date(),
        updatedAt: new Date(),
        criadoPorId: "1",
        atualizadoPorId: "1",
      },
    ];
    vitest
      .spyOn(produtoRepository, "findAll")
      .mockResolvedValue(expectedResult);
    await expect(produtoService.findAll()).resolves.toEqual(expectedResult);
  });
  it("should fail when 'findAll' return an error", async () => {
    vitest
      .spyOn(produtoRepository, "findAll")
      .mockRejectedValue(new Error("Erro durante busca de produtos"));
    await expect(produtoService.findAll()).rejects.toThrow(
      "Erro durante busca de produtos"
    );
  });
});
