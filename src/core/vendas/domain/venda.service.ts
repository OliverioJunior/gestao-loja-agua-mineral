import { ErrorHandler } from "../../error/errors-handler";
import {
  IVendaRepository,
  CreateVendaInput,
  UpdateVendaInput,
  TVendas,
  TVendaWithRelations,
  TVendaComplete,
} from "./venda.entity";
import { VendaNotFoundError, VendaBusinessRulesError } from "./venda.errors";
import { VendaValidation } from "./venda.validation";

import { PedidoService } from "../../pedidos/domain/pedido.service";
import { PedidoRepository } from "../../pedidos/domain/pedido.repository";

import { prisma } from "@/infrastructure";

export class VendaService {
  private pedidoService: PedidoService;

  constructor(private vendaRepository: IVendaRepository) {
    // Inicializar serviços de dependências para delegar operações

    this.pedidoService = new PedidoService(new PedidoRepository());
  }

  async create(data: CreateVendaInput): Promise<TVendas> {
    try {
      VendaValidation.validateCreateInput(data);

      return await this.vendaRepository.create(data);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "criação de venda");
    }
  }

  async update(id: string, data: UpdateVendaInput): Promise<TVendas> {
    try {
      VendaValidation.validateId(id);
      VendaValidation.validateUpdateInput(data);

      const existingVenda = await this.vendaRepository.findById(id);
      if (!existingVenda) {
        throw new VendaNotFoundError(id);
      }
      const updatedVenda = await this.vendaRepository.update(id, data);

      return updatedVenda;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "atualização de venda");
    }
  }

  async delete(id: string): Promise<TVendas> {
    try {
      VendaValidation.validateId(id);

      const existingVenda = await this.vendaRepository.findById(id);
      if (!existingVenda) {
        throw new VendaNotFoundError(id);
      }

      // Verificar se a venda pode ser deletada (regra de negócio)
      await this.validateVendaPodeSerDeletada(existingVenda);

      const deletedVenda = await this.vendaRepository.delete(id);

      return deletedVenda;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "exclusão de venda");
    }
  }

  async findById(id: string): Promise<TVendaComplete | null> {
    try {
      VendaValidation.validateId(id);
      return await this.vendaRepository.findById(id);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de venda");
    }
  }

  async findAll(): Promise<TVendaWithRelations[]> {
    try {
      return await this.vendaRepository.findAll();
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de vendas");
    }
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<TVendaWithRelations[]> {
    try {
      return await this.vendaRepository.findByDateRange(startDate, endDate);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de vendas por período"
      );
    }
  }

  async processarVendaPedido(
    pedidoId: string,
    userId: string
  ): Promise<TVendas> {
    try {
      const pedido = await this.pedidoService.findById(pedidoId);
      if (!pedido) {
        throw new VendaBusinessRulesError(
          `Pedido ${pedidoId} não encontrado`,
          "pedido_nao_encontrado",
          { pedidoId }
        );
      }

      // Verificar se pedido está entregue
      if (pedido.status !== "ENTREGUE") {
        throw new VendaBusinessRulesError(
          `Pedido ${pedidoId} não está entregue (status: ${pedido.status})`,
          "pedido_nao_entregue",
          { pedidoId, status: pedido.status }
        );
      }
      const itens = pedido.itens;
      for (const item of itens) {
        const produtoId = item.produtoId;
        await prisma.produto.update({
          where: { id: produtoId },
          data: {
            estoque: {
              decrement: item.quantidade,
            },
          },
        });
      }
      // Criar venda
      const vendaData: CreateVendaInput = {
        clienteId: pedido.clienteId,
        pedidoId: pedido.id,
        total: pedido.total,
        criadoPorId: userId,
      };

      return await this.create(vendaData);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "processamento de venda do pedido"
      );
    }
  }

  private async validateVendaPodeSerDeletada(
    venda: TVendaComplete
  ): Promise<void> {
    // Regra de negócio: vendas só podem ser deletadas no mesmo dia
    const hoje = new Date();
    const dataVenda = new Date(venda.data);

    const mesmoDia =
      hoje.getDate() === dataVenda.getDate() &&
      hoje.getMonth() === dataVenda.getMonth() &&
      hoje.getFullYear() === dataVenda.getFullYear();

    if (!mesmoDia) {
      throw new VendaBusinessRulesError(
        "Vendas só podem ser deletadas no mesmo dia da criação",
        "venda_ja_processada",
        { dataVenda: venda.data, hoje }
      );
    }
  }
}
