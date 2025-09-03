import { NotFoundError, ConflictError, ValidationError } from "../../error";

// Erro quando fornecedor não é encontrado
export class FornecedorNotFoundError extends NotFoundError {
  constructor(identifier: string, value: string) {
    super(`Fornecedor ${value} não encontrado`, identifier);
  }
}

// Erro de conflito em fornecedor
export class FornecedorConflictError extends ConflictError {
  constructor(field: string, value: string) {
    super(`Conflito no fornecedor`, field, value);
  }
}

// Erro de validação específico para fornecedor
export class FornecedorValidationError extends ValidationError {
  constructor(field: string, message: string, value?: unknown) {
    super(`Erro de validação no fornecedor`, field, value);
  }
}

// Erro quando CNPJ é inválido
export class InvalidCnpjError extends ValidationError {
  constructor(cnpj: string) {
    super(`CNPJ inválido`, cnpj);
  }
}

// Erro quando CPF é inválido
export class InvalidCpfError extends ValidationError {
  constructor(cpf: string) {
    super(`CPF inválido`, cpf);
  }
}

// Erro quando email é inválido
export class InvalidEmailError extends ValidationError {
  constructor(email: string) {
    super(`Email inválido`, email);
  }
}

// Erro quando telefone é inválido
export class InvalidTelefoneError extends ValidationError {
  constructor(telefone: string) {
    super(`Telefone inválido`, telefone);
  }
}

// Erro quando fornecedor já existe com mesmo CNPJ
export class CnpjAlreadyExistsError extends ConflictError {
  constructor(cnpj: string) {
    super(`CNPJ já cadastrado`, cnpj);
  }
}

// Erro quando fornecedor já existe com mesmo CPF
export class CpfAlreadyExistsError extends ConflictError {
  constructor(cpf: string) {
    super(`CPF já cadastrado`, cpf);
  }
}

// Erro quando fornecedor já existe com mesmo email
export class EmailAlreadyExistsError extends ConflictError {
  constructor(email: string) {
    super(`Email já cadastrado`, email);
  }
}

// Erro quando fornecedor tem compras associadas e não pode ser excluído
export class FornecedorHasComprasError extends ConflictError {
  constructor(fornecedorId: string, comprasCount: number) {
    super(
      `Fornecedor ${fornecedorId} possui compras associadas`,
      "compras",
      comprasCount
    );
  }
}
