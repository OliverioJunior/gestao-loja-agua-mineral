import {
  ProdutoValidationError,
  ProdutoConflictError,
  ProdutoNotFoundError,
} from "@/core/produto/domain/produto.errors";
describe("ProdutoError", () => {
  describe("ProdutoValidation", () => {
    it("should throw ProdutoValidation when nome is required and is empty", () => {
      expect(() => {
        throw new ProdutoValidationError("nome", "", "nome_required");
      }).toThrow(ProdutoValidationError);
    });
    it("should return message when length is less than 2", () => {
      const produto = new ProdutoValidationError(
        "nome",
        "a",
        "nome_min_length"
      );
      expect(produto.message).toBe(
        "Nome do produto deve ter pelo menos 2 caracteres"
      );
    });
    it("should return message when preco is not positive", () => {
      const produto = new ProdutoValidationError("preco", -1, "preco_positive");
      expect(produto.message).toBe("Preço deve ser maior que zero");
    });
    it("should return message when categoria is invalid", () => {
      const produto = new ProdutoValidationError(
        "categoria",
        "invalid",
        "categoria_invalid"
      );
      expect(produto.message).toBe("Categoria inválida");
    });
  });
  describe("ProdutoConflictError", () => {
    it("should throw ProdutoConflictError when nome is already exists", () => {
      expect(() => {
        throw new ProdutoConflictError("nome", "produto");
      }).toThrow(ProdutoConflictError);
    });
    it("should throw ProdutoConflictError when codigo is already exists", () => {
      expect(() => {
        throw new ProdutoConflictError("codigo", "123");
      }).toThrow(ProdutoConflictError);
    });
  });

  describe("ProdutoNotFoundError", () => {
    it("should throw ProdutoNotFoundError when produto is not found", () => {
      expect(() => {
        throw new ProdutoNotFoundError("123");
      }).toThrow(ProdutoNotFoundError);
    });
    it("should return message when produto is not found", () => {
      const produto = new ProdutoNotFoundError("123");
      expect(produto.message).toBe("Produto não encontrado (ID: 123)");
    });
  });
});
