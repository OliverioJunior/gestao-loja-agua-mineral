import {
  TCompra,
  TCompraWithRelations,
  CreateCompraInput,
  UpdateCompraInput,
  ICompraRepository,
} from "./compra.entity";
import { CompraValidation } from "./compra.validation";
import {
  CompraNotFoundError,
  CompraAlreadyReceivedError,
  CompraCanceladaError,
} from "./compra.errors";
import { ErrorHandler } from "../../error/errors-handler";
import { EstoqueService } from "./estoque.service";
import { StatusCompra } from "@/infrastructure/generated/prisma";

export interface ICompraService {
  // Operações CRUD
  create(data: CreateCompraInput): Promise<TCompra>;
  update(id: string, data: UpdateCompraInput): Promise<TCompra>;
  delete(id: string): Promise<TCompra>;
  findById(id: string): Promise<TCompraWithRelations | null>;
  findAll(): Promise<TCompraWithRelations[]>;

  // Operações específicas do domínio
  findByFornecedorId(fornecedorId: string): Promise<TCompraWithRelations[]>;
  findByStatus(status: string): Promise<TCompraWithRelations[]>;
  findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<TCompraWithRelations[]>;
  findByNumeroNota(numeroNota: string): Promise<TCompraWithRelations | null>;
  calculateTotalByFornecedor(fornecedorId: string): Promise<number>;
  getStatistics(): Promise<{
    total: number;
    pendentes: number;
    confirmadas: number;
    recebidas: number;
    canceladas: number;
    valorTotal: number;
    valorMedio: number;
  }>;

  // Operações de negócio
  confirmarCompra(id: string, userId: string): Promise<TCompra>;
  receberCompra(id: string, userId: string): Promise<TCompra>;
  cancelarCompra(id: string, userId: string): Promise<TCompra>;
  updateStatus(id: string, newStatus: string, userId: string): Promise<TCompra>;
  getComprasPendentes(): Promise<TCompraWithRelations[]>;
  getComprasVencidas(): Promise<TCompraWithRelations[]>;
}

export class CompraService implements ICompraService {
  constructor(private compraRepository: ICompraRepository) {}

