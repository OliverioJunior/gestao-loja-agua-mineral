import { ErrorHandler } from "../error/errors-handler";
import { Endereco } from "./endereco";
import {
  UpdateEnderecoInput,
  TEndereco,
  IEnderecoRepository,
  CreateEnderecoInput,
} from "./endereco.entity";
import { EnderecoValidator } from "./endereco.validator";

export class EnderecoService {
  constructor(private enderecoRepository: IEnderecoRepository) {}

  async create(data: CreateEnderecoInput): Promise<TEndereco> {
    try {
      const endereco = Endereco.create(data);
      return await this.enderecoRepository.create(endereco);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "criação de endereço");
    }
  }

  async update(id: string, data: UpdateEnderecoInput): Promise<TEndereco> {
    try {
      const endereco = Endereco.update(data);
      return await this.enderecoRepository.update(id, endereco);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "atualização de endereço"
      );
    }
  }

  async delete(id: string): Promise<TEndereco> {
    try {
      EnderecoValidator.validateId(id);
      return await this.enderecoRepository.delete(id);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "exclusão de endereço");
    }
  }

  async findById(id: string): Promise<TEndereco | null> {
    try {
      EnderecoValidator.validateId(id);
      return await this.enderecoRepository.findById(id);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de endereço");
    }
  }

  async findAll(): Promise<TEndereco[]> {
    try {
      return await this.enderecoRepository.findAll();
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de endereços");
    }
  }

  async findByLogradouro(logradouro: string): Promise<TEndereco[]> {
    try {
      EnderecoValidator.validateLogradouro(logradouro);
      return await this.enderecoRepository.findByLogradouro(logradouro);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de endereços por logradouro"
      );
    }
  }
}
