-- DropForeignKey
ALTER TABLE "public"."clientes" DROP CONSTRAINT "clientes_atualizado_por_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."clientes" DROP CONSTRAINT "clientes_criado_por_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."clientes" DROP CONSTRAINT "clientes_endereco_id_fkey";

-- AlterTable
ALTER TABLE "public"."clientes" ALTER COLUMN "criado_por_id" DROP NOT NULL,
ALTER COLUMN "atualizado_por_id" DROP NOT NULL,
ALTER COLUMN "endereco_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "public"."Endereco"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_criado_por_id_fkey" FOREIGN KEY ("criado_por_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_atualizado_por_id_fkey" FOREIGN KEY ("atualizado_por_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