  /**
   * Cria uma nova compra
   */
  async create(data: CreateCompraInput): Promise<TCompra> {
    try {
      // Validar entrada
      CompraValidation.validateCreateInput(data);

      // Validar UUIDs
      CompraValidation.validateUUID(data.fornecedorId, "fornecedorId");
      CompraValidation.validateUUID(data.criadoPorId, "criadoPorId");

      // Validar número da nota se fornecido
      if (data.numeroNota) {
        CompraValidation.validateNumeroNota(data.numeroNota);
      }

      // Executar operação
      return await this.compraRepository.create(data);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "criação de compra");
    }
  }

  /**
   * Atualiza uma compra existente
   */
  async update(id: string, data: UpdateCompraInput): Promise<TCompra> {
    try {
      // Validar entrada
      CompraValidation.validateUpdateInput(data);
      CompraValidation.validateUUID(id, "id");

      if (data.atualizadoPorId) {
        CompraValidation.validateUUID(data.atualizadoPorId, "atualizadoPorId");
      }

      // Validar número da nota se fornecido
      if (data.numeroNota) {
        CompraValidation.validateNumeroNota(data.numeroNota);
      }

      // Verificar se a compra existe e obter dados atuais
      const compraAtual = await this.compraRepository.findById(id);
      if (!compraAtual) {
        throw new CompraNotFoundError("id", id);
      }

      // Verificar se a compra pode ser alterada
      this.validateCompraCanBeModified(compraAtual);

      // Validar transição de status se fornecida
      if (data.status && data.status !== compraAtual.status) {
        CompraValidation.validateStatusTransition(
          compraAtual.status,
          data.status
        );
      }

      // Validar desconto com total atual se necessário
      if (data.desconto !== undefined && data.total === undefined) {
        CompraValidation.validateUpdateInput({
          ...data,
          total: compraAtual.total,
        });
      }

      // Executar operação
      return await this.compraRepository.update(id, data);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "atualização de compra");
    }
  }

  /**
   * Remove uma compra
   */
  async delete(id: string): Promise<TCompra> {
    try {
      CompraValidation.validateUUID(id, "id");

      // Verificar se a compra existe
      const compra = await this.compraRepository.findById(id);
      if (!compra) {
        throw new CompraNotFoundError("id", id);
      }

      // Verificar se a compra pode ser excluída
      this.validateCompraCanBeDeleted(compra);

      return await this.compraRepository.delete(id);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "exclusão de compra");
    }
  }

  /**
   * Busca uma compra por ID
   */
  async findById(id: string): Promise<TCompraWithRelations | null> {
    try {
      CompraValidation.validateUUID(id, "id");
      return await this.compraRepository.findById(id);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de compra por ID"
      );
    }
  }

  /**
   * Lista todas as compras
   */
  async findAll(): Promise<TCompraWithRelations[]> {
    try {
      return await this.compraRepository.findAll();
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "listagem de compras");
    }
  }

  /**
   * Busca compras por fornecedor
   */
  async findByFornecedorId(
    fornecedorId: string
  ): Promise<TCompraWithRelations[]> {
    try {
      CompraValidation.validateUUID(fornecedorId, "fornecedorId");
      return await this.compraRepository.findByFornecedorId(fornecedorId);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de compras por fornecedor"
      );
    }
  }

  /**
   * Busca compras por status
   */
  async findByStatus(status: string): Promise<TCompraWithRelations[]> {
    try {
      // Validar status
      const validStatuses = ["PENDENTE", "CONFIRMADA", "RECEBIDA", "CANCELADA"];
      if (!validStatuses.includes(status)) {
        throw new Error(`Status inválido: ${status}`);
      }

      return await this.compraRepository.findByStatus(status);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de compras por status"
      );
    }
  }

  /**
   * Busca compras por intervalo de datas
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<TCompraWithRelations[]> {
    try {
      // Validar datas
      if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        throw new Error("Datas devem ser objetos Date válidos");
      }

      if (startDate > endDate) {
        throw new Error("Data inicial não pode ser maior que data final");
      }

      return await this.compraRepository.findByDateRange(startDate, endDate);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de compras por intervalo de datas"
      );
    }
  }

  /**
   * Busca compra por número da nota
   */
  async findByNumeroNota(
    numeroNota: string
  ): Promise<TCompraWithRelations | null> {
    try {
      CompraValidation.validateNumeroNota(numeroNota);
      return await this.compraRepository.findByNumeroNota(numeroNota);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de compra por número da nota"
      );
    }
  }

  /**
   * Calcula total de compras por fornecedor
   */
  async calculateTotalByFornecedor(fornecedorId: string): Promise<number> {
    try {
      CompraValidation.validateUUID(fornecedorId, "fornecedorId");
      return await this.compraRepository.calculateTotalByFornecedor(
        fornecedorId
      );
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "cálculo de total por fornecedor"
      );
    }
  }

  /**
   * Obtém estatísticas das compras
   */
  async getStatistics(): Promise<{
    total: number;
    pendentes: number;
    confirmadas: number;
    recebidas: number;
    canceladas: number;
    valorTotal: number;
    valorMedio: number;
  }> {
    try {
      return await this.compraRepository.getStatistics();
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "obtenção de estatísticas de compras"
      );
    }
  }

  /**
   * Confirma uma compra
   */
  async confirmarCompra(id: string, userId: string): Promise<TCompra> {
    try {
      return await this.updateStatus(id, "CONFIRMADA", userId);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "confirmação de compra");
    }
  }

  /**
   * Recebe uma compra e atualiza o estoque
   */
  async receberCompra(id: string, userId: string): Promise<TCompra> {
    try {
      // Buscar compra com itens antes de atualizar
      const compraAntes = await this.compraRepository.findById(id);
      if (!compraAntes) {
        throw new CompraNotFoundError("id", id);
      }

      // Atualizar status da compra
      const compraAtualizada = await this.updateStatus(id, "RECEBIDA", userId);

      // Buscar compra atualizada com itens para atualizar estoque
      const compraCompleta = await this.compraRepository.findById(id);
      if (compraCompleta) {
        try {
          await EstoqueService.atualizarEstoqueCompra(compraCompleta);
        } catch (estoqueError) {
          console.error(
            `Erro ao atualizar estoque para compra ${id}:`,
            estoqueError
          );
          // Não falhar a operação se houver erro no estoque, apenas logar
        }
      }

      return compraAtualizada;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "recebimento de compra");
    }
  }

  /**
   * Cancela uma compra e reverte o estoque se necessário
   */
  async cancelarCompra(id: string, userId: string): Promise<TCompra> {
    try {
      // Buscar compra antes de cancelar
      const compraAntes = await this.compraRepository.findById(id);
      if (!compraAntes) {
        throw new CompraNotFoundError("id", id);
      }

      // Se a compra estava recebida, reverter estoque
      if (compraAntes.status === "RECEBIDA") {
        try {
          await EstoqueService.reverterEstoqueCompra(compraAntes);
        } catch (estoqueError) {
          console.error(
            `Erro ao reverter estoque para compra ${id}:`,
            estoqueError
          );
          // Não falhar a operação se houver erro no estoque, apenas logar
        }
      }

      // Cancelar compra
      return await this.updateStatus(id, "CANCELADA", userId);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "cancelamento de compra"
      );
    }
  }

  /**
   * Atualiza status da compra
   */
  async updateStatus(
    id: string,
    newStatus: StatusCompra,
    userId: string
  ): Promise<TCompra> {
    try {
      CompraValidation.validateUUID(id, "id");
      CompraValidation.validateUUID(userId, "userId");

      // Verificar se a compra existe
      const compra = await this.compraRepository.findById(id);
      if (!compra) {
        throw new CompraNotFoundError("id", id);
      }

      // Verificar se a compra pode ter o status alterado
      this.validateCompraCanChangeStatus(compra, newStatus);

      // Validar transição de status
      CompraValidation.validateStatusTransition(compra.status, newStatus);

      return await this.compraRepository.update(id, {
        status: newStatus,
        atualizadoPorId: userId,
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "atualização de status de compra"
      );
    }
  }

  /**
   * Obtém compras pendentes
   */
  async getComprasPendentes(): Promise<TCompraWithRelations[]> {
    try {
      return await this.compraRepository.findByStatus("PENDENTE");
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de compras pendentes"
      );
    }
  }

  /**
   * Obtém compras vencidas
   */
  async getComprasVencidas(): Promise<TCompraWithRelations[]> {
    try {
      const hoje = new Date();
      const todasCompras = await this.compraRepository.findAll();

      return todasCompras.filter(
        (compra) =>
          compra.dataVencimento &&
          compra.dataVencimento < hoje &&
          ["PENDENTE", "CONFIRMADA"].includes(compra.status)
      );
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de compras vencidas"
      );
    }
  }

  /**
   * Valida se a compra pode ser modificada
   */
  private validateCompraCanBeModified(compra: TCompraWithRelations): void {
    if (compra.status === "RECEBIDA") {
      throw new CompraAlreadyReceivedError(compra.id);
    }

    if (compra.status === "CANCELADA") {
      throw new CompraCanceladaError(compra.id);
    }
  }

  /**
   * Valida se a compra pode ser excluída
   */
  private validateCompraCanBeDeleted(compra: TCompraWithRelations): void {
    // Compras recebidas não podem ser excluídas
    if (compra.status === "RECEBIDA") {
      throw new CompraAlreadyReceivedError(compra.id);
    }
  }

  /**
   * Valida se a compra pode ter o status alterado
   */
  private validateCompraCanChangeStatus(
    compra: TCompraWithRelations,
    newStatus: string
  ): void {
    // Se já está no status desejado, não fazer nada
    if (compra.status === newStatus) {
      return;
    }

    // Compras recebidas não podem ter status alterado
    if (compra.status === "RECEBIDA") {
      throw new CompraAlreadyReceivedError(compra.id);
    }

    // Compras canceladas não podem ter status alterado
    if (compra.status === "CANCELADA") {
      throw new CompraCanceladaError(compra.id);
    }
  }
}
