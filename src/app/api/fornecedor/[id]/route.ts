import { NextRequest, NextResponse } from "next/server";
import { FornecedorRepository } from "@/core/fornecedor/domain/fornecedor.repository";
import { UpdateFornecedorInput } from "@/core/fornecedor/domain/fornecedor.entity";

// GET - Buscar fornecedor por ID
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const fornecedorRepository = new FornecedorRepository();
    const fornecedor = await fornecedorRepository.findById(id || "");

    if (!fornecedor) {
      return NextResponse.json(
        {
          success: false,
          error: "Fornecedor não encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: fornecedor,
      message: "Fornecedor encontrado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao buscar fornecedor:", error);
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

// PUT - Atualizar fornecedor
export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const body = await request.json();

    const updateData: UpdateFornecedorInput = {
      nome: body.nome,
      razaoSocial: body.razaoSocial || null,
      cnpj: body.cnpj || null,
      cpf: body.cpf || null,
      email: body.email || null,
      telefone: body.telefone || null,
      endereco: body.endereco || null,

      observacoes: body.observacoes || null,
      atualizadoPorId: body.atualizadoPorId || "system", // TODO: Obter do contexto de autenticação
    };

    const fornecedorRepository = new FornecedorRepository();
    const fornecedor = await fornecedorRepository.update(id || "", updateData);

    return NextResponse.json({
      success: true,
      data: fornecedor,
      message: "Fornecedor atualizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar fornecedor:", error);
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

// DELETE - Excluir fornecedor
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const fornecedorRepository = new FornecedorRepository();
    await fornecedorRepository.delete(id || "");

    return NextResponse.json({
      success: true,
      message: "Fornecedor excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir fornecedor:", error);
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
