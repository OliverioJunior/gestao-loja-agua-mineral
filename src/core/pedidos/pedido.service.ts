import { ErrorHandler } from "../error/errors-handler";
import {
  IPedidoRepository,
  CreatePedidoInput,
  UpdatePedidoInput,
  TPedido,
  TPedidoWithRelations,
  TPedidoComplete,
  StatusPedido,
  IPedidoStats,
} from "./pedido.entity";
import {
  PedidoNotFoundError,
  PedidoConflictError,
  PedidoBusinessRulesError,
} from "./pedido.errors";
import { PedidoValidator } from "./pedido.validator";
import { PrismaClient } from "@/infrastructure/generated/prisma";
import { prisma } from "@/infrastructure";
import { ClienteService } from "../cliente/cliente.service";
import { ClienteRepository } from "../cliente/cliente.repository";
import { ItemService } from "../item/item.service";
import { ItemRepository } from "../item/item.repository";

export class PedidoService {
  private clienteService: ClienteService;
  private itemService: ItemService;

  constructor(
    private pedidoRepository: IPedidoRepository,
    private readonly db: PrismaClient = prisma
  ) {
    // Inicializar serviços de dependências para delegar operações
    this.clienteService = new ClienteService(new ClienteRepository());
    this.itemService = new ItemService(new ItemRepository());
  }

