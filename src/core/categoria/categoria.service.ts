import { ErrorHandler } from "../error/errors-handler";
import {
  ICategoriaRepository,
  CreateCategoriaInput,
  UpdateCategoriaInput,
  TCategoria,
} from "./categoria.entity";
import { CategoriaNotFoundError } from "./categoria.errors";
import { CategoriaValidator } from "./categoria.validator";

export class CategoriaService {
  constructor(private categoriaRepository: ICategoriaRepository) {}

  async create(data: CreateCategoriaInput): Promise<TCategoria> {
    try {
      const { data: validatedData } =
        CategoriaValidator.validateCreateInput(data);
      return await this.categoriaRepository.create(validatedData);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "criação de categoria");
    }
  }

  async update(id: string, data: UpdateCategoriaInput): Promise<TCategoria> {
    try {
      CategoriaValidator.validateId(id);
      CategoriaValidator.validateUpdateInput(data);

      const exists = await this.categoriaRepository.existsById(id);
      if (!exists) {
        throw new CategoriaNotFoundError("Categoria não encontrada");
      }

      return await this.categoriaRepository.update(id, data);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "atualização de categoria"
      );
    }
  }

  async delete(id: string): Promise<TCategoria> {
    try {
      CategoriaValidator.validateId(id);

      const exists = await this.categoriaRepository.existsById(id);
      if (!exists) {
        throw new CategoriaNotFoundError(id);
      }

      return await this.categoriaRepository.delete(id);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "exclusão de categoria");
    }
  }

  async findById(id: string): Promise<TCategoria | null> {
    try {
      CategoriaValidator.validateId(id);

      const categoria = await this.categoriaRepository.findById(id);
      if (!categoria) {
        throw new CategoriaNotFoundError(id);
      }

      return categoria;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de categoria");
    }
  }

  async findAll(): Promise<TCategoria[]> {
    try {
      return await this.categoriaRepository.findAll();
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de categorias");
    }
  }

  async findByNome(nome: string): Promise<TCategoria[]> {
    try {
      return await this.categoriaRepository.findByNome(nome);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de categorias por nome"
      );
    }
  }
}
