import { NextRequest, NextResponse } from "next/server";
import { Fornecedor } from "@/core/fornecedor";
import { CreateFornecedorInput } from "@/core/fornecedor/domain/fornecedor.entity";
import { getCurrentUser } from "@/shared/lib/user";

// GET - Listar todos os fornecedores
export async function GET() {
  try {
    const fornecedores = await Fornecedor.service.findAll();

    return NextResponse.json({
      success: true,
      data: fornecedores,
      message: "Fornecedores listados com sucesso",
    });
  } catch (error) {
    console.error("Erro ao listar fornecedores:", error);
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

// POST - Criar novo fornecedor
export async function POST(request: NextRequest) {
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

  try {
    const body = await request.json();
    // Validar dados obrigatórios
    if (!body.nome || (!body.cnpj && !body.cpf)) {
      return NextResponse.json(
        {
          success: false,
          error: "Nome e documento (CNPJ ou CPF) são obrigatórios",
        },
        { status: 400 }
      );
    }

    const fornecedorData: CreateFornecedorInput = {
      nome: body.nome,
      razaoSocial: body.razaoSocial || null,
      cnpj: body.cnpj || null,
      cpf: body.cpf || null,
      email: body.email || null,
      telefone: body.telefone || null,
      endereco: body.endereco || null,
      status: body.status || "ATIVO",
      observacoes: body.observacoes || null,
      criadoPorId: user.id,
    };

    const fornecedor = await Fornecedor.service.create(fornecedorData);

    return NextResponse.json(
      {
        success: true,
        data: fornecedor,
        message: "Fornecedor criado com sucesso",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar fornecedor:", error);
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
