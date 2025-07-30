import { BusinessRulesError } from "@/core/error";
import { TProduto } from "@/core/produto/produto.entity";
import { ProdutoValidation } from "@/core/produto/produto.errors";
import { ProdutoValidator } from "@/core/produto/produto.validator";

describe("ProdutoValidator", () => {
  const produtoBase: TProduto = {
    id: "1",
    nome: "produto",
    descricao: "descricao",
    marca: "marca",
    categoria: "categoria",
    precoCusto: 10,
    precoVenda: 11,
    precoRevenda: 10,
    precoPromocao: 10,
    ativo: true,
    estoqueMinimo: 10,
    promocao: false,
    quantidade: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  describe("ValidateCreateInput", () => {
    it("should work with all valid data", () => {
      expect(
        ProdutoValidator.validateCreateInput({
          ...produtoBase,
        })
      ).toEqual({
        data: produtoBase,
        validate: true,
      });
    });
    it("should throw an error when nome is empty", () => {
      expect(() =>
        ProdutoValidator.validateCreateInput({
          ...produtoBase,
          nome: "",
        })
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when nome is less than 2 caracters", () => {
      expect(() =>
        ProdutoValidator.validateCreateInput({
          ...produtoBase,
          nome: "a",
        })
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when 'precoVenda' is less than 0", () => {
      expect(() =>
        ProdutoValidator.validateCreateInput({
          ...produtoBase,
          precoVenda: -1,
        })
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when 'precoVenda' is equal 0", () => {
      expect(() =>
        ProdutoValidator.validateCreateInput({
          ...produtoBase,
          precoVenda: 0,
        })
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when 'precoVenda' is more than  999999.99", () => {
      expect(() =>
        ProdutoValidator.validateCreateInput({
          ...produtoBase,
          precoVenda: 1000000,
        })
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when 'precoCusto' is less than 0", () => {
      expect(() =>
        ProdutoValidator.validateCreateInput({
          ...produtoBase,
          precoCusto: -1,
        })
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when 'precoCusto' is equal than 0", () => {
      expect(() =>
        ProdutoValidator.validateCreateInput({
          ...produtoBase,
          precoCusto: 0,
        })
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when 'precoCusto' is more than 999999.99", () => {
      expect(() =>
        ProdutoValidator.validateCreateInput({
          ...produtoBase,
          precoCusto: 1000000,
        })
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when 'precoVenda' is less than 'precoCusto'", () => {
      expect(() =>
        ProdutoValidator.validateCreateInput({
          ...produtoBase,
          precoVenda: 10,
          precoCusto: 11,
        })
      ).toThrow(BusinessRulesError);
    });
    it("should throw an error when 'precoVenda' is equal than 'precoCusto'", () => {
      expect(() =>
        ProdutoValidator.validateCreateInput({
          ...produtoBase,
          precoVenda: 10,
          precoCusto: 10,
        })
      ).toThrow(BusinessRulesError);
    });
  });
  describe("ValidateUpdateInput", () => {
    it("should throw an error when no fields are update", () => {
      expect(() => ProdutoValidator.validateUpdateInput({})).toThrow(
        ProdutoValidation
      );
    });
    it("should throw an error when fields 'nome' is empty", () => {
      const updateNameEmpty = { nome: "" };
      expect(() =>
        ProdutoValidator.validateUpdateInput(updateNameEmpty)
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when fields 'nome' is less than 2 caracters", () => {
      const validUpdate = { nome: "A" };
      expect(() => ProdutoValidator.validateUpdateInput(validUpdate)).toThrow(
        ProdutoValidation
      );
    });
    it("should return success when nome is valid", () => {
      const validUpdate = { nome: "Produto Válido" };
      const result = ProdutoValidator.validateUpdateInput(validUpdate);
      expect(result).toEqual({
        update: true,
        data: validUpdate,
      });
    });

    it("should throw an error when fields 'precoVenda' is less than 0", () => {
      const validUpdate = { precoVenda: -1 };
      expect(() => ProdutoValidator.validateUpdateInput(validUpdate)).toThrow(
        ProdutoValidation
      );
    });
    it("should throw an error when fields 'precoCusto' is less than 0", () => {
      const validUpdate = { precoCusto: -1 };
      expect(() => ProdutoValidator.validateUpdateInput(validUpdate)).toThrow(
        ProdutoValidation
      );
    });
    it("should throw when 'precoVenda' less than 'precoCusto'", () => {
      const validUpdate = { precoVenda: 10, precoCusto: 11 };
      expect(() => ProdutoValidator.validateUpdateInput(validUpdate)).toThrow(
        BusinessRulesError
      );
    });
  });
});
