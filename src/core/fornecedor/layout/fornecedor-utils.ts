import { TFornecedorWithRelations } from "../domain/fornecedor.entity";

/**
 * Utilitários para formatação e manipulação de dados de fornecedores
 */
export class FornecedorUtils {
  /**
   * Formata CNPJ para exibição
   */
  static formatCnpj(cnpj: string): string {
    if (!cnpj) return "";

    const cleanCnpj = cnpj.replace(/\D/g, "");

    if (cleanCnpj.length !== 14) return cnpj;

    return cleanCnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }

  /**
   * Formata CPF para exibição
   */
  static formatCpf(cpf: string): string {
    if (!cpf) return "";

    const cleanCpf = cpf.replace(/\D/g, "");

    if (cleanCpf.length !== 11) return cpf;

    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  /**
   * Formata telefone para exibição
   */
  static formatTelefone(telefone: string): string {
    if (!telefone) return "";

    const cleanTelefone = telefone.replace(/\D/g, "");

    if (cleanTelefone.length === 10) {
      return cleanTelefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }

    if (cleanTelefone.length === 11) {
      return cleanTelefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    return telefone;
  }

  /**
   * Remove formatação de documento
   */
  static cleanDocument(document: string): string {
    return document.replace(/\D/g, "");
  }

  /**
   * Remove formatação de telefone
   */
  static cleanTelefone(telefone: string): string {
    return telefone.replace(/\D/g, "");
  }

  /**
   * Obtém o documento principal do fornecedor (CNPJ ou CPF)
   */
  static getPrimaryDocument(fornecedor: TFornecedorWithRelations): {
    type: "CNPJ" | "CPF" | null;
    value: string;
    formatted: string;
  } {
    if (fornecedor.cnpj) {
      return {
        type: "CNPJ",
        value: fornecedor.cnpj,
        formatted: this.formatCnpj(fornecedor.cnpj),
      };
    }

    if (fornecedor.cpf) {
      return {
        type: "CPF",
        value: fornecedor.cpf,
        formatted: this.formatCpf(fornecedor.cpf),
      };
    }

    return {
      type: null,
      value: "",
      formatted: "Não informado",
    };
  }

  /**
   * Formata a data de criação do fornecedor
   */
  static formatDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  }

  /**
   * Formata apenas a data (sem hora)
   */
  static formatDateOnly(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dateObj);
  }

