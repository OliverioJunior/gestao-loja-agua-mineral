import { NotFoundError, ConflictError, ValidationError } from "../../error";

// Erro quando item de compra não é encontrado
export class ItemCompraNotFoundError extends NotFoundError {
  constructor(identifier: string, value: string) {
    super(`Item de compra ${value} não encontrado`, identifier);
  }
}

// Erro de conflito em item de compra
export class ItemCompraConflictError extends ConflictError {
  constructor(field: string, value: string) {
    super(`Conflito no item de compra`, field, value);
  }
}

// Erro de validação específico para item de compra
export class ItemCompraValidationError extends ValidationError {
  constructor(field: string, message: string, value?: unknown) {
    super(`Erro de validação no item de compra`, field, value);
  }
}

// Erro quando quantidade é inválida
export class InvalidQuantityError extends ValidationError {
  constructor(quantity: number) {
    super(`Quantidade inválida para item de compra`, "quantidade", quantity);
  }
}

// Erro quando preço é inválido
export class InvalidPriceError extends ValidationError {
  constructor(price: number, field: string = "precoUnitario") {
    super(`Preço inválido para item de compra`, price.toString(), field);
  }
}

// Erro quando compra não existe
export class CompraNotFoundError extends NotFoundError {
  constructor(compraId: string) {
    super(`Compra não encontrada para o item`, compraId);
  }
}

// Erro quando produto não existe
export class ProdutoNotFoundError extends NotFoundError {
  constructor(produtoId: string) {
    super(`Produto não encontrado para o item`, produtoId);
  }
}
