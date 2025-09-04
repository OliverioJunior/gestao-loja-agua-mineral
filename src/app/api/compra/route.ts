import { NextRequest, NextResponse } from "next/server";
import { CompraRepository } from "@/core/compra/domain/compra.repository";
import { CreateCompraInput } from "@/core/compra/domain/compra.entity";
import { ItemCompraRepository } from "@/core/item-compra/domain/item-compra.repository";
import { CreateItemCompraInput } from "@/core/item-compra/domain/item-compra.entity";
import { StatusCompra } from "@/infrastructure/generated/prisma";
import { getCurrentUser } from "@/shared/lib/user";

// GET - Listar todas as compras
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fornecedorId = searchParams.get("fornecedorId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const numeroNota = searchParams.get("numeroNota");

    const compraRepository = new CompraRepository();
    let compras;

    if (numeroNota) {
      const compra = await compraRepository.findByNumeroNota(numeroNota);
      compras = compra ? [compra] : [];
    } else if (fornecedorId) {
      compras = await compraRepository.findByFornecedorId(fornecedorId);
    } else if (status) {
      compras = await compraRepository.findByStatus(status as StatusCompra);
    } else if (startDate && endDate) {
      compras = await compraRepository.findByDateRange(
        new Date(startDate),
        new Date(endDate)
      );
    } else {
      compras = await compraRepository.findAll();
    }

    return NextResponse.json({
      success: true,
      data: compras,
      message: "Compras listadas com sucesso",
    });
  } catch (error) {
    console.error("Erro ao listar compras:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

// POST - Criar nova compra
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Usuário não autenticado",
        },
        { status: 401 }
      );
    }
    const body = await request.json();

    // Validar dados obrigatórios
    if (
      !body.fornecedorId ||
      !body.dataCompra ||
      !body.total ||
      !body.formaPagamento
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados obrigatórios não fornecidos",
        },
        { status: 400 }
      );
    }

    const compraData: CreateCompraInput = {
      fornecedorId: body.fornecedorId,
      numeroNota: body.numeroNota || null,
      dataCompra: new Date(body.dataCompra),
      dataVencimento: body.dataVencimento
        ? new Date(body.dataVencimento)
        : null,
      total: body.total,
      desconto: body.desconto || null,
      frete: body.frete || null,
      impostos: body.impostos || null,
      formaPagamento: body.formaPagamento,
      status: body.status || "PENDENTE",
      observacoes: body.observacoes || null,
      criadoPorId: user.id,
    };

    const compraRepository = new CompraRepository();
    const compra = await compraRepository.create(compraData);

    // Criar itens da compra se fornecidos
    if (body.itens && Array.isArray(body.itens) && body.itens.length > 0) {
      const itemCompraRepository = new ItemCompraRepository();
      
      for (const item of body.itens) {
        const itemData: CreateItemCompraInput = {
          compraId: compra.id,
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: Math.round(item.precoUnitario * 100), // Converter para centavos
          precoTotal: Math.round(item.precoTotal * 100), // Converter para centavos
          desconto: item.desconto ? Math.round(item.desconto * 100) : null,
          criadoPorId: user.id,
        };
        
        await itemCompraRepository.create(itemData);
      }
    }

    // Buscar compra completa com itens para retornar
    const compraCompleta = await compraRepository.findById(compra.id);

    return NextResponse.json(
      {
        success: true,
        data: compraCompleta,
        message: "Compra criada com sucesso",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar compra:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
