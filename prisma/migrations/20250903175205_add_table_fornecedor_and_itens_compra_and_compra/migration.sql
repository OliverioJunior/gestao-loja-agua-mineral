-- CreateEnum
CREATE TYPE "public"."FormaPagamentoCompra" AS ENUM ('DINHEIRO', 'PIX', 'CARTAO_DEBITO', 'CARTAO_CREDITO', 'TRANSFERENCIA', 'BOLETO', 'CHEQUE', 'PRAZO');

-- CreateEnum
CREATE TYPE "public"."StatusCompra" AS ENUM ('PENDENTE', 'CONFIRMADA', 'RECEBIDA', 'CANCELADA');

-- CreateTable
CREATE TABLE "public"."fornecedores" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "razao_social" VARCHAR(255),
    "cnpj" VARCHAR(18),
    "cpf" VARCHAR(14),
    "email" VARCHAR(255),
    "telefone" VARCHAR(20),
    "endereco" TEXT,
    "observacoes" TEXT,
    "status" "public"."Status" NOT NULL DEFAULT 'ATIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "criado_por_id" UUID NOT NULL,
    "atualizado_por_id" UUID,

    CONSTRAINT "fornecedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."compras" (
    "id" UUID NOT NULL,
    "fornecedor_id" UUID NOT NULL,
    "numero_nota" VARCHAR(50),
    "data_compra" DATE NOT NULL,
    "data_vencimento" DATE,
    "total" INTEGER NOT NULL,
    "desconto" INTEGER DEFAULT 0,
    "frete" INTEGER DEFAULT 0,
    "impostos" INTEGER DEFAULT 0,
    "forma_pagamento" "public"."FormaPagamentoCompra" NOT NULL,
    "status" "public"."StatusCompra" NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "criado_por_id" UUID NOT NULL,
    "atualizado_por_id" UUID,

    CONSTRAINT "compras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."itens_compra" (
    "id" UUID NOT NULL,
    "compra_id" UUID NOT NULL,
    "produto_id" UUID NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco_unitario" INTEGER NOT NULL,
    "preco_total" INTEGER NOT NULL,
    "desconto" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "criado_por_id" UUID NOT NULL,
    "atualizado_por_id" UUID,

    CONSTRAINT "itens_compra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fornecedores_cnpj_key" ON "public"."fornecedores"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "fornecedores_cpf_key" ON "public"."fornecedores"("cpf");

-- CreateIndex
CREATE INDEX "fornecedores_nome_idx" ON "public"."fornecedores"("nome");

-- CreateIndex
CREATE INDEX "fornecedores_cnpj_idx" ON "public"."fornecedores"("cnpj");

-- CreateIndex
CREATE INDEX "fornecedores_cpf_idx" ON "public"."fornecedores"("cpf");

-- CreateIndex
CREATE INDEX "fornecedores_status_idx" ON "public"."fornecedores"("status");

-- CreateIndex
CREATE INDEX "compras_fornecedor_id_idx" ON "public"."compras"("fornecedor_id");

-- CreateIndex
CREATE INDEX "compras_data_compra_idx" ON "public"."compras"("data_compra");

-- CreateIndex
CREATE INDEX "compras_status_idx" ON "public"."compras"("status");

-- CreateIndex
CREATE INDEX "compras_numero_nota_idx" ON "public"."compras"("numero_nota");

-- CreateIndex
CREATE INDEX "itens_compra_compra_id_idx" ON "public"."itens_compra"("compra_id");

-- CreateIndex
CREATE INDEX "itens_compra_produto_id_idx" ON "public"."itens_compra"("produto_id");

-- AddForeignKey
ALTER TABLE "public"."fornecedores" ADD CONSTRAINT "fornecedores_criado_por_id_fkey" FOREIGN KEY ("criado_por_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fornecedores" ADD CONSTRAINT "fornecedores_atualizado_por_id_fkey" FOREIGN KEY ("atualizado_por_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."compras" ADD CONSTRAINT "compras_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fornecedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."compras" ADD CONSTRAINT "compras_criado_por_id_fkey" FOREIGN KEY ("criado_por_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."compras" ADD CONSTRAINT "compras_atualizado_por_id_fkey" FOREIGN KEY ("atualizado_por_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens_compra" ADD CONSTRAINT "itens_compra_compra_id_fkey" FOREIGN KEY ("compra_id") REFERENCES "public"."compras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens_compra" ADD CONSTRAINT "itens_compra_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "public"."produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens_compra" ADD CONSTRAINT "itens_compra_criado_por_id_fkey" FOREIGN KEY ("criado_por_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens_compra" ADD CONSTRAINT "itens_compra_atualizado_por_id_fkey" FOREIGN KEY ("atualizado_por_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
