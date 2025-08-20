import {
  CreateVendaInput,
  TVendas,
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

  static validateInput(data: TVendas) {
    this.validateAllFields(data);
    this.validateTotal(data.total);
    return data;
  }

  static validateCreateInput(data: CreateVendaInput) {
    this.validateTotal(data.total);
    this.validateAllFields(data);
    return data;
  }

  static validateUpdateInput(data: UpdateVendaInput) {
    if (data.total !== undefined) {
      this.validateTotal(data.total);
    }

    this.validateAtLeastOneField(data);
    return data;
  }

  static validateId(id: string) {
    if (!id?.trim()) {
      throw new VendaValidation("id", id, "id_required");
    }
    return { id, validate: true };
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
    ];

    requiredFields.forEach((field) => {
      if (data[field] === undefined || data[field] === null) {
        throw new VendaValidation("venda", data[field], "all_fields_required");
      }
    });
  }
}
