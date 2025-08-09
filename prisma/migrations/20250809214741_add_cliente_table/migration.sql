-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ATIVO', 'INATIVO');

-- CreateTable
CREATE TABLE "public"."clientes" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "aniversario" DATE,
    "email" VARCHAR(200) NOT NULL,
    "telefone" VARCHAR(16) NOT NULL,
    "endereco" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'ATIVO',
    "cidade" VARCHAR(200) NOT NULL,
    "estado" VARCHAR(200) NOT NULL,
    "CEP" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);
