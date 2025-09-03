import { ProdutoConflictError } from "../produto/domain/produto.errors";
import { BaseError } from "./base.errors";
import {
  ConflictError,
  NotFoundError,
  InternalServerError,
  BusinessRulesError,
} from "./domain.errors";

export class ErrorHandler {
  static handleRepositoryError(error: unknown, operation: string): never {
    if (error instanceof BaseError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        if (error.message.includes("nome")) {
          throw new ProdutoConflictError("nome", "valor fornecido");
        }
        if (error.message.includes("codigo")) {
          throw new ProdutoConflictError("codigo", "valor fornecido");
        }
        throw new ConflictError("Violação de restrição única");
      }

      // Prisma record not found
      if (
        error.message.includes("Record to update not found") ||
        error.message.includes("Record to delete does not exist")
      ) {
        throw new NotFoundError("Registro");
      }

      // Prisma foreign key constraint
      if (error.message.includes("Foreign key constraint")) {
        throw new BusinessRulesError(
          "Operação violaria integridade referencial"
        );
      }
    }

    // Erro não identificado
    throw new InternalServerError(`Erro durante ${operation}`, error as Error);
  }

  static isOperationalError(error: unknown): boolean {
    return error instanceof BaseError && error.isOperational;
  }
}
