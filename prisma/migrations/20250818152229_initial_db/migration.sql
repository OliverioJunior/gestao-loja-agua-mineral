-- CreateEnum
CREATE TYPE "public"."StatusPedido" AS ENUM ('PENDENTE', 'CONFIRMADO', 'PREPARANDO', 'ENTREGUE', 'CANCELADO');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "public"."TiposEndereco" AS ENUM ('RESIDENCIAL', 'COMERCIAL', 'APARTAMENTO', 'OUTRO');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."produtos" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "marca" VARCHAR(100),
    "preco_custo" INTEGER NOT NULL,
    "preco_venda" INTEGER NOT NULL,
    "preco_revenda" INTEGER,
    "preco_promocao" INTEGER,
    "estoque" INTEGER NOT NULL DEFAULT 0,
    "estoque_minimo" INTEGER DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "promocao" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "categoria_id" UUID,
    "criado_por_id" UUID NOT NULL,
    "atualizado_por_id" UUID NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categorias" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "productsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "criadoPorId" UUID NOT NULL,
    "atualizadoPorId" UUID NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clientes" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "aniversario" DATE,
    "email" VARCHAR(255) NOT NULL,
    "telefone" VARCHAR(20) NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'ATIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "criado_por_id" UUID NOT NULL,
    "atualizado_por_id" UUID NOT NULL,
    "endereco_id" UUID NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Endereco" (
    "id" UUID NOT NULL,
    "clienteId" UUID NOT NULL,
    "logradouro" VARCHAR(255) NOT NULL,
    "numero" VARCHAR(10) NOT NULL,
    "complemento" VARCHAR(100),
    "bairro" VARCHAR(100) NOT NULL,
    "cidade" VARCHAR(100) NOT NULL,
    "estado" VARCHAR(2) NOT NULL,
    "cep" VARCHAR(9) NOT NULL,
    "tipo" "public"."TiposEndereco" NOT NULL DEFAULT 'RESIDENCIAL',
    "principal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pedidos" (
    "id" UUID NOT NULL,
    "cliente_id" UUID NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" INTEGER NOT NULL,
    "status" "public"."StatusPedido" NOT NULL DEFAULT 'PENDENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "endereco_id" UUID NOT NULL,
    "criado_por_id" UUID NOT NULL,
    "atualizado_por_id" UUID NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."itens" (
    "id" UUID NOT NULL,
    "pedido_id" UUID NOT NULL,
    "produto_id" UUID NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "criado_por_id" UUID NOT NULL,
    "atualizado_por_id" UUID NOT NULL,

    CONSTRAINT "itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vendas" (
    "id" UUID NOT NULL,
    "cliente_id" UUID NOT NULL,
    "pedido_id" UUID NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "criado_por_id" UUID NOT NULL,
    "atualizado_por_id" UUID NOT NULL,

    CONSTRAINT "vendas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "produtos_nome_idx" ON "public"."produtos"("nome");

-- CreateIndex
CREATE INDEX "produtos_marca_idx" ON "public"."produtos"("marca");

-- CreateIndex
CREATE INDEX "produtos_ativo_idx" ON "public"."produtos"("ativo");

-- CreateIndex
CREATE INDEX "produtos_promocao_idx" ON "public"."produtos"("promocao");

-- CreateIndex
CREATE INDEX "produtos_categoria_id_idx" ON "public"."produtos"("categoria_id");

-- CreateIndex
CREATE INDEX "categorias_nome_idx" ON "public"."categorias"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "public"."clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_telefone_key" ON "public"."clientes"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_endereco_id_key" ON "public"."clientes"("endereco_id");

-- CreateIndex
CREATE INDEX "clientes_email_idx" ON "public"."clientes"("email");

-- CreateIndex
CREATE INDEX "clientes_telefone_idx" ON "public"."clientes"("telefone");

-- CreateIndex
CREATE INDEX "clientes_status_idx" ON "public"."clientes"("status");

-- CreateIndex
CREATE INDEX "Endereco_clienteId_idx" ON "public"."Endereco"("clienteId");

-- CreateIndex
CREATE INDEX "Endereco_cep_idx" ON "public"."Endereco"("cep");

-- CreateIndex
CREATE UNIQUE INDEX "Endereco_logradouro_numero_cidade_bairro_clienteId_key" ON "public"."Endereco"("logradouro", "numero", "cidade", "bairro", "clienteId");

-- CreateIndex
CREATE INDEX "pedidos_cliente_id_idx" ON "public"."pedidos"("cliente_id");

-- CreateIndex
CREATE INDEX "pedidos_status_idx" ON "public"."pedidos"("status");

-- CreateIndex
CREATE INDEX "pedidos_data_idx" ON "public"."pedidos"("data");

-- CreateIndex
CREATE INDEX "itens_pedido_id_idx" ON "public"."itens"("pedido_id");

-- CreateIndex
CREATE INDEX "itens_produto_id_idx" ON "public"."itens"("produto_id");

-- CreateIndex
CREATE INDEX "vendas_cliente_id_idx" ON "public"."vendas"("cliente_id");

-- CreateIndex
CREATE INDEX "vendas_pedido_id_idx" ON "public"."vendas"("pedido_id");

-- CreateIndex
CREATE INDEX "vendas_data_idx" ON "public"."vendas"("data");

-- AddForeignKey
ALTER TABLE "public"."produtos" ADD CONSTRAINT "produtos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."produtos" ADD CONSTRAINT "produtos_criado_por_id_fkey" FOREIGN KEY ("criado_por_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."produtos" ADD CONSTRAINT "produtos_atualizado_por_id_fkey" FOREIGN KEY ("atualizado_por_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categorias" ADD CONSTRAINT "categorias_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categorias" ADD CONSTRAINT "categorias_atualizadoPorId_fkey" FOREIGN KEY ("atualizadoPorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "public"."Endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_criado_por_id_fkey" FOREIGN KEY ("criado_por_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_atualizado_por_id_fkey" FOREIGN KEY ("atualizado_por_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "public"."Endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_criado_por_id_fkey" FOREIGN KEY ("criado_por_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_atualizado_por_id_fkey" FOREIGN KEY ("atualizado_por_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens" ADD CONSTRAINT "itens_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "public"."pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens" ADD CONSTRAINT "itens_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "public"."produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens" ADD CONSTRAINT "itens_criado_por_id_fkey" FOREIGN KEY ("criado_por_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens" ADD CONSTRAINT "itens_atualizado_por_id_fkey" FOREIGN KEY ("atualizado_por_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vendas" ADD CONSTRAINT "vendas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vendas" ADD CONSTRAINT "vendas_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "public"."pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vendas" ADD CONSTRAINT "vendas_criado_por_id_fkey" FOREIGN KEY ("criado_por_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vendas" ADD CONSTRAINT "vendas_atualizado_por_id_fkey" FOREIGN KEY ("atualizado_por_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
