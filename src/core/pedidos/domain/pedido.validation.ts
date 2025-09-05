import { BusinessRulesError } from "../../error/domain.errors";
import {
  CreatePedidoInput,
  TPedido,
  UpdatePedidoInput,
  StatusPedido,
  TipoEntrega,
  FormaPagamento,
} from "./pedido.entity";
import { PedidoValidationError } from "./pedido.errors";

export class PedidoValidation {
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
      this.validateFormaPagamento(data.formaPagamento as FormaPagamento);
    }

    if (data.desconto !== undefined) {
      this.validateDesconto(data.desconto || 0);
    }

    if (data.taxaEntrega !== undefined) {
      this.validateTaxaEntrega(data.taxaEntrega || 0);
    }

    this.validateAllFields(data);
    return data;
  }

  static validateUpdateInput(data: UpdatePedidoInput) {
    if (data.total !== undefined) {
      const totalValue =
        typeof data.total === "number" ? data.total : data.total?.set || 0;
      this.validateTotal(totalValue);
    }

    if (data.status !== undefined) {
      this.validateStatus(data.status as StatusPedido);
    }

    if (data.formaPagamento !== undefined) {
      this.validateFormaPagamento(data.formaPagamento as FormaPagamento);
    }

    if (data.desconto !== undefined) {
      const descontoValue =
        typeof data.desconto === "number"
          ? data.desconto
          : data.desconto?.set || 0;
      this.validateDesconto(descontoValue);
    }

    if (data.taxaEntrega !== undefined) {
      const taxaEntregaValue =
        typeof data.taxaEntrega === "number"
          ? data.taxaEntrega
          : data.taxaEntrega?.set || 0;
      this.validateTaxaEntrega(taxaEntregaValue);
    }

    this.validateAtLeastOneField(data);
    return data;
  }

  static validateId(id: string) {
    if (!id?.trim()) {
      throw new PedidoValidationError("id", id, "id_required");
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
      throw new PedidoValidationError(
        "clienteId",
        clienteId,
        "cliente_id_required"
      );
    }
  }

  private static validateTotal(total: number) {
    if (total === undefined || total === null) {
      throw new PedidoValidationError("total", total, "total_required");
    }

    if (typeof total !== "number" || total < this.MIN_TOTAL) {
      throw new PedidoValidationError("total", total, "total_positive");
    }

    if (total > this.MAX_TOTAL) {
      throw new PedidoValidationError("total", total, "total_positive");
    }
  }

  static validateStatus(status: StatusPedido) {
    if (!this.VALID_STATUS.includes(status)) {
      throw new PedidoValidationError("status", status, "status_invalid");
    }
  }

  private static validateTipoEntrega(tipoEntrega: TipoEntrega) {
    if (!this.VALID_TIPO_ENTREGA.includes(tipoEntrega)) {
      throw new PedidoValidationError(
        "tipoEntrega",
        tipoEntrega,
        "tipo_entrega_invalid"
      );
    }
  }

  private static validateFormaPagamento(formaPagamento: FormaPagamento) {
    if (!this.VALID_FORMA_PAGAMENTO.includes(formaPagamento)) {
      throw new PedidoValidationError(
        "formaPagamento",
        formaPagamento,
        "forma_pagamento_invalid"
      );
    }
  }

  private static validateDesconto(desconto: number) {
    if (typeof desconto !== "number" || desconto < 0) {
      throw new PedidoValidationError("desconto", desconto, "desconto_invalid");
    }
  }

  private static validateTaxaEntrega(taxaEntrega: number) {
    if (typeof taxaEntrega !== "number" || taxaEntrega < 0) {
      throw new PedidoValidationError(
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
      throw new PedidoValidationError("pedido", data, "at_least_one_field");
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
        throw new PedidoValidationError(
          "pedido",
          data[field],
          "all_fields_required"
        );
      }
    });
  }
}
