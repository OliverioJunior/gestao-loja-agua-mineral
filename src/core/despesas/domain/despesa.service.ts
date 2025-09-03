import { DespesaRepository } from "./despesa.repository";
import {
  ICreateDespesa,
  IUpdateDespesa,
  IDespesaFilters,
  IDespesaStats,
} from "./despesa.entity";
import { StatusCode } from "../../error";

export class DespesaService {
  constructor(private despesaRepository: DespesaRepository) {}

  async createDespesa(data: ICreateDespesa, userId: string) {
    try {
      // Validações
      if (!data.descricao || data.descricao.trim().length === 0) {
        return {
          success: false,
          message: "Descrição é obrigatória",
          statusCode: StatusCode.BAD_REQUEST,
        };
      }

      if (!data.valor || data.valor <= 0) {
        return {
          success: false,
          message: "Valor deve ser maior que zero",
          statusCode: StatusCode.BAD_REQUEST,
        };
      }

      if (!data.data) {
        return {
          success: false,
          message: "Data é obrigatória",
          statusCode: StatusCode.BAD_REQUEST,
        };
      }

      if (!data.categoria) {
        return {
          success: false,
          message: "Categoria é obrigatória",
          statusCode: StatusCode.BAD_REQUEST,
        };
      }

      if (!data.formaPagamento) {
        return {
          success: false,
          message: "Forma de pagamento é obrigatória",
          statusCode: StatusCode.BAD_REQUEST,
        };
      }

      const despesa = await this.despesaRepository.create(data, userId);

      return {
        success: true,
        data: despesa,
        message: "Despesa criada com sucesso",
        statusCode: StatusCode.CREATED,
      };
    } catch (error) {
      console.error("Erro ao criar despesa:", error);
      return {
        success: false,
        message: "Erro interno do servidor",
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getDespesaById(id: string) {
    try {
      if (!id) {
        return {
          success: false,
          message: "ID é obrigatório",
          statusCode: StatusCode.BAD_REQUEST,
        };
      }

      const despesa = await this.despesaRepository.findById(id);

      if (!despesa) {
        return {
          success: false,
          message: "Despesa não encontrada",
          statusCode: StatusCode.NOT_FOUND,
        };
      }

      return {
        success: true,
        data: despesa,
        statusCode: StatusCode.OK,
      };
    } catch (error) {
      console.error("Erro ao buscar despesa:", error);
      return {
        success: false,
        message: "Erro interno do servidor",
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getAllDespesas(filters?: IDespesaFilters) {
    try {
      const despesas = await this.despesaRepository.findAll(filters);

      return {
        success: true,
        data: despesas,
        statusCode: StatusCode.OK,
      };
    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
      return {
        success: false,
        message: "Erro interno do servidor",
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async updateDespesa(id: string, data: IUpdateDespesa, userId: string) {
    try {
      if (!id) {
        return {
          success: false,
          message: "ID é obrigatório",
          statusCode: StatusCode.BAD_REQUEST,
        };
      }

      // Verificar se a despesa existe
      const existingDespesa = await this.despesaRepository.findById(id);
      if (!existingDespesa) {
        return {
          success: false,
          message: "Despesa não encontrada",
          statusCode: StatusCode.NOT_FOUND,
        };
      }

      // Validações dos dados de atualização
      if (
        data.descricao !== undefined &&
        (data.descricao as string).trim().length === 0
      ) {
        return {
          success: false,
          message: "Descrição não pode estar vazia",
          statusCode: StatusCode.BAD_REQUEST,
        };
      }

      if (data.valor !== undefined && (data.valor as number) <= 0) {
        return {
          success: false,
          message: "Valor deve ser maior que zero",
          statusCode: StatusCode.BAD_REQUEST,
        };
      }

      const updatedDespesa = await this.despesaRepository.update(
        id,
        data,
        userId
      );

      return {
        success: true,
        data: updatedDespesa,
        message: "Despesa atualizada com sucesso",
        statusCode: StatusCode.OK,
      };
    } catch (error) {
      console.error("Erro ao atualizar despesa:", error);
      return {
        success: false,
        message: "Erro interno do servidor",
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async deleteDespesa(id: string) {
    try {
      if (!id) {
        return {
          success: false,
          message: "ID é obrigatório",
          statusCode: StatusCode.BAD_REQUEST,
        };
      }

      // Verificar se a despesa existe
      const existingDespesa = await this.despesaRepository.findById(id);
      if (!existingDespesa) {
        return {
          success: false,
          message: "Despesa não encontrada",
          statusCode: StatusCode.NOT_FOUND,
        };
      }

      await this.despesaRepository.delete(id);

      return {
        success: true,
        message: "Despesa excluída com sucesso",
        statusCode: StatusCode.OK,
      };
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
      return {
        success: false,
        message: "Erro interno do servidor",
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getDespesasStats(filters?: {
    dataInicio?: Date;
    dataFim?: Date;
  }): Promise<{
    success: boolean;
    data?: IDespesaStats;
    message?: string;
    statusCode: number;
  }> {
    try {
      const stats = await this.despesaRepository.getStats(filters);

      return {
        success: true,
        data: stats,
        statusCode: StatusCode.OK,
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas de despesas:", error);
      return {
        success: false,
        message: "Erro interno do servidor",
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
