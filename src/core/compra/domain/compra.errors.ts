import { NotFoundError, ConflictError, ValidationError } from "../../error";

// Erro quando compra não é encontrada
export class CompraNotFoundError extends NotFoundError {
  constructor(identifier: string, value: string) {
    super("Compra", value);
  }
}

// Erro de conflito em compra
export class CompraConflictError extends ConflictError {
  constructor(field: string, value: string) {
    super(`Conflito na compra`, field, value);
  }
}

// Erro de validação específico para compra
export class CompraValidationError extends ValidationError {
  constructor(field: string, message: string, value?: unknown) {
    super(`Erro de validação na compra: ${message}`, field, value);
  }
}

// Erro quando fornecedor não existe
export class FornecedorNotFoundError extends NotFoundError {
  constructor(fornecedorId: string) {
    super("Fornecedor", fornecedorId);
  }
}

// Erro quando número da nota já existe
export class NumeroNotaAlreadyExistsError extends ConflictError {
  constructor(numeroNota: string) {
    super(`Número da nota fiscal já existe`, "numeroNota", numeroNota);
  }
}

// Erro quando data de compra é inválida
export class InvalidDataCompraError extends ValidationError {
  constructor(dataCompra: Date) {
    super("A data de compra não pode ser futura", "dataCompra", dataCompra);
  }
}

// Erro quando data de vencimento é inválida
export class InvalidDataVencimentoError extends ValidationError {
  constructor(dataVencimento: Date, dataCompra: Date) {
    super(
      "A data de vencimento não pode ser anterior à data de compra",
      "dataVencimento",
      { dataVencimento, dataCompra }
    );
  }
}

// Erro quando valor total é inválido
export class InvalidTotalError extends ValidationError {
  constructor(total: number) {
    super("O valor total deve ser maior que zero", "total", total);
  }
}

// Erro quando desconto é maior que o total
export class InvalidDescontoError extends ValidationError {
  constructor(desconto: number, total: number) {
    super("O desconto não pode ser maior que o valor total", "desconto", {
      desconto,
      total,
    });
  }
}

// Erro quando compra tem itens associados e não pode ser excluída
export class CompraHasItensError extends ConflictError {
  constructor(compraId: string, itensCount: number) {
    super(
      `Não é possível excluir compra com ${itensCount} itens associados`,
      "itens",
      compraId
    );
  }
}

// Erro quando status da compra não permite alteração
export class InvalidStatusTransitionError extends ValidationError {
  constructor(currentStatus: string, newStatus: string) {
    super(
      `Não é possível alterar status de ${currentStatus} para ${newStatus}`,
      "status",
      { currentStatus, newStatus }
    );
  }
}

// Erro quando compra já foi recebida e não pode ser alterada
export class CompraAlreadyReceivedError extends ConflictError {
  constructor(compraId: string) {
    super(
      "Não é possível alterar compra que já foi recebida",
      "status",
      compraId
    );
  }
}

// Erro quando compra foi cancelada e não pode ser alterada
export class CompraCanceladaError extends ConflictError {
  constructor(compraId: string) {
    super("Não é possível alterar compra cancelada", "status", compraId);
  }
}
