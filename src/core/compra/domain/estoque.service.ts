import { prisma } from "@/infrastructure";
import { TCompraWithRelations } from "./compra.entity";

/**
 * Serviço responsável por atualizar o estoque quando compras são recebidas
 */
export class EstoqueService {
  /**
   * Atualiza o estoque dos produtos quando uma compra é recebida
   */
  static async atualizarEstoqueCompra(
    compra: TCompraWithRelations
  ): Promise<void> {
    if (compra.status !== "RECEBIDA") {
      throw new Error("Apenas compras recebidas podem atualizar o estoque");
    }

    if (!compra.itens || compra.itens.length === 0) {
      console.warn(
        `Compra ${compra.id} não possui itens para atualizar estoque`
      );
      return;
    }

    // Usar transação para garantir consistência
    await prisma.$transaction(async (tx) => {
      for (const item of compra.itens) {
        // Buscar produto atual
        const produto = await tx.produto.findUnique({
          where: { id: item.produtoId },
        });

        if (!produto) {
          console.warn(
            `Produto ${item.produtoId} não encontrado para atualizar estoque`
          );
          continue;
        }

        // Calcular novo estoque
        const novoEstoque = produto.estoque + item.quantidade;

        // Atualizar estoque do produto
        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            estoque: novoEstoque,
            updatedAt: new Date(),
          },
        });

        console.log(
          `Estoque atualizado - Produto: ${produto.nome}, ` +
            `Quantidade anterior: ${produto.estoque}, ` +
            `Quantidade adicionada: ${item.quantidade}, ` +
            `Novo estoque: ${novoEstoque}`
        );
      }
    });
  }

  /**
   * Reverte a atualização de estoque quando uma compra recebida é cancelada
   */
  static async reverterEstoqueCompra(
    compra: TCompraWithRelations
  ): Promise<void> {
    if (!compra.itens || compra.itens.length === 0) {
      console.warn(
        `Compra ${compra.id} não possui itens para reverter estoque`
      );
      return;
    }

    // Usar transação para garantir consistência
    await prisma.$transaction(async (tx) => {
      for (const item of compra.itens) {
        // Buscar produto atual
        const produto = await tx.produto.findUnique({
          where: { id: item.produtoId },
        });

        if (!produto) {
          console.warn(
            `Produto ${item.produtoId} não encontrado para reverter estoque`
          );
          continue;
        }

        // Calcular novo estoque (subtraindo a quantidade)
        const novoEstoque = Math.max(0, produto.estoque - item.quantidade);

        // Atualizar estoque do produto
        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            estoque: novoEstoque,
            updatedAt: new Date(),
          },
        });

        // Registrar movimentação de estoque

        console.log(
          `Estoque revertido - Produto: ${produto.nome}, ` +
            `Quantidade anterior: ${produto.estoque}, ` +
            `Quantidade removida: ${item.quantidade}, ` +
            `Novo estoque: ${novoEstoque}`
        );
      }
    });
  }

  /**
   * Verifica se há estoque suficiente para uma operação
   */
  static async verificarEstoqueDisponivel(
    produtoId: string,
    quantidadeNecessaria: number
  ): Promise<{ disponivel: boolean; estoqueAtual: number }> {
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId },
    });

    if (!produto) {
      throw new Error(`Produto ${produtoId} não encontrado`);
    }

    return {
      disponivel: produto.estoque >= quantidadeNecessaria,
      estoqueAtual: produto.estoque,
    };
  }

  /**
   * Obtém produtos com estoque baixo
   */
  static async getProdutosEstoqueBaixo() {
    return await prisma.produto.findMany({
      where: {
        OR: [
          { estoque: 0 },
          {
            AND: [
              { estoque: { gt: 0 } },
              { estoque: { lte: prisma.produto.fields.estoqueMinimo } },
            ],
          },
        ],
        ativo: true,
      },
      include: {
        categoria: true,
      },
      orderBy: [{ estoque: "asc" }, { nome: "asc" }],
    });
  }

  /**
   * Gera relatório de movimentação de estoque
   */
}
