import {
  ConflictError,
  NotFoundError,
  ValidationError,
  BusinessRulesError,
} from "../error/domain.errors";

type Messages = {
  pedido_id_required: "ID do pedido é obrigatório";
  produto_id_required: "ID do produto é obrigatório";
  quantidade_required: "Quantidade é obrigatória";
  quantidade_positive: "Quantidade deve ser maior que zero";
  quantidade_max: "Quantidade não pode exceder 999";
  preco_required: "Preço é obrigatório";
  preco_positive: "Preço deve ser maior que zero";
  id_required: "ID é obrigatório";
  at_least_one_field: "Pelo menos um campo deve ser fornecido para atualização";
  all_fields_required: "Todos os campos obrigatórios devem ser fornecidos";
};

// Nota: preco_max_value removido - validação de preço máximo é responsabilidade do módulo produto

export class ItemValidation extends ValidationError {
  constructor(field: string, value: unknown, rule: keyof Messages) {
    const messages: Messages = {
      pedido_id_required: "ID do pedido é obrigatório",
      produto_id_required: "ID do produto é obrigatório",
      quantidade_required: "Quantidade é obrigatória",
      quantidade_positive: "Quantidade deve ser maior que zero",
      quantidade_max: "Quantidade não pode exceder 999",
      preco_required: "Preço é obrigatório",
      preco_positive: "Preço deve ser maior que zero",
      id_required: "ID é obrigatório",
      at_least_one_field: "Pelo menos um campo deve ser fornecido para atualização",
      all_fields_required: "Todos os campos obrigatórios devem ser fornecidos",
    };
    const message = messages[rule];
    super(message, field, value);
    this.context = { ...this.context, rule };
  }
}

export class ItemNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super("Item", identifier);
  }
}

export class ItemConflictError extends ConflictError {
  constructor(conflictType: "duplicate_item" | "pedido_produto", value: string) {
    const messages = {
      duplicate_item: `Item duplicado encontrado: ${value}`,
      pedido_produto: `Já existe um item para este produto no pedido: ${value}`,
    };
    super(messages[conflictType], conflictType, value);
  }
}

export class ItemBusinessRulesError extends BusinessRulesError {
  constructor(
    message: string,
    code: "insufficient_stock" | "invalid_price" | "pedido_closed" | "produto_inactive",
    context?: Record<string, unknown>
  ) {
    super(message, code, context);
  }
}