  /**
   * Obtém a cor do status
   */
  static getStatusColor(status: string): {
    bg: string;
    text: string;
    border: string;
  } {
    switch (status) {
      case "ATIVO":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
        };
      case "INATIVO":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
        };
    }
  }

  /**
   * Obtém o texto do status
   */
  static getStatusText(status: string): string {
    switch (status) {
      case "ATIVO":
        return "Ativo";
      case "INATIVO":
        return "Inativo";
      default:
        return "Desconhecido";
    }
  }

  /**
   * Gera um resumo do fornecedor para exibição
   */
  static getFornecedorSummary(fornecedor: TFornecedorWithRelations): string {
    const document = this.getPrimaryDocument(fornecedor);
    return `${fornecedor.nome} - ${document.formatted}`;
  }

  /**
   * Obtém o nome de exibição do fornecedor
   */
  static getDisplayName(fornecedor: TFornecedorWithRelations): string {
    if (fornecedor.razaoSocial && fornecedor.razaoSocial !== fornecedor.nome) {
      return `${fornecedor.nome} (${fornecedor.razaoSocial})`;
    }
    return fornecedor.nome;
  }

  /**
   * Verifica se o fornecedor está ativo
   */
  static isActive(fornecedor: TFornecedorWithRelations): boolean {
    return fornecedor.status === "ATIVO";
  }

  /**
   * Obtém informações de contato do fornecedor
   */
  static getContactInfo(fornecedor: TFornecedorWithRelations): {
    email?: string;
    telefone?: string;
    hasContact: boolean;
  } {
    return {
      email: fornecedor.email || undefined,
      telefone: fornecedor.telefone
        ? this.formatTelefone(fornecedor.telefone)
        : undefined,
      hasContact: !!(fornecedor.email || fornecedor.telefone),
    };
  }

  /**
   * Calcula estatísticas de compras do fornecedor
   */
  static getComprasStatistics(fornecedor: TFornecedorWithRelations): {
    totalCompras: number;
    totalItens: number;
  } {
    const totalCompras = fornecedor.compras?.length || 0;
    const totalItens =
      fornecedor.compras?.reduce(
        (sum, compra) => sum + (compra.itens?.length || 0),
        0
      ) || 0;

    return {
      totalCompras,
      totalItens,
    };
  }

  /**
   * Gera dados para exportação
   */
  static toExportData(
    fornecedor: TFornecedorWithRelations
  ): Record<string, string | number> {
    const document = this.getPrimaryDocument(fornecedor);
    const contact = this.getContactInfo(fornecedor);
    const compras = this.getComprasStatistics(fornecedor);

    return {
      Nome: fornecedor.nome,
      "Razão Social": fornecedor.razaoSocial || "",
      Documento: document.formatted,
      "Tipo Documento": document.type || "",
      Email: contact.email || "",
      Telefone: contact.telefone || "",
      Status: this.getStatusText(fornecedor.status),
      "Total Compras": compras.totalCompras,
      "Data Cadastro": this.formatDate(fornecedor.createdAt),
      "Última Atualização": this.formatDate(fornecedor.updatedAt),
    };
  }

  /**
   * Agrupa fornecedores por status
   */
  static groupByStatus(
    fornecedores: TFornecedorWithRelations[]
  ): Record<string, TFornecedorWithRelations[]> {
    return fornecedores.reduce((groups, fornecedor) => {
      const status = fornecedor.status;
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(fornecedor);
      return groups;
    }, {} as Record<string, TFornecedorWithRelations[]>);
  }

  /**
   * Filtra fornecedores por termo de busca
   */
  static filterBySearchTerm(
    fornecedores: TFornecedorWithRelations[],
    searchTerm: string
  ): TFornecedorWithRelations[] {
    if (!searchTerm.trim()) return fornecedores;

    const term = searchTerm.toLowerCase();
    return fornecedores.filter((fornecedor) => {
      const document = this.getPrimaryDocument(fornecedor);

      return (
        fornecedor.nome?.toLowerCase().includes(term) ||
        fornecedor.razaoSocial?.toLowerCase().includes(term) ||
        document.value.includes(term) ||
        fornecedor.email?.toLowerCase().includes(term)
      );
    });
  }

  /**
   * Calcula estatísticas de uma lista de fornecedores
   */
  static calculateStatistics(fornecedores: TFornecedorWithRelations[]) {
    const total = fornecedores.length;
    const ativos = fornecedores.filter((f) => f.status === "ATIVO").length;
    const inativos = fornecedores.filter((f) => f.status === "INATIVO").length;
    const totalCompras = fornecedores.reduce(
      (sum, f) => sum + (f.compras?.length || 0),
      0
    );

    return {
      total,
      ativos,
      inativos,
      totalCompras,
      percentualAtivos: total > 0 ? (ativos / total) * 100 : 0,
      percentualInativos: total > 0 ? (inativos / total) * 100 : 0,
    };
  }

  /**
   * Valida se um email é válido
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida se um telefone é válido (formato brasileiro)
   */
  static isValidTelefone(telefone: string): boolean {
    const cleanTelefone = this.cleanTelefone(telefone);
    return cleanTelefone.length >= 10 && cleanTelefone.length <= 11;
  }

  /**
   * Obtém sugestões de busca baseadas nos fornecedores
   */
  static getSearchSuggestions(
    fornecedores: TFornecedorWithRelations[]
  ): string[] {
    const suggestions = new Set<string>();

    fornecedores.forEach((fornecedor) => {
      if (fornecedor.nome) suggestions.add(fornecedor.nome);
      if (fornecedor.razaoSocial) suggestions.add(fornecedor.razaoSocial);
    });

    return Array.from(suggestions).sort();
  }
}
