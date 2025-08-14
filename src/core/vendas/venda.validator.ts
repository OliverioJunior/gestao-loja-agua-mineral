import { BusinessRulesError } from "../error/domain.errors";
import {
  CreateVendaInput,
  TVenda,
  UpdateVendaInput,
  FormaPagamentoVenda,
} from "./venda.entity";
import { VendaValidation } from "./venda.errors";

export class VendaValidator {
  private static readonly MAX_TOTAL = 999999.99;
  private static readonly MIN_TOTAL = 0.01;
  private static readonly VALID_FORMA_PAGAMENTO: FormaPagamentoVenda[] = [
    "dinheiro",
    "cartao_debito",
    "cartao_credito",
    "pix",
  ];

  static validateInput(data: TVenda): { data: TVenda; validate: boolean } {
    this.validateAllFields(data);
    this.validateClienteId(data.clienteId);
    this.validatePedidoId(data.pedidoId);
    this.validateTotal(data.total);
    return { data, validate: true };
  }

  static validateCreateInput(data: CreateVendaInput) {
    this.validateClienteId(data.clienteId);
    this.validatePedidoId(data.pedidoId);
    this.validateTotal(data.total);
    
    if (data.formaPagamento !== undefined) {
      this.validateFormaPagamento(data.formaPagamento);
    }
    
    if (data.desconto !== undefined) {
      this.validateDesconto(data.desconto);
    }
    
    if (data.troco !== undefined) {
      this.validateTroco(data.troco);
      // Se há troco, deve ser pagamento em dinheiro
      if (data.troco > 0 && data.formaPagamento !== "dinheiro") {
        throw new BusinessRulesError(
          "Troco só é permitido para pagamentos em dinheiro",
          "troco_sem_dinheiro",
          { troco: data.troco, formaPagamento: data.formaPagamento }
        );
      }
    }
    
    this.validateAllFields(data);
    return { data, validate: true };
  }

  static validateUpdateInput(data: UpdateVendaInput) {
    if (data.total !== undefined) {
      this.validateTotal(data.total);
    }
    
    if (data.formaPagamento !== undefined) {
      this.validateFormaPagamento(data.formaPagamento);
    }
    
    if (data.desconto !== undefined) {
      this.validateDesconto(data.desconto);
    }
    
    if (data.troco !== undefined) {
      this.validateTroco(data.troco);
    }

    this.validateAtLeastOneField(data);
    return { update: true, data };
  }

  static validateId(id: string) {
    if (!id?.trim()) {
      throw new VendaValidation("id", id, "id_required");
    }
    return { id, validate: true };
  }

  static validateTotalVsPedido(totalVenda: number, totalPedido: number) {
    // Permite uma pequena diferença devido a arredondamentos
    const diferenca = Math.abs(totalVenda - totalPedido);
    const tolerancia = 0.01; // 1 centavo

    if (diferenca > tolerancia) {
      throw new BusinessRulesError(
        `Total da venda (${totalVenda}) não confere com o total do pedido (${totalPedido})`,
        "total_inconsistente",
        { totalVenda, totalPedido, diferenca }
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

  static validateTrocoVsPagamento(
    troco: number,
    valorPago: number,
    total: number
  ) {
    const trocoCalculado = valorPago - total;
    const diferenca = Math.abs(troco - trocoCalculado);
    const tolerancia = 0.01; // 1 centavo

    if (diferenca > tolerancia) {
      throw new BusinessRulesError(
        `Troco informado (${troco}) não confere com o cálculo (${trocoCalculado})`,
        "troco_sem_dinheiro",
        { troco, trocoCalculado, valorPago, total }
      );
    }
  }

  private static validateClienteId(clienteId: string) {
    if (!clienteId?.trim()) {
      throw new VendaValidation("clienteId", clienteId, "cliente_id_required");
    }
  }

  private static validatePedidoId(pedidoId: string) {
    if (!pedidoId?.trim()) {
      throw new VendaValidation("pedidoId", pedidoId, "pedido_id_required");
    }
  }

  private static validateTotal(total: number) {
    if (total === undefined || total === null) {
      throw new VendaValidation("total", total, "total_required");
    }

    if (typeof total !== "number" || total < this.MIN_TOTAL) {
      throw new VendaValidation("total", total, "total_positive");
    }

    if (total > this.MAX_TOTAL) {
      throw new VendaValidation("total", total, "total_positive");
    }
  }

  private static validateFormaPagamento(formaPagamento: FormaPagamentoVenda) {
    if (!this.VALID_FORMA_PAGAMENTO.includes(formaPagamento)) {
      throw new VendaValidation(
        "formaPagamento",
        formaPagamento,
        "forma_pagamento_invalid"
      );
    }
  }

  private static validateDesconto(desconto: number) {
    if (typeof desconto !== "number" || desconto < 0) {
      throw new VendaValidation("desconto", desconto, "desconto_invalid");
    }
  }

  private static validateTroco(troco: number) {
    if (typeof troco !== "number" || troco < 0) {
      throw new VendaValidation("troco", troco, "troco_invalid");
    }
  }

  private static validateAtLeastOneField(data: UpdateVendaInput) {
    const fields = [
      "total",
      "formaPagamento",
      "observacoes",
      "desconto",
      "troco",
    ];

    const hasAtLeastOneField = fields.some(
      (field) => data[field as keyof UpdateVendaInput] !== undefined
    );

    if (!hasAtLeastOneField) {
      throw new VendaValidation("venda", data, "at_least_one_field");
    }
  }

  private static validateAllFields(data: CreateVendaInput) {
    const requiredFields: (keyof CreateVendaInput)[] = [
      "clienteId",
      "pedidoId",
      "total",
      "criadoPorId",
      "atualizadoPorId",
    ];

    requiredFields.forEach((field) => {
      if (data[field] === undefined || data[field] === null) {
        throw new VendaValidation("venda", data[field], "all_fields_required");
      }
    });
  }
}