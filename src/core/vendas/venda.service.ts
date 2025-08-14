import { ErrorHandler } from "../error/errors-handler";
import {
  IVendaRepository,
  CreateVendaInput,
  UpdateVendaInput,
  TVenda,
  TVendaWithRelations,
  TVendaComplete,
  IVendaStats,
  ITopCliente,
  IVendaMensal,
} from "./venda.entity";
import {
  VendaNotFoundError,
  VendaConflictError,
  VendaBusinessRulesError,
} from "./venda.errors";
import { VendaValidator } from "./venda.validator";
import { PrismaClient } from "@/infrastructure/generated/prisma";
import { prisma } from "@/infrastructure";
import { ClienteService } from "../cliente/cliente.service";
import { ClienteRepository } from "../cliente/cliente.repository";
import { PedidoService } from "../pedidos/pedido.service";
import { PedidoRepository } from "../pedidos/pedido.repository";

export class VendaService {
  private clienteService: ClienteService;
  private pedidoService: PedidoService;

  constructor(
    private vendaRepository: IVendaRepository,
    private readonly db: PrismaClient = prisma
  ) {
    // Inicializar serviços de dependências para delegar operações
    this.clienteService = new ClienteService(new ClienteRepository());
    this.pedidoService = new PedidoService(new PedidoRepository());
  }

