import {
  ConflictError,
  NotFoundError,
  ValidationError,
  BusinessRulesError,
} from "@/core/error";

type Messages = {
  cliente_id_required: "ID do cliente é obrigatório";
  total_required: "Total é obrigatório";
  total_positive: "Total deve ser maior que zero";
  status_invalid: "Status do pedido inválido";
  id_required: "ID é obrigatório";
  at_least_one_field: "Pelo menos um campo deve ser fornecido para atualização";
  all_fields_required: "Todos os campos obrigatórios devem ser fornecidos";
  data_invalid: "Data inválida";
  desconto_invalid: "Desconto deve ser maior ou igual a zero";
  taxa_entrega_invalid: "Taxa de entrega deve ser maior ou igual a zero";
  tipo_entrega_invalid: "Tipo de entrega inválido";
  forma_pagamento_invalid: "Forma de pagamento inválida";
};

export class PedidoValidationError extends ValidationError {
  constructor(field: string, value: unknown, rule: keyof Messages) {
    const messages: Messages = {
      cliente_id_required: "ID do cliente é obrigatório",
      total_required: "Total é obrigatório",
      total_positive: "Total deve ser maior que zero",
      status_invalid: "Status do pedido inválido",
      id_required: "ID é obrigatório",
      at_least_one_field:
        "Pelo menos um campo deve ser fornecido para atualização",
      all_fields_required: "Todos os campos obrigatórios devem ser fornecidos",
      data_invalid: "Data inválida",
      desconto_invalid: "Desconto deve ser maior ou igual a zero",
      taxa_entrega_invalid: "Taxa de entrega deve ser maior ou igual a zero",
      tipo_entrega_invalid: "Tipo de entrega inválido",
      forma_pagamento_invalid: "Forma de pagamento inválida",
    };
    const message = messages[rule];
    super(message, field, value);
    this.context = { ...this.context, rule };
  }
}

export class PedidoNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super("Pedido", identifier);
  }
}

export class PedidoConflictError extends ConflictError {
  constructor(
    conflictType: "numero_pedido" | "cliente_pedido_ativo",
    value: string
  ) {
    const messages = {
      numero_pedido: `Já existe um pedido com o número ${value}`,
      cliente_pedido_ativo: `Cliente já possui um pedido ativo: ${value}`,
    };
    super(messages[conflictType], conflictType, value);
  }
}

export class PedidoBusinessRulesError extends BusinessRulesError {
  constructor(
    message: string,
    code:
      | "pedido_sem_itens"
      | "pedido_ja_finalizado"
      | "pedido_cancelado"
      | "cliente_inativo"
      | "total_inconsistente"
      | "status_transition_invalid"
      | "itens_sem_estoque"
      | "desconto_maior_total",
    context?: Record<string, unknown>
  ) {
    super(message, code, context);
  }
}
