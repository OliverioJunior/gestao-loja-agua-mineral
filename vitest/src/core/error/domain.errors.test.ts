import {
  ValidationError,
  BusinessRulesError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "@/core/error/domain.errors";
import { StatusCode } from "@/core/error/statusCode.enum";

describe("ValidationError", () => {
  it("should create an instance of ValidationError", () => {
    const error = new ValidationError("Invalid field", "field", "123").toJSON();
    expect(error.name).toBe("ValidationError");
    expect(error.message).toBe("Invalid field");
    expect(error).toStrictEqual({
      name: "ValidationError",
      message: "Invalid field",
      stack: expect.any(String),
      code: "VALIDATION_ERROR",
      statusCode: StatusCode.BAD_REQUEST,
      context: {
        field: "field",
        value: "123",
      },
    });
  });
});
describe("BusinessRulesError", () => {
  it("should create an instance of BusinessRulesError", () => {
    const error = new BusinessRulesError("Invalid rule", "rule", {
      context: "Business",
    }).toJSON();
    expect(error.name).toBe("BusinessRulesError");
    expect(error.message).toBe("Invalid rule");
    expect(error).toStrictEqual({
      name: "BusinessRulesError",
      stack: expect.any(String),
      code: "BUSINESS_RULES_ERROR",
      statusCode: StatusCode.UNPROCESSABLE_ENTITY,
      message: "Invalid rule",
      context: {
        context: {
          context: "Business",
        },
        rule: "rule",
      },
    });
  });
});
describe("ConflictError", () => {
  it("should create an instance of ConflictError", () => {
    const error = new ConflictError("ConflictError", "conflict", {
      context: "name",
    }).toJSON();
    expect(error.name).toBe("ConflictError");
    expect(error.message).toBe("ConflictError");
    expect(error).toStrictEqual({
      name: "ConflictError",
      stack: expect.any(String),
      code: "CONFLICT_ERROR",
      statusCode: StatusCode.CONFLICT_ERROR,
      message: "ConflictError",
      context: {
        conflictingField: "conflict",
        value: {
          context: "name",
        },
      },
    });
  });
});
describe("InternalServerError", () => {
  it("should create an instance of InternalServerError", () => {
    const error = new InternalServerError(
      "InternalServerError",
      Error("Teste")
    ).toJSON();
    expect(error.name).toBe("InternalServerError");
    expect(error.message).toBe("InternalServerError");
    expect(error).toStrictEqual({
      name: "InternalServerError",
      stack: expect.any(String),
      code: "INTERNAL_SERVER_ERROR",
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      message: "InternalServerError",
      context: {
        originalError: "Teste",
        originalStack: expect.any(String),
      },
    });
  });
  it("should work if original Error is undefined", () => {
    const error = new InternalServerError("InternalServerError").toJSON();
    expect(error.name).toBe("InternalServerError");
    expect(error.message).toBe("InternalServerError");
    expect(error).toStrictEqual({
      name: "InternalServerError",
      stack: expect.any(String),
      code: "INTERNAL_SERVER_ERROR",
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      message: "InternalServerError",
      context: {
        originalError: undefined,
        originalStack: undefined,
      },
    });
  });
});
describe("NotFoundError", () => {
  it("should create an instance of NotFoundError", () => {
    const error = new NotFoundError("NotFoundError", "123").toJSON();
    expect(error.name).toBe("NotFoundError");
    expect(error.message).toBe("NotFoundError não encontrado (ID: 123)");
    expect(error).toStrictEqual({
      name: "NotFoundError",
      stack: expect.any(String),
      code: "NOT_FOUND_ERROR",
      statusCode: StatusCode.NOT_FOUND,
      message: "NotFoundError não encontrado (ID: 123)",
      context: {
        identifier: "123",
        resource: "NotFoundError",
      },
    });
  });
  it("should work with undefined identifier ", () => {
    const error = new NotFoundError("NotFoundError").toJSON();
    expect(error.name).toBe("NotFoundError");
    expect(error.message).toBe("NotFoundError não encontrado ");
    expect(error).toStrictEqual({
      name: "NotFoundError",
      stack: expect.any(String),
      code: "NOT_FOUND_ERROR",
      statusCode: StatusCode.NOT_FOUND,
      message: "NotFoundError não encontrado ",
      context: {
        identifier: undefined,
        resource: "NotFoundError",
      },
    });
  });
});
