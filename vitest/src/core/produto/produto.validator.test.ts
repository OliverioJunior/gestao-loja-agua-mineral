import { BusinessRulesError } from "@/core/error";
import { TProduto } from "@/core/produto/domain/produto.entity";
import { ProdutoValidationError } from "@/core/produto/domain/produto.errors";
import { ProdutoValidation } from "@/core/produto/domain/produto.validation";

describe("ProdutoValidation", () => {
  const produtoBase: TProduto = {
    id: "1",
    nome: "produto",
    descricao: "descricao",
    marca: "marca",
    categoriaId: "1",
    precoCusto: 10,
    precoVenda: 11,
    precoRevenda: 10,
    precoPromocao: 10,
    ativo: true,
    estoqueMinimo: 10,
    promocao: false,
    estoque: 10,
    criadoPorId: "1",
    atualizadoPorId: "1",

    createdAt: new Date(),
    updatedAt: new Date(),
  };
  describe("ValidateInput", () => {
    it("should validate all fields", () => {
      expect(ProdutoValidation.validateInput(produtoBase)).toEqual({
        data: produtoBase,
        validate: true,
      });
    });
    it("should fail when any field is undefined", () => {
      expect(() =>
        ProdutoValidation.validateInput({
          ...produtoBase,
          nome: undefined as unknown as string,
        })
      ).toThrow(
        new ProdutoValidationError("produto", undefined, "all_field_required")
      );
    });
  });
  describe("ValidateCreateInput", () => {
    it("should work with all valid data", () => {
      expect(
        ProdutoValidation.validateCreateInput({
          ...produtoBase,
        })
      ).toEqual({
        data: produtoBase,
        validate: true,
      });
    });
    it("should throw an error when nome is empty", () => {
      expect(() =>
        ProdutoValidation.validateCreateInput({
          ...produtoBase,
          nome: "",
        })
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when nome is less than 2 caracters", () => {
      expect(() =>
        ProdutoValidation.validateCreateInput({
          ...produtoBase,
          nome: "a",
        })
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when 'precoVenda' is less than 0", () => {
      expect(() =>
        ProdutoValidation.validateCreateInput({
          ...produtoBase,
          precoVenda: -1,
        })
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when 'precoVenda' is equal 0", () => {
      expect(() =>
        ProdutoValidation.validateCreateInput({
          ...produtoBase,
          precoVenda: 0,
        })
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when 'precoVenda' is more than  999999.99", () => {
      expect(() =>
        ProdutoValidation.validateCreateInput({
          ...produtoBase,
          precoVenda: 1000000,
        })
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when 'precoCusto' is less than 0", () => {
      expect(() =>
        ProdutoValidation.validateCreateInput({
          ...produtoBase,
          precoCusto: -1,
        })
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when 'precoCusto' is equal than 0", () => {
      expect(() =>
        ProdutoValidation.validateCreateInput({
          ...produtoBase,
          precoCusto: 0,
        })
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when 'precoCusto' is more than 999999.99", () => {
      expect(() =>
        ProdutoValidation.validateCreateInput({
          ...produtoBase,
          precoCusto: 1000000,
        })
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when 'precoVenda' is less than 'precoCusto'", () => {
      expect(() =>
        ProdutoValidation.validateCreateInput({
          ...produtoBase,
          precoVenda: 10,
          precoCusto: 11,
        })
      ).toThrow(BusinessRulesError);
    });
    it("should throw an error when 'precoVenda' is equal than 'precoCusto'", () => {
      expect(() =>
        ProdutoValidation.validateCreateInput({
          ...produtoBase,
          precoVenda: 10,
          precoCusto: 10,
        })
      ).toThrow(BusinessRulesError);
    });
  });
  describe("ValidateUpdateInput", () => {
    it("should throw an error when no fields are update", () => {
      expect(() => ProdutoValidation.validateUpdateInput({})).toThrow(
        ProdutoValidation
      );
    });
    it("should throw an error when fields 'nome' is empty", () => {
      const updateNameEmpty = { nome: "" };
      expect(() =>
        ProdutoValidation.validateUpdateInput(updateNameEmpty)
      ).toThrow(ProdutoValidation);
    });
    it("should throw an error when fields 'nome' is less than 2 caracters", () => {
      const validUpdate = { nome: "A" };
      expect(() => ProdutoValidation.validateUpdateInput(validUpdate)).toThrow(
        ProdutoValidation
      );
    });
    it("should return success when nome is valid", () => {
      const validUpdate = { nome: "Produto Válido" };
      const result = ProdutoValidation.validateUpdateInput(validUpdate);
      expect(result).toEqual({
        update: true,
        data: validUpdate,
      });
    });

    it("should throw an error when fields 'precoVenda' is less than 0", () => {
      const validUpdate = { precoVenda: -1 };
      expect(() => ProdutoValidation.validateUpdateInput(validUpdate)).toThrow(
        ProdutoValidation
      );
    });
    it("should throw an error when fields 'precoCusto' is less than 0", () => {
      const validUpdate = { precoCusto: -1 };
      expect(() => ProdutoValidation.validateUpdateInput(validUpdate)).toThrow(
        ProdutoValidation
      );
    });
    it("should throw when 'precoVenda' less than 'precoCusto'", () => {
      const validUpdate = { precoVenda: 10, precoCusto: 11 };
      expect(() => ProdutoValidation.validateUpdateInput(validUpdate)).toThrow(
        BusinessRulesError
      );
    });
  });
  describe("validateId", () => {
    it("should throw an error when id is empty", () => {
      expect(() => ProdutoValidation.validateId("")).toThrow(ProdutoValidation);
    });
  });
  it("should return success when id is valid", () => {
    const id = "1";
    const result = ProdutoValidation.validateId(id);
    expect(result).toEqual({
      id: "1",
      validate: true,
    });
  });
});
