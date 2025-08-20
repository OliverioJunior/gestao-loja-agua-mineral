import { BusinessRulesError } from "../error/domain.errors";
import {
  CreatePedidoInput,
  TPedido,
  UpdatePedidoInput,
  StatusPedido,
  TipoEntrega,
  FormaPagamento,
} from "./pedido.entity";
import { PedidoValidation } from "./pedido.errors";

export class PedidoValidator {
  private static readonly MAX_TOTAL = 999999.99;
  private static readonly MIN_TOTAL = 0.01;
  private static readonly VALID_STATUS: StatusPedido[] = [
    "PENDENTE",
    "CONFIRMADO",
    "ENTREGUE",
    "CANCELADO",
  ];
  private static readonly VALID_TIPO_ENTREGA: TipoEntrega[] = [
    "balcao",
    "entrega",
  ];
  private static readonly VALID_FORMA_PAGAMENTO: FormaPagamento[] = [
    "dinheiro",
    "cartao_debito",
    "cartao_credito",
    "pix",
  ];

  static validateInput(data: TPedido): { data: TPedido; validate: boolean } {
    this.validateClienteId(data.clienteId);
    this.validateTotal(data.total);
    this.validateStatus(data.status);
    return { data, validate: true };
  }

  static validateCreateInput(data: CreatePedidoInput) {
    this.validateClienteId(data.clienteId);
    this.validateTotal(data.total);

    if (data.formaPagamento !== undefined) {
      this.validateFormaPagamento(data.formaPagamento);
    }

    if (data.desconto !== undefined) {
      this.validateDesconto(data.desconto);
    }

    if (data.taxaEntrega !== undefined) {
      this.validateTaxaEntrega(data.taxaEntrega);
    }

    this.validateAllFields(data);
    return { data, validate: true };
  }

  static validateUpdateInput(data: UpdatePedidoInput) {
    if (data.total !== undefined) {
      this.validateTotal(data.total);
    }

    if (data.status !== undefined) {
      this.validateStatus(data.status);
    }

    if (data.tipoEntrega !== undefined) {
      this.validateTipoEntrega(data.tipoEntrega);
    }

    if (data.formaPagamento !== undefined) {
      this.validateFormaPagamento(data.formaPagamento);
    }

    if (data.desconto !== undefined) {
      this.validateDesconto(data.desconto);
    }

    if (data.taxaEntrega !== undefined) {
      this.validateTaxaEntrega(data.taxaEntrega);
    }

    this.validateAtLeastOneField(data);
    return { update: true, data };
  }

  static validateId(id: string) {
    if (!id?.trim()) {
      throw new PedidoValidation("id", id, "id_required");
    }
    return { id, validate: true };
  }

  static validateStatusTransition(
    currentStatus: StatusPedido,
    newStatus: StatusPedido
  ) {
    const validTransitions: Record<StatusPedido, StatusPedido[]> = {
      PENDENTE: ["CONFIRMADO", "CANCELADO"],
      CONFIRMADO: ["ENTREGUE", "CANCELADO"],
      ENTREGUE: [], // Pedido entregue não pode mudar de status
      CANCELADO: [], // Pedido cancelado não pode mudar de status
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BusinessRulesError(
        `Transição de status inválida: ${currentStatus} -> ${newStatus}`,
        "status_transition_invalid",
        { currentStatus, newStatus }
      );
    }
  }

  static validateTotalVsItens(totalPedido: number, totalItens: number) {
    // Permite uma pequena diferença devido a arredondamentos
    const diferenca = Math.abs(totalPedido - totalItens);
    const tolerancia = 0.01; // 1 centavo

    if (diferenca > tolerancia) {
      throw new BusinessRulesError(
        `Total do pedido (${totalPedido}) não confere com a soma dos itens (${totalItens})`,
        "total_inconsistente",
        { totalPedido, totalItens, diferenca }
      );
    }
  }

  static validateDescontoVsTotal(desconto: number, total: number) {
    if (desconto > total) {
      throw new BusinessRulesError(
        `Desconto (${desconto}) não pode ser maior que o total (${total})`,
        "desconto_maior_total",
        { desconto, total }
      );
    }
  }

  private static validateClienteId(clienteId: string) {
    if (!clienteId?.trim()) {
      throw new PedidoValidation("clienteId", clienteId, "cliente_id_required");
    }
  }

  private static validateTotal(total: number) {
    if (total === undefined || total === null) {
      throw new PedidoValidation("total", total, "total_required");
    }

    if (typeof total !== "number" || total < this.MIN_TOTAL) {
      throw new PedidoValidation("total", total, "total_positive");
    }

    if (total > this.MAX_TOTAL) {
      throw new PedidoValidation("total", total, "total_positive");
    }
  }

  static validateStatus(status: StatusPedido) {
    if (!this.VALID_STATUS.includes(status)) {
      throw new PedidoValidation("status", status, "status_invalid");
    }
  }

  private static validateTipoEntrega(tipoEntrega: TipoEntrega) {
    if (!this.VALID_TIPO_ENTREGA.includes(tipoEntrega)) {
      throw new PedidoValidation(
        "tipoEntrega",
        tipoEntrega,
        "tipo_entrega_invalid"
      );
    }
  }

  private static validateFormaPagamento(formaPagamento: FormaPagamento) {
    if (!this.VALID_FORMA_PAGAMENTO.includes(formaPagamento)) {
      throw new PedidoValidation(
        "formaPagamento",
        formaPagamento,
        "forma_pagamento_invalid"
      );
    }
  }

  private static validateDesconto(desconto: number) {
    if (typeof desconto !== "number" || desconto < 0) {
      throw new PedidoValidation("desconto", desconto, "desconto_invalid");
    }
  }

  private static validateTaxaEntrega(taxaEntrega: number) {
    if (typeof taxaEntrega !== "number" || taxaEntrega < 0) {
      throw new PedidoValidation(
        "taxaEntrega",
        taxaEntrega,
        "taxa_entrega_invalid"
      );
    }
  }

  private static validateAtLeastOneField(data: UpdatePedidoInput) {
    const fields = [
      "total",
      "status",
      "tipoEntrega",
      "formaPagamento",
      "enderecoEntrega",
      "observacoes",
      "desconto",
      "taxaEntrega",
    ];

    const hasAtLeastOneField = fields.some(
      (field) => data[field as keyof UpdatePedidoInput] !== undefined
    );

    if (!hasAtLeastOneField) {
      throw new PedidoValidation("pedido", data, "at_least_one_field");
    }
  }

  private static validateAllFields(data: CreatePedidoInput) {
    const requiredFields: (keyof CreatePedidoInput)[] = [
      "clienteId",
      "total",
      "status",
      "criadoPorId",
    ];

    requiredFields.forEach((field) => {
      if (data[field] === undefined) {
        throw new PedidoValidation(
          "pedido",
          data[field],
          "all_fields_required"
        );
      }
    });
  }
}