  async create(data: CreatePedidoInput): Promise<TPedido> {
    try {
      PedidoValidator.validateCreateInput(data);

      const pedido = await this.pedidoRepository.create(data);

      return pedido;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "criação de pedido");
    }
  }

  async update(id: string, data: UpdatePedidoInput): Promise<TPedido> {
    try {
      PedidoValidator.validateId(id);
      PedidoValidator.validateUpdateInput(data);

      const existingPedido = await this.pedidoRepository.findById(id);
      if (!existingPedido) {
        throw new PedidoNotFoundError(id);
      }

      // Verificar se o pedido pode ser modificado
      await this.validatePedidoPodeSerModificado(existingPedido.status);

      // Validar transição de status se fornecida
      if (data.status !== undefined) {
        PedidoValidator.validateStatusTransition(
          existingPedido.status,
          data.status
        );
      }

      // Validar desconto vs total se fornecido
      if (data.desconto !== undefined && data.total !== undefined) {
        PedidoValidator.validateDescontoVsTotal(data.desconto, data.total);
      } else if (data.desconto !== undefined) {
        PedidoValidator.validateDescontoVsTotal(
          data.desconto,
          existingPedido.total
        );
      } else if (data.total !== undefined && existingPedido.total) {
        const desconto = 0; // Assumir desconto zero se não fornecido
        PedidoValidator.validateDescontoVsTotal(desconto, data.total);
      }

      const updatedPedido = await this.pedidoRepository.update(id, data);

      return updatedPedido;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "atualização de pedido");
    }
  }

  async delete(id: string): Promise<TPedido> {
    try {
      PedidoValidator.validateId(id);

      const existingPedido = await this.pedidoRepository.findById(id);
      if (!existingPedido) {
        throw new PedidoNotFoundError(id);
      }

      // Verificar se o pedido pode ser deletado
      await this.validatePedidoPodeSerDeletado(existingPedido.status);

      // Verificar se há itens no pedido e restaurar estoque
      if (existingPedido.itens && existingPedido.itens.length > 0) {
        // Delegar para ItemService a restauração de estoque
        for (const item of existingPedido.itens) {
          await this.itemService.delete(item.id);
        }
      }

      const deletedPedido = await this.pedidoRepository.delete(id);

      return deletedPedido;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "exclusão de pedido");
    }
  }

  async findById(id: string): Promise<TPedidoComplete | null> {
    try {
      PedidoValidator.validateId(id);
      return await this.pedidoRepository.findById(id);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de pedido");
    }
  }

  async findAll(): Promise<TPedidoWithRelations[]> {
    try {
      return await this.pedidoRepository.findAll();
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de pedidos");
    }
  }

  async findByClienteId(clienteId: string): Promise<TPedidoWithRelations[]> {
    try {
      return await this.pedidoRepository.findByClienteId(clienteId);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de pedidos por cliente"
      );
    }
  }

  async findByStatus(status: StatusPedido): Promise<TPedidoWithRelations[]> {
    try {
      return await this.pedidoRepository.findByStatus(status);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de pedidos por status"
      );
    }
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<TPedidoWithRelations[]> {
    try {
      return await this.pedidoRepository.findByDateRange(startDate, endDate);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de pedidos por período"
      );
    }
  }

  async getStatistics(): Promise<IPedidoStats> {
    try {
      const stats = await this.pedidoRepository.getStatistics();

      // Calcular ticket médio
      const ticketMedio =
        stats.entregues > 0 ? stats.faturamentoMensal / stats.entregues : 0;

      return {
        ...stats,
        ticketMedio,
      };
    } catch (error) {
      console.error(error);
      return ErrorHandler.handleRepositoryError(
        error,
        "cálculo de estatísticas de pedidos"
      );
    }
  }

  async updateStatus(
    id: string,
    status: StatusPedido,
    userId: string
  ): Promise<TPedido> {
    try {
      PedidoValidator.validateId(id);
      PedidoValidator.validateStatus(status);

      const existingPedido = await this.pedidoRepository.findById(id);
      if (!existingPedido) {
        throw new PedidoNotFoundError(id);
      }

      // Validar transição de status
      PedidoValidator.validateStatusTransition(existingPedido.status, status);

      return await this.pedidoRepository.updateStatus(id, status, userId);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "atualização de status do pedido"
      );
    }
  }

  async calculateTotal(pedidoId: string): Promise<number> {
    try {
      // Delegar para ItemService o cálculo do total
      return await this.itemService.calculateTotalByPedido(pedidoId);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "cálculo de total do pedido"
      );
    }
  }

  async validateTotalConsistency(pedidoId: string): Promise<boolean> {
    try {
      const pedido = await this.pedidoRepository.findById(pedidoId);
      if (!pedido) {
        throw new PedidoNotFoundError(pedidoId);
      }

      const totalItens = await this.calculateTotal(pedidoId);
      PedidoValidator.validateTotalVsItens(pedido.total, totalItens);

      return true;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "validação de consistência do total"
      );
    }
  }

  // Métodos privados de validação
  private async validateClienteExists(clienteId: string): Promise<void> {
    // Delegar para ClienteService - responsabilidade do módulo cliente
    const cliente = await this.clienteService.findById(clienteId);

    if (!cliente) {
      throw new PedidoBusinessRulesError(
        `Cliente com ID ${clienteId} não encontrado`,
        "cliente_inativo",
        { clienteId }
      );
    }

    if (cliente.status !== "ATIVO") {
      throw new PedidoBusinessRulesError(
        `Cliente ${cliente.nome} está inativo`,
        "cliente_inativo",
        { clienteId, nome: cliente.nome }
      );
    }
  }

  private async validateClienteNaoTemPedidoAtivo(
    clienteId: string
  ): Promise<void> {
    const pedidoAtivo = await this.pedidoRepository.findActivePedidoByCliente(
      clienteId
    );

    if (pedidoAtivo) {
      throw new PedidoConflictError(
        "cliente_pedido_ativo",
        `${clienteId}-${pedidoAtivo.id}`
      );
    }
  }

  private async validatePedidoPodeSerModificado(
    status: StatusPedido
  ): Promise<void> {
    if (status !== "PENDENTE") {
      throw new PedidoBusinessRulesError(
        `Pedido com status ${status} não pode ser modificado`,
        "pedido_ja_finalizado",
        { status }
      );
    }
  }

  private async validatePedidoPodeSerDeletado(
    status: StatusPedido
  ): Promise<void> {
    if (status === "ENTREGUE") {
      throw new PedidoBusinessRulesError(
        "Pedido entregue não pode ser deletado",
        "pedido_ja_finalizado",
        { status }
      );
    }
  }
}
