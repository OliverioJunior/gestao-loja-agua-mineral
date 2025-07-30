import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../error/domain.errors";

type Messages = {
  nome_required: "Nome do produto é obrigatório";
  nome_min_length: "Nome do produto deve ter pelo menos 2 caracteres";
  preco_positive: "Preço deve ser maior que zero";
  categoria_invalid: "Categoria inválida";
  preco_max_value: "Preço deve ser menor ou igual a 999999.99";
  produto_required_to_update: "Nenhum campo foi atualizado";
};

export class ProdutoValidation extends ValidationError {
  constructor(field: string, value: unknown, rule: keyof Messages) {
    const messages: Messages = {
      nome_required: "Nome do produto é obrigatório",
      nome_min_length: "Nome do produto deve ter pelo menos 2 caracteres",
      preco_positive: "Preço deve ser maior que zero",
      categoria_invalid: "Categoria inválida",
      preco_max_value: "Preço deve ser menor ou igual a 999999.99",
      produto_required_to_update: "Nenhum campo foi atualizado",
    };
    const message = messages[rule as keyof typeof messages];
    super(message, field, value);
    this.context = { ...this.context, rule };
  }
}

export class ProdutoNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super("Produto", identifier);
  }
}

export class ProdutoConflictError extends ConflictError {
  constructor(conflictType: "nome" | "codigo", value: string) {
    const messages = {
      nome: `Já existe um produto com o nome ${value}`,
      codigo: `Já existe um produto com o código ${value}`,
    };
    super(messages[conflictType], conflictType, value);
  }
}
