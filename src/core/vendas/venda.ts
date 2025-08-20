import { CreateVendaInput, TVendas, UpdateVendaInput } from "./venda.entity";
import { VendaValidator } from "./venda.validator";

export class Venda {
  constructor(private readonly data: TVendas) {
    this.data = data;
  }

  static create(data: CreateVendaInput) {
    return VendaValidator.validateCreateInput(data);
  }
  static update(data: UpdateVendaInput) {
    return VendaValidator.validateUpdateInput(data);
  }

  getData(): TVendas {
    return VendaValidator.validateInput(this.data);
  }

  getFormattedTotal(): string {
    return (this.data.total / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  getFormattedDate(): string {
    return this.data.data.toLocaleDateString("pt-BR");
  }

  getFormattedDateTime(): string {
    return this.data.data.toLocaleString("pt-BR");
  }

  getFormaPagamentoIcon(): string {
    // Simulado - seria necessário adicionar campo no schema
    return "💳";
  }

  isToday(): boolean {
    const hoje = new Date();
    const dataVenda = new Date(this.data.data);

    return (
      hoje.getDate() === dataVenda.getDate() &&
      hoje.getMonth() === dataVenda.getMonth() &&
      hoje.getFullYear() === dataVenda.getFullYear()
    );
  }

  canBeDeleted(): boolean {
    // Vendas só podem ser deletadas no mesmo dia
    return this.isToday();
  }

  canBeModified(): boolean {
    // Vendas só podem ser modificadas no mesmo dia
    return this.isToday();
  }

  getDaysSinceCreation(): number {
    const hoje = new Date();
    const dataVenda = new Date(this.data.data);
    const diffTime = Math.abs(hoje.getTime() - dataVenda.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getQuarter(): number {
    const mes = this.data.data.getMonth() + 1; // getMonth() retorna 0-11
    return Math.ceil(mes / 3);
  }

  getYear(): number {
    return this.data.data.getFullYear();
  }

  getMonth(): number {
    return this.data.data.getMonth() + 1; // getMonth() retorna 0-11
  }

  getMonthName(): string {
    const nomesMeses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return nomesMeses[this.data.data.getMonth()];
  }
}