  async create(data: CreateVendaInput): Promise<TVenda> {
    try {
      VendaValidator.validateCreateInput(data);

      // Verificar se o cliente existe e está ativo - delegado ao ClienteService
      await this.validateClienteExists(data.clienteId);

      // Verificar se o pedido existe e está entregue - delegado ao PedidoService
      await this.validatePedidoExists(data.pedidoId);

      // Verificar se já existe venda para este pedido
      await this.validatePedidoNaoVendido(data.pedidoId);

      // Validar total da venda vs total do pedido
      await this.validateTotalVsPedido(data.pedidoId, data.total);

      // Validar desconto vs total se fornecido
      if (data.desconto && data.desconto > 0) {
        VendaValidator.validateDescontoVsTotal(data.desconto, data.total);
      }

      // Criar a venda
      const venda = await this.vendaRepository.create(data);

      return venda;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "criação de venda");
    }
  }

  async update(id: string, data: UpdateVendaInput): Promise<TVenda> {
    try {
      VendaValidator.validateId(id);
      VendaValidator.validateUpdateInput(data);

      const existingVenda = await this.vendaRepository.findById(id);
      if (!existingVenda) {
        throw new VendaNotFoundError(id);
      }

      // Validar desconto vs total se fornecido
      if (data.desconto !== undefined && data.total !== undefined) {
        VendaValidator.validateDescontoVsTotal(data.desconto, data.total);
      } else if (data.desconto !== undefined) {
        VendaValidator.validateDescontoVsTotal(data.desconto, existingVenda.total);
      } else if (data.total !== undefined) {
        const desconto = 0; // Assumir desconto zero se não fornecido
        VendaValidator.validateDescontoVsTotal(desconto, data.total);
      }

      // Validar troco se fornecido
      if (data.troco !== undefined && data.troco > 0) {
        if (data.formaPagamento !== "dinheiro") {
          throw new VendaBusinessRulesError(
            "Troco só é permitido para pagamentos em dinheiro",
            "troco_sem_dinheiro",
            { troco: data.troco, formaPagamento: data.formaPagamento }
          );
        }
      }

      const updatedVenda = await this.vendaRepository.update(id, data);

      return updatedVenda;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "atualização de venda");
    }
  }

  async delete(id: string): Promise<TVenda> {
    try {
      VendaValidator.validateId(id);

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
      VendaValidator.validateId(id);
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

  async findByClienteId(clienteId: string): Promise<TVendaWithRelations[]> {
    try {
      return await this.vendaRepository.findByClienteId(clienteId);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de vendas por cliente"
      );
    }
  }

  async findByPedidoId(pedidoId: string): Promise<TVenda | null> {
    try {
      return await this.vendaRepository.findByPedidoId(pedidoId);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de venda por pedido"
      );
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

  async getStatistics(): Promise<IVendaStats> {
    try {
      const stats = await this.vendaRepository.getStatistics();
      
      // Calcular crescimento mensal (simulado - seria necessário dados do mês anterior)
      const crescimentoMensal = 0; // Implementar lógica de crescimento
      
      return {
        ...stats,
        crescimentoMensal,
      };
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "cálculo de estatísticas de vendas"
      );
    }
  }

  async getTopClientes(limit: number = 10): Promise<ITopCliente[]> {
    try {
      const topClientes = await this.vendaRepository.getTopClientes(limit);
      
      // Enriquecer com data da última compra
      const clientesEnriquecidos: ITopCliente[] = [];
      
      for (const cliente of topClientes) {
        const vendasCliente = await this.vendaRepository.findByClienteId(cliente.clienteId);
        const ultimaVenda = vendasCliente[0]; // Já vem ordenado por data desc
        
        clientesEnriquecidos.push({
          ...cliente,
          ultimaCompra: ultimaVenda?.data || new Date(),
        });
      }
      
      return clientesEnriquecidos;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de top clientes"
      );
    }
  }

  async getVendasByMonth(year: number): Promise<IVendaMensal[]> {
    try {
      const vendasMensais = await this.vendaRepository.getVendasByMonth(year);
      
      const nomesMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];
      
      return vendasMensais.map((venda, index) => ({
        ...venda,
        nomesMes: nomesMeses[venda.mes - 1],
        crescimento: index > 0 ? 
          ((venda.faturamento - vendasMensais[index - 1].faturamento) / vendasMensais[index - 1].faturamento) * 100 : 0
      }));
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de vendas mensais"
      );
    }
  }

  async processarVendaPedido(
    pedidoId: string,
    formaPagamento: "dinheiro" | "cartao_debito" | "cartao_credito" | "pix",
    userId: string,
    valorPago?: number,
    desconto?: number
  ): Promise<TVenda> {
    try {
      // Buscar pedido completo - delegado ao PedidoService
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

      // Calcular total com desconto
      const totalComDesconto = desconto ? pedido.total - desconto : pedido.total;
      
      // Calcular troco se pagamento em dinheiro
      let troco = 0;
      if (formaPagamento === "dinheiro" && valorPago) {
        troco = valorPago - totalComDesconto;
        if (troco < 0) {
          throw new VendaBusinessRulesError(
            `Valor pago (${valorPago}) é insuficiente para o total (${totalComDesconto})`,
            "troco_sem_dinheiro",
            { valorPago, total: totalComDesconto }
          );
        }
      }

      // Criar venda
      const vendaData: CreateVendaInput = {
        clienteId: pedido.clienteId,
        pedidoId: pedido.id,
        total: totalComDesconto,
        formaPagamento,
        desconto: desconto || 0,
        troco,
        criadoPorId: userId,
        atualizadoPorId: userId,
      };

      return await this.create(vendaData);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "processamento de venda do pedido"
      );
    }
  }

  // Métodos privados de validação
  private async validateClienteExists(clienteId: string): Promise<void> {
    // Delegar para ClienteService - responsabilidade do módulo cliente
    const cliente = await this.clienteService.findById(clienteId);

    if (!cliente) {
      throw new VendaBusinessRulesError(
        `Cliente com ID ${clienteId} não encontrado`,
        "cliente_inativo",
        { clienteId }
      );
    }

    if (cliente.status !== "ATIVO") {
      throw new VendaBusinessRulesError(
        `Cliente ${cliente.nome} está inativo`,
        "cliente_inativo",
        { clienteId, nome: cliente.nome }
      );
    }
  }

  private async validatePedidoExists(pedidoId: string): Promise<void> {
    // Delegar para PedidoService - responsabilidade do módulo pedido
    const pedido = await this.pedidoService.findById(pedidoId);

    if (!pedido) {
      throw new VendaBusinessRulesError(
        `Pedido com ID ${pedidoId} não encontrado`,
        "pedido_nao_encontrado",
        { pedidoId }
      );
    }

    if (pedido.status !== "ENTREGUE") {
      throw new VendaBusinessRulesError(
        `Pedido ${pedidoId} não está entregue (status: ${pedido.status})`,
        "pedido_nao_entregue",
        { pedidoId, status: pedido.status }
      );
    }
  }

  private async validatePedidoNaoVendido(pedidoId: string): Promise<void> {
    const vendaExistente = await this.vendaRepository.findByPedidoId(pedidoId);

    if (vendaExistente) {
      throw new VendaConflictError(
        "pedido_ja_vendido",
        `${pedidoId}-${vendaExistente.id}`
      );
    }
  }

  private async validateTotalVsPedido(
    pedidoId: string,
    totalVenda: number
  ): Promise<void> {
    // Delegar para PedidoService o cálculo do total
    const totalPedido = await this.pedidoService.calculateTotal(pedidoId);
    VendaValidator.validateTotalVsPedido(totalVenda, totalPedido);
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