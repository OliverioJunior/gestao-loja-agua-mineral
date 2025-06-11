import { BaseError } from "./base.errors";
import { StatusCode } from "./statusCode.enum";

export class ValidationError extends BaseError {
  readonly statusCode = StatusCode.BAD_REQUEST;
  readonly code = "VALIDATION_ERROR";
  readonly isOperational = true;
  constructor(message: string, field?: string, value?: unknown) {
    super(message, { field, value });
  }
}

export class NotFoundError extends BaseError {
  readonly statusCode = StatusCode.NOT_FOUND;
  readonly code = "NOT_FOUND_ERROR";
  readonly isOperational = true;
  constructor(resource: string, identifier?: string | number) {
    super(
      `${resource} não encontrado ${identifier ? `(ID: ${identifier})` : ""}`
    );
    this.context = { resource, identifier };
  }
}

export class ConflictError extends BaseError {
  readonly statusCode = StatusCode.CONFLICT_ERROR;
  readonly code = "CONFLICT_ERROR";
  readonly isOperational = true;
  constructor(message: string, conflictingField?: string, value?: unknown) {
    super(message);
    this.context = { conflictingField, value };
  }
}

export class BusinessRulesError extends BaseError {
  readonly statusCode = StatusCode.UNPROCESSABLE_ENTITY;
  readonly code = "BUSINESS_RULES_ERROR";
  readonly isOperational = true;
  constructor(
    message: string,
    rule?: string,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.context = { rule, context };
  }
}

export class InternalServerError extends BaseError {
  readonly statusCode = StatusCode.INTERNAL_SERVER_ERROR;
  readonly code = "INTERNAL_SERVER_ERROR";
  readonly isOperational = false;
  constructor(
    message: string = "Erro interno do servidor",
    originalError?: Error
  ) {
    super(message);
    this.context = {
      originalError: originalError?.message,
      originalStack: originalError?.stack,
    };
  }
}
