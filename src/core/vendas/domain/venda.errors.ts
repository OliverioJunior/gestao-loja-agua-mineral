import {
  ConflictError,
  NotFoundError,
  ValidationError,
  BusinessRulesError,
} from "@/core/error";

type Messages = {
  cliente_id_required: "ID do cliente é obrigatório";
  pedido_id_required: "ID do pedido é obrigatório";
  total_required: "Total é obrigatório";
  total_positive: "Total deve ser maior que zero";
  id_required: "ID é obrigatório";
  at_least_one_field: "Pelo menos um campo deve ser fornecido para atualização";
  all_fields_required: "Todos os campos obrigatórios devem ser fornecidos";
  data_invalid: "Data inválida";
  desconto_invalid: "Desconto deve ser maior ou igual a zero";
  troco_invalid: "Troco deve ser maior ou igual a zero";
  forma_pagamento_invalid: "Forma de pagamento inválida";
  total_inconsistente: "Total da venda não confere com o total do pedido";
};

export class VendaValidationError extends ValidationError {
  constructor(field: string, value: unknown, rule: keyof Messages) {
    const messages: Messages = {
      cliente_id_required: "ID do cliente é obrigatório",
      pedido_id_required: "ID do pedido é obrigatório",
      total_required: "Total é obrigatório",
      total_positive: "Total deve ser maior que zero",
      id_required: "ID é obrigatório",
      at_least_one_field:
        "Pelo menos um campo deve ser fornecido para atualização",
      all_fields_required: "Todos os campos obrigatórios devem ser fornecidos",
      data_invalid: "Data inválida",
      desconto_invalid: "Desconto deve ser maior ou igual a zero",
      troco_invalid: "Troco deve ser maior ou igual a zero",
      forma_pagamento_invalid: "Forma de pagamento inválida",
      total_inconsistente: "Total da venda não confere com o total do pedido",
    };
    const message = messages[rule];
    super(message, field, value);
    this.context = { ...this.context, rule };
  }
}

export class VendaNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super("Venda", identifier);
  }
}

export class VendaConflictError extends ConflictError {
  constructor(
    conflictType: "pedido_ja_vendido" | "venda_duplicada",
    value: string
  ) {
    const messages = {
      pedido_ja_vendido: `Pedido ${value} já foi vendido`,
      venda_duplicada: `Já existe uma venda para este pedido: ${value}`,
    };
    super(messages[conflictType], conflictType, value);
  }
}

export class VendaBusinessRulesError extends BusinessRulesError {
  constructor(
    message: string,
    code:
      | "pedido_nao_encontrado"
      | "pedido_nao_entregue"
      | "cliente_inativo"
      | "total_inconsistente"
      | "pedido_ja_vendido"
      | "venda_ja_processada"
      | "forma_pagamento_invalida"
      | "desconto_maior_total"
      | "troco_sem_dinheiro",
    context?: Record<string, unknown>
  ) {
    super(message, code, context);
  }
}
