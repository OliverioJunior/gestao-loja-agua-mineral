import { Product } from "@/core/produto/produto";
import { TProduto } from "@/core/produto/produto.entity";

describe("Produto", () => {
  const data: TProduto = {
    id: "1",
    nome: "Produto 1",
    descricao: "Descrição 1",
    precoCusto: 100,
    precoVenda: 200,
    estoqueMinimo: 10,
    ativo: true,
    promocao: false,
    precoRevenda: 150,
    categoria: null,
    marca: "Marca 1",
    precoPromocao: 100,
    quantidade: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  it("should validate data", () => {
    const produto = new Product(data);
    expect(produto.validationData()).toEqual(data);
  });
  it("should validate data when is create", () => {
    const produto = new Product(data, "create");
    expect(produto.validationData()).toEqual(data);
  });
  it("should validate data when is update", () => {
    const produto = new Product(data, "update");
    expect(produto.validationData()).toEqual(data);
  });
});
