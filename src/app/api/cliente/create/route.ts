import { StatusCode } from "@/core/error";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/user";
import { ClienteRepository } from "@/core/cliente/cliente.repository";
import { ClienteService } from "@/core/cliente/cliente.service";
import { Client } from "@/core/cliente/cliente";
import { EnderecoService } from "@/core/endereco/endereco.service";
import { EnderecoRepository } from "@/core/endereco/endereco.repository";
import { Endereco } from "@/core/endereco/endereco";
import { TiposEndereco } from "@/infrastructure/generated/prisma";
import { prisma } from "@/infrastructure";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: StatusCode.UNAUTHORIZED }
      );
    }
    const body = await req.json();
    const sucess = await prisma.$transaction(async (tx) => {
      const clienteService = new ClienteService(new ClienteRepository(tx));
      const enderecoService = new EnderecoService(new EnderecoRepository(tx));

      const {
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        ...createClientData
      } = body;
      const clienteData = {
        ...createClientData,
        criadoPorId: currentUser.id,
      };

      const data = Client.create(clienteData);

      const cliente = await clienteService.create(data);

      const validEndereco = Endereco.create({
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        tipo: TiposEndereco.RESIDENCIAL,
        principal: true,
        complemento: null,
        clienteId: cliente.id,
      });

      const endereco = await enderecoService.create(validEndereco);
      await tx.cliente.update({
        where: {
          id: cliente.id,
        },
        data: {
          enderecoId: endereco.id,
        },
      });
      return { ...cliente, ...endereco };
    });

    return NextResponse.json(sucess);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Erro interno no servidor ao criar cliente",
      },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
