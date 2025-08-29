-- CreateEnum
CREATE TYPE "public"."CategoriaDespesa" AS ENUM ('OPERACIONAL', 'ADMINISTRATIVA', 'MARKETING', 'MANUTENCAO', 'TRANSPORTE', 'FORNECEDORES', 'IMPOSTOS', 'OUTRAS');

-- CreateEnum
CREATE TYPE "public"."FormaPagamentoDespesa" AS ENUM ('DINHEIRO', 'PIX', 'CARTAO_DEBITO', 'CARTAO_CREDITO', 'TRANSFERENCIA', 'BOLETO', 'CHEQUE');

-- CreateTable
CREATE TABLE "public"."despesas" (
    "id" UUID NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "valor" INTEGER NOT NULL,
    "data" DATE NOT NULL,
    "categoria" "public"."CategoriaDespesa" NOT NULL,
    "forma_pagamento" "public"."FormaPagamentoDespesa" NOT NULL,
    "observacoes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "criado_por_id" UUID NOT NULL,
    "atualizado_por_id" UUID,

    CONSTRAINT "despesas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "despesas_data_idx" ON "public"."despesas"("data");

-- CreateIndex
CREATE INDEX "despesas_categoria_idx" ON "public"."despesas"("categoria");

-- CreateIndex
CREATE INDEX "despesas_forma_pagamento_idx" ON "public"."despesas"("forma_pagamento");

-- AddForeignKey
ALTER TABLE "public"."despesas" ADD CONSTRAINT "despesas_criado_por_id_fkey" FOREIGN KEY ("criado_por_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."despesas" ADD CONSTRAINT "despesas_atualizado_por_id_fkey" FOREIGN KEY ("atualizado_por_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
