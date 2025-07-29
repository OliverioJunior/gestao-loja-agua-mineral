import {
  BusinessRulesError,
  ConflictError,
  ErrorHandler,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "@/core/error";
import { ProdutoConflictError } from "@/core/produto/produto.errors";
describe("ErrorHandler", () => {
  describe("handleRepositoryError", () => {
    const operation = "teste de operação";

    describe("When error is an instance of BaseError", () => {
      it("should rethrow the error without modification", () => {
        const baseError = new ValidationError("Erro de teste");
        expect(() => {
          ErrorHandler.handleRepositoryError(baseError, operation);
        }).toThrow(baseError);
        // expect(errorHandler).toBeInstanceOf(ValidationError);
      });
    });
    describe("When error content'Unique Constraint'", () => {
      it("should return a ConflictError if the message has neither a name nor a code ", () => {
        const baseError = new Error("Unique constraint");
        expect(() => {
          ErrorHandler.handleRepositoryError(baseError, operation);
        }).toThrow(ConflictError);
      });
      it("should return instance ProductConflictError 'nome' when error message contains 'Unique constraint'", () => {
        const baseError = new Error("Unique constraint on column 'nome'");
        expect(() => {
          ErrorHandler.handleRepositoryError(baseError, operation);
        }).toThrow(ProdutoConflictError);
      });
      it("should return instance ProductConflictError 'codigo' when error message contains 'Unique constraint'", () => {
        const baseError = new Error("Unique constraint on column 'codigo'");
        expect(() => {
          ErrorHandler.handleRepositoryError(baseError, operation);
        }).toThrow(ProdutoConflictError);
      });
    });
    describe("When Prisma record not found", () => {
      it("should return a NotFoundError when error message contains 'Record to update not found'", () => {
        const baseError = new Error("Record to update not found");
        expect(() => {
          ErrorHandler.handleRepositoryError(baseError, operation);
        }).toThrow(NotFoundError);
      });
      it("should return a NotFoundError when error message contains 'Record to delete does not exist'", () => {
        const baseError = new Error("Record to delete does not exist");
        expect(() => {
          ErrorHandler.handleRepositoryError(baseError, operation);
        }).toThrow(NotFoundError);
      });
    });
    describe("When Prisma foreign key constraint", () => {
      it("should return a BusinessRulesError when error message contains 'Foreign key constraint'", () => {
        const baseError = new Error("Foreign key constraint");
        expect(() => {
          ErrorHandler.handleRepositoryError(baseError, operation);
        }).toThrow(BusinessRulesError);
      });
    });
    describe("When Error not identified", () => {
      it("should return a InternalServerError ", () => {
        const baseError = undefined as unknown as Error;
        expect(() => {
          ErrorHandler.handleRepositoryError(baseError, operation);
        }).toThrow(InternalServerError);
      });
    });
    describe("When Error is an OpetationalError", () => {
      it("should return 'True' when isOperatinalError is true", () => {
        const baseError = new ValidationError("Erro de teste");
        expect(ErrorHandler.isOperationalError(baseError)).toBe(true);
      });
      it("should return 'False' when isOperatinalError is false", () => {
        const baseError = new Error("Erro de teste");
        expect(ErrorHandler.isOperationalError(baseError)).toBe(false);
      });
    });
  });
});
