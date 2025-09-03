import { ClienteService } from "@/core/cliente/domain/cliente.service";
import { ClienteRepository } from "@/core/cliente/domain/cliente.repository";

import { StatusCode } from "@/core/error";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/user";
import { Client } from "@/core/cliente/domain/cliente";
import { EnderecoService } from "@/core/endereco/domain/endereco.service";
import { EnderecoRepository } from "@/core/endereco/domain/endereco.repository";
import { prisma } from "@/infrastructure";
import { Endereco } from "@/core/endereco/domain/endereco";

export async function PUT(req: NextRequest) {
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
        id,
        endereco,
        enderecoId,
        cidade,
        estado,
        numero,
        cep,
        ...clienteToUpdate
      } = body;

      if (!id) {
        return NextResponse.json(
          { message: "ID do cliente é obrigatório" },
          { status: StatusCode.BAD_REQUEST }
        );
      }
      const enderecoToUpdate = {
        id: enderecoId,
        cidade,
        estado,
        numero,
        cep,
        logradouro: endereco,
      };
      clienteToUpdate.atualizadoPorId = currentUser.id;
      if (clienteToUpdate.aniversario) {
        clienteToUpdate.aniversario = new Date(clienteToUpdate.aniversario);
      }

      const data = Client.update(clienteToUpdate);

      const enderecoData = Endereco.update(enderecoToUpdate);
      const cliente = await clienteService.update(id, data);
      const { id: idEndereco } = enderecoToUpdate;
      const enderecoUpdated = await enderecoService.update(
        idEndereco,
        enderecoData
      );

      return {
        ...cliente,
        endereco: enderecoUpdated,
      };
    });

    return NextResponse.json(sucess);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno no servidor ao atualizar cliente" },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
