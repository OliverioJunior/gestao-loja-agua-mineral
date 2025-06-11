import { StatusCode } from "./statusCode.enum";

export abstract class BaseError extends Error {
  abstract readonly statusCode: StatusCode;
  abstract readonly code: string;
  abstract readonly isOperational: boolean;

  constructor(message: string, public context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      stack: this.stack,
    };
  }
}